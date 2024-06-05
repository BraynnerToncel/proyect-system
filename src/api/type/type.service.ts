import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateTypeDto } from './dto/create-type.dto';
import { UpdateTypeDto } from './dto/update-type.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Type } from '@entity/api/type/type.entity';
import { DeleteResult, Repository } from 'typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { IType } from '@interface/api/type/type.interface';

@Injectable()
export class TypeService {
  @InjectRepository(Type)
  private readonly typeRepository: Repository<Type>;
  constructor(private readonly eventEmitter: EventEmitter2) {}

  async create(createTypeDto: CreateTypeDto): Promise<IType> {
    const { typeId }: IType = await this.typeRepository.save({
      ...createTypeDto,
    });

    const type = await this.typeRepository.findOne({
      where: { typeId },
    });
    this.eventEmitter.emit('emit', {
      channel: 'type/data',
      data: { ...type },
    });
    return type;
  }

  async findAll() {
    return await this.typeRepository.find();
  }

  async findOne(typeId: string): Promise<IType> {
    return await this.typeRepository.findOne({
      where: {
        typeId,
      },
    });
  }

  async update(typeId: string, updateTypeDto: UpdateTypeDto): Promise<IType> {
    await this.typeRepository.save({ typeId, ...updateTypeDto });

    const type = await this.typeRepository.findOne({
      where: { typeId },
    });

    this.eventEmitter.emit('emit', {
      channel: 'type/data',
      data: { ...type },
    });

    return type;
  }

  async remove(id: string) {
    const deleteresult: DeleteResult = await this.typeRepository.delete(id);
    if (deleteresult.affected === 0) {
      throw new BadRequestException(`Not found role with id ${id}`);
    }

    this.eventEmitter.emit('emit', {
      channel: 'type/data',
      data: { id, isDelete: true },
    });

    return id;
  }
}
