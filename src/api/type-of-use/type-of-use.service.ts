import { BadRequestException, Injectable } from '@nestjs/common';
import { UpdateTypeOfUseDto } from './dto/update-type-of-use.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOfUse } from '@entity/api/typeOfUse/typeOfUse.entity';
import { DeleteResult, Repository } from 'typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ITypeOfUse } from '@interface/api/typeOfUse/typeOfUse.interface';
import { CreateTypeOfUseDto } from './dto/create-type-of-use.dto';

@Injectable()
export class TypeOfUseService {
  @InjectRepository(TypeOfUse)
  private readonly repositoryTypeOfUse: Repository<TypeOfUse>;
  constructor(private readonly eventEmitter: EventEmitter2) {}

  async create(createTypeOfUseDto: CreateTypeOfUseDto): Promise<ITypeOfUse> {
    const { typeOfUseId }: ITypeOfUse = await this.repositoryTypeOfUse.save({
      ...createTypeOfUseDto,
    });
    const typeOfUse = await this.repositoryTypeOfUse.findOne({
      where: { typeOfUseId },
    });

    this.eventEmitter.emit('emit', {
      channel: 'typeOfUse/data',
      data: { ...typeOfUse },
    });

    return typeOfUse;
  }

  async findAll() {
    return await this.repositoryTypeOfUse.find();
  }

  async findOne(typeOfUseId: string): Promise<ITypeOfUse> {
    return await this.repositoryTypeOfUse.findOne({
      where: { typeOfUseId },
    });
  }

  async update(typeOfUseId: string, updateTypeOfUseDto: UpdateTypeOfUseDto) {
    await this.repositoryTypeOfUse.save({ typeOfUseId, ...updateTypeOfUseDto });
    const typeOfUse = await this.repositoryTypeOfUse.findOne({
      where: { typeOfUseId },
    });
    this.eventEmitter.emit('emit', {
      channel: 'typeOfUse/data',
      data: { ...typeOfUse },
    });
    return typeOfUse;
  }

  async remove(id: string) {
    const deleteResult: DeleteResult =
      await this.repositoryTypeOfUse.delete(id);

    if (deleteResult.affected === 0) {
      throw new BadRequestException(`Not found typeOfUse with id ${id}`);
    }
    this.eventEmitter.emit('emit', {
      channel: 'typeOfUse/data',
      data: { id, isDelete: true },
    });
    return id;
  }
}
