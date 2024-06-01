import { BadRequestException, Injectable } from '@nestjs/common';
import { UpdateElementDto } from './dto/update-element.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Element } from '@entity/api/element/element.entity';
import { DataSource, DeleteResult, Repository } from 'typeorm';
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
    const { typeId, featureInstall, elementName, elementState } =
      createElementDto;

    const type = await this.typeRepository.findOne({
      where: { typeId },
      relations: { feature: true },
    });

    if (!type) {
      throw new BadRequestException(`Type with ID ${typeId} not found`);
    }

    featureInstall.forEach(({ featureId, value }) => {
      if (!value?.trim()) {
        throw new BadRequestException(
          `Feature with ID ${featureId} must have a non-empty value.`,
        );
      }
    });

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.startTransaction();

    try {
      const element = await queryRunner.manager.save(Element, {
        elementName,
        elementState,
        type,
      });

      for (const { featureId, value } of featureInstall) {
        const featureEntity = await queryRunner.manager.findOne(Feature, {
          where: { featureId },
        });

        if (!featureEntity) {
          throw new BadRequestException(
            `Feature with ID ${featureId} not found`,
          );
        }

        await queryRunner.manager.save(Install, {
          element,
          feature: featureEntity,
          value,
        });
      }

      await queryRunner.commitTransaction();

      const rElement = await queryRunner.manager.findOne(Element, {
        where: { elementId: element.elementId },
        relations: ['install', 'install.feature'],
      });

      if (!rElement) {
        throw new BadRequestException(
          `Element with ID ${element.elementId} not found`,
        );
      }

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

  async update(
    elementId: string,
    updateElementDto: UpdateElementDto,
  ): Promise<IElement> {
    await this.elementRepository.save({ elementId, ...updateElementDto });

    const type = await this.elementRepository.findOne({
      where: { elementId },
      relations: { type: true },
    });

    this.eventEmitter.emit('emit', {
      channel: 'type/data',
      data: { ...type },
    });

    return type;
  }

  async remove(elementId: string): Promise<string> {
    const deleteResult: DeleteResult =
      await this.elementRepository.delete(elementId);

    if (!deleteResult.affected)
      throw new BadRequestException(`element ${elementId} was not deleted `);

    this.eventEmitter.emit('emit', {
      channel: 'element/data',
      data: { elementId, isDelete: true },
    });

    return elementId;
  }
}
