import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UpdateElementDto } from './dto/update-element.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Element } from '@entity/api/element/element.entity';
import { DataSource, Repository } from 'typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { IElement } from '@interface/api/element/element.interface';
import { CreateElementDto } from './dto/create-element.dto';
import { Type } from '@entity/api/type/type.entity';
import { Feature } from '@entity/api/feature/feature.entity';
import { Install } from '@entity/api/install/install.entity';

@Injectable()
export class ElementService {
  @InjectRepository(Element)
  private readonly elementRepository: Repository<Element>;
  @InjectRepository(Type)
  private readonly typeRepository: Repository<Type>;
  constructor(
    private readonly eventEmitter: EventEmitter2,
    private readonly dataSource: DataSource,
  ) {}

  async create(createElementDto: CreateElementDto) {
    const { typeId, featureInstall, elementName } = createElementDto;
    const type = await this.typeRepository.findOne({
      where: { typeId },
      relations: { feature: true },
    });

    if (!type) {
      throw new BadRequestException(`Type with ID ${typeId} not found`);
    }
    const requiredFeaturesValid = type.feature.every((feature) => {
      if (feature.featureRequired) {
        const featureDto = featureInstall.find(
          (f) => f.featureId === feature.featureId,
        );
        if (!featureDto || !featureDto.value) {
          return false;
        }
      }
      return true;
    });
    if (!requiredFeaturesValid) {
      throw new BadRequestException(
        `All required features must have a value for Type with ID ${typeId}`,
      );
    }

    featureInstall.some((features) => {
      const { featureId, value } = features;
      const feature = type.feature.find((f) => f.featureId === featureId);
      const isValueValid =
        (feature.featureRequired && value !== '' && value !== null) ||
        (!feature.featureRequired && value !== '');
      if (!isValueValid) {
        throw new BadRequestException(`error`);
      }
    });

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.startTransaction();
    try {
      const element = await queryRunner.manager.save(Element, {
        elementName,

        type,
      });
      for (const featureDto of featureInstall) {
        const { featureId, value } = featureDto;
        const featureEntity = await queryRunner.manager.findOne(Feature, {
          where: { featureId },
        });
        await queryRunner.manager.save(Install, {
          element,
          feature: featureEntity,
          value: value,
        });
      }
      const rElement = await queryRunner.manager.find(Element, {
        where: { elementId: element.elementId },
        relations: ['install', 'install.feature'],
      });
      await queryRunner.commitTransaction();

      return rElement;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(): Promise<Array<IElement>> {
    const elements = await this.elementRepository.find({
      relations: { install: true },
    });
    return elements;
  }

  async findOne(elementId: string): Promise<IElement> {
    return await this.elementRepository.findOne({
      where: { elementId },
      relations: { type: true },
    });
  }

  async update(Idelement: string, updateElementDto: UpdateElementDto) {
    const { typeId, featureInstall, elementName } = updateElementDto;
    const element = await this.elementRepository.findOne({
      where: { elementId: Idelement },
      relations: ['install'],
    });
    if (!element) {
      throw new NotFoundException(`Element with ID ${Idelement} not found`);
    }
    const type = await this.typeRepository.findOne({
      where: { typeId },
      relations: { feature: true },
    });
    if (!type) {
      throw new BadRequestException(`Type with ID ${typeId} not found`);
    }
    const requiredFeaturesValid = type.feature.every((feature) => {
      if (feature.featureRequired) {
        const featureDto = featureInstall.find(
          (f) => f.featureId === feature.featureId,
        );
        if (!featureDto || !featureDto.value) {
          return false;
        }
      }
      return true;
    });
    if (!requiredFeaturesValid) {
      throw new BadRequestException(
        `All required features must have a value for Type with ID ${typeId}`,
      );
    }
    featureInstall.some((features) => {
      const { featureId, value } = features;
      const feature = type.feature.find((f) => f.featureId === featureId);
      const isValueValid =
        (feature.featureRequired && value !== '' && value !== null) ||
        (!feature.featureRequired && value !== '');
      if (!isValueValid) {
        throw new BadRequestException(`error`);
      }
    });
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.startTransaction();
    try {
      await queryRunner.manager.delete(Install, {
        element,
      });
      element.elementName = elementName;
      // element.elementState = elementState;
      element.type = type;
      await queryRunner.manager.save(element);
      for (const featureDto of featureInstall) {
        const { featureId, value } = featureDto;
        const featureEntity = await queryRunner.manager.findOne(Feature, {
          where: { featureId },
        });
        await queryRunner.manager.save(Install, {
          element,
          feature: featureEntity,
          value: value,
        });
      }
      const rElement = await queryRunner.manager.find(Element, {
        where: { elementId: element.elementId },
        relations: ['install', 'install.feature'],
      });
      await queryRunner.commitTransaction();
      return rElement;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async remove(elementId: string): Promise<string> {
    const element = await this.elementRepository.findOne({
      where: { elementId },
      relations: ['install'],
    });
    if (!element) {
      throw new NotFoundException();
    }
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.startTransaction();
    try {
      await queryRunner.manager.delete(Install, { element });
      await queryRunner.manager.delete(Element, { elementId });
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
    return `element with ID ${elementId} has been deleteda`;
  }
}
