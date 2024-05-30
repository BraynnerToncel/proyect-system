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
  @InjectRepository(Feature)
  private readonly featureRepository: Repository<Feature>;
  // private readonly dataSource: DataSource;
  constructor(
    private readonly eventEmitter: EventEmitter2,
    private readonly dataSource: DataSource,
  ) {}

  async create(createElementDto: CreateElementDto) {
    console.log('createElementDto :>> ', createElementDto);
    const { typeId, featureIds, elementName, elementState } = createElementDto;

    const type = await this.typeRepository.findOne({
      where: { typeId },
    });
    if (!type) {
      throw new BadRequestException(`Type with ID ${typeId} not found`);
    }

    const typeFeatureIds = type.feature.map((feature) => feature.featureId);
    const validFeatures = featureIds.some((featureId) =>
      typeFeatureIds.includes(featureId),
    );

    if (!validFeatures) {
      throw new BadRequestException(
        `None of the provided features are associated with Type with ID ${typeId}`,
      );
    }
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    const element = this.elementRepository.create({
      elementName,
      elementState,
      type,
    });
    await queryRunner.manager.save(element);

    for (const featureId of featureIds) {
      const feature = await this.featureRepository.findOne({
        where: { featureId },
      });
      if (!feature) {
        throw new BadRequestException(`Feature with ID ${featureId} not found`);
      }
      console.log('feature :>> ', feature);
      const install = new Install();
      install.element = element;
      install.feature = feature;
      install.value = ` ${feature}`;
      await queryRunner.manager.save(install);
    }

    await queryRunner.commitTransaction();

    return { element, Install };
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
