import { BadRequestException, Injectable } from '@nestjs/common';
import { UpdateFeatureDto } from './dto/update-feature.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Feature } from '@entity/api/feature/feature.entity';
import { DeleteResult, Repository } from 'typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { IFeature } from '@interface/api/feature/feature.interface';
import { CreateFeatureDto } from './dto/create-feature.dto';

@Injectable()
export class FeatureService {
  @InjectRepository(Feature)
  private readonly featureRepository: Repository<Feature>;
  constructor(private readonly eventEmitter: EventEmitter2) {}

  async create(featureData: CreateFeatureDto): Promise<IFeature> {
    console.log('featureData :>> ', featureData);
    const { featureId }: IFeature = await this.featureRepository.save({
      ...featureData,
      featureName: featureData.featureName.toLowerCase(),
      featureState: featureData.featureState ?? true,
      featureRequired: featureData.featureRequired ?? true,
      featureUserName: featureData.featureUserName.toLowerCase(),
    });
    const feature = await this.featureRepository.findOne({
      loadEagerRelations: false,
      where: { featureId },
    });

    this.eventEmitter.emit('emit', {
      channel: 'user/data',
      data: { ...feature },
    });
    return feature;
  }

  async findAll(): Promise<Array<IFeature>> {
    return await this.featureRepository.find();
  }

  async findOne(featureId: string): Promise<IFeature> {
    return await this.featureRepository.findOne({
      where: { featureId },
    });
  }

  async update(
    featureId: string,
    updateFeatureDto: UpdateFeatureDto,
  ): Promise<IFeature> {
    await this.featureRepository.save({ featureId, ...updateFeatureDto });
    const feature = await this.featureRepository.findOne({
      where: { featureId },
    });
    this.eventEmitter.emit('emit', {
      channel: 'feature/data',
      data: { ...feature },
    });
    return feature;
  }

  async remove(id: string): Promise<string> {
    const deleteResult: DeleteResult = await this.featureRepository.delete(id);

    if (deleteResult.affected === 0) {
      throw new BadRequestException(`Not found role with id ${id}`);
    }
    this.eventEmitter.emit('emit', {
      channel: 'feature/data',
      data: { id, isDelete: true },
    });
    return id;
  }
}
