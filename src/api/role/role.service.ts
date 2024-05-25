import { BadRequestException, Injectable } from '@nestjs/common';
import { Role } from '@entity/api/role/role.entity';
import {
  ICreateRole,
  IRole,
  IUpdateRole,
} from '@interface/api/role/role.interface';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult, DeleteResult } from 'typeorm';

@Injectable()
export class RoleService {
  @InjectRepository(Role)
  private readonly roleRepository: Repository<Role>;

  constructor(private readonly eventEmitter: EventEmitter2) {}

  async create(createRole: ICreateRole): Promise<IRole> {
    const { roleId }: IRole = await this.roleRepository.save({
      ...createRole,
      roleState: true,
    });

    const role = await this.roleRepository.findOne({
      where: { roleId },
    });

    this.eventEmitter.emit('emit', {
      channel: 'role/data',
      data: { ...role },
    });

    return role;
  }

  async findAll(): Promise<Array<IRole>> {
    return await this.roleRepository.find();
  }

  async findOne(roleId: string): Promise<IRole> {
    return await this.roleRepository.findOne({
      where: {
        roleId,
      },
    });
  }

  async update(roleId: string, updateRole: IUpdateRole): Promise<IRole> {
    await this.roleRepository.save({ roleId, ...updateRole });

    const role = await this.roleRepository.findOne({
      where: { roleId },
    });

    this.eventEmitter.emit('emit', {
      channel: 'role/data',
      data: { ...role },
    });

    return role;
  }

  async updateState(
    roleId: string,
    { roleState }: Pick<IRole, 'roleState'>,
  ): Promise<IRole> {
    const updateResult: UpdateResult = await this.roleRepository.update(
      roleId,
      { roleState },
    );

    if (!updateResult)
      throw new BadRequestException(`role with id ${roleId} not found`);

    const role: IRole = await this.roleRepository.findOne({
      where: { roleId },
    });

    this.eventEmitter.emit('emit', {
      channel: 'role/data',
      data: { ...role },
    });

    return role;
  }

  async remove(roleId: string): Promise<string> {
    const deleteResult: DeleteResult = await this.roleRepository.delete(roleId);

    if (deleteResult.affected === 0) {
      throw new BadRequestException(`Not found role with id ${roleId}`);
    }

    this.eventEmitter.emit('emit', {
      channel: 'role/data',
      data: { roleId, isDelete: true },
    });

    return roleId;
  }
}
