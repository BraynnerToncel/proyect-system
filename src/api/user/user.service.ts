import { BadRequestException, Injectable } from '@nestjs/common';
import { User } from '@entity/api/user/user.entity';
import {
  ICreateUser,
  IUser,
  IUserFindCondition,
  IUpdateUser,
  IUserRestorePassword,
} from '@interface/api/user/user.interface';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import {
  Repository,
  UpdateResult,
  EntityNotFoundError,
  DeleteResult,
} from 'typeorm';

@Injectable()
export class UserService {
  @InjectRepository(User)
  private readonly userRepository: Repository<User>;
  constructor(private readonly eventEmitter: EventEmitter2) {}

  async create(userData: ICreateUser): Promise<IUser> {
    const encryptedPassword: string = await bcrypt.hash(
      userData.userPassword,
      10,
    );

    console.log('userData :>> ', userData);

    const { userId }: IUser = await this.userRepository.save({
      ...userData,
      username: userData.username.toLowerCase(),
      userState: userData.userState ?? true,
      userPassword: encryptedPassword,
      role: { roleId: userData.roleId },
      userCreatedAt: new Date().toISOString(),
      file: { fileId: userData.fileId },
    });

    const user = await this.userRepository.findOne({
      relations: { role: true },
      loadEagerRelations: false,
      select: { userPassword: false },
      where: { userId },
    });

    this.eventEmitter.emit('emit', {
      channel: 'user/data',
      data: { ...user },
    });

    return user;
  }

  async findAll(): Promise<Array<IUser>> {
    const users: Array<IUser> = await this.userRepository.find({
      relations: { role: true, file: true },
      loadEagerRelations: false,
    });
    users.forEach((user) => {
      delete user.userPassword;
    });
    return users;
  }

  async findOne(userId: string): Promise<IUser> {
    return await this.userRepository.findOne({
      relations: { role: true },
      loadEagerRelations: false,
      select: { userPassword: false },
      where: { userId },
    });
  }

  async findWithCondition(userCondition: IUserFindCondition): Promise<IUser> {
    const user: IUser = await this.userRepository.findOne({
      relations: {
        role: true,
      },
      where: { ...userCondition },
    });

    if (!user) {
      throw new BadRequestException(
        `The user ${userCondition.username} was not found in the database`,
      );
    }

    if (user.userState === false) {
      throw new BadRequestException(`The user ${user.username} is disabled`);
    }

    return user;
  }

  async update(
    userId: string,
    { roleId, newPassword, ...userData }: IUpdateUser,
  ): Promise<IUser> {
    let update: IUpdateUser = {
      ...userData,
    };

    if (roleId)
      update = {
        ...update,
        role: {
          roleId,
        },
      };

    if (newPassword) {
      const encryptedPassword: string = await bcrypt.hash(newPassword, 10);

      update = {
        ...update,
        userPassword: encryptedPassword,
      };
    }

    const updateResult: UpdateResult = await this.userRepository.update(
      userId,
      update,
    );

    if (!updateResult)
      throw new BadRequestException(`The user ${userId} was not found`);

    const user = await this.userRepository.findOne({
      relations: { role: true },
      loadEagerRelations: false,
      select: { userPassword: false },
      where: { userId },
    });

    this.eventEmitter.emit('emit', {
      channel: 'user/data',
      data: { ...user },
    });

    return user;
  }

  async updateState(
    userId: string,
    { userState }: Pick<IUser, 'userState'>,
  ): Promise<IUser> {
    const updateResult: UpdateResult = await this.userRepository.update(
      userId,
      {
        userState,
      },
    );

    if (!updateResult)
      throw new BadRequestException(`user with id ${userId} not found`);

    const user = await this.userRepository.findOne({
      relations: { role: true },
      select: { userPassword: false },
      where: { userId },
    });

    this.eventEmitter.emit('emit', {
      channel: 'user/data',
      data: { ...user },
    });

    return user;
  }

  async restorePassword(
    userId: string,
    updatePasswordUser: IUserRestorePassword,
  ): Promise<boolean> {
    const encryptedPassword: string = await bcrypt.hash(
      updatePasswordUser.password,
      10,
    );

    const updateResult: UpdateResult = await this.userRepository.update(
      userId,
      {
        userPassword: encryptedPassword,
      },
    );

    if (!updateResult.affected) throw new EntityNotFoundError(User, userId);

    return true;
  }

  async remove(userId: string): Promise<string> {
    const deleteResult: DeleteResult = await this.userRepository.delete(userId);

    if (!deleteResult.affected)
      throw new BadRequestException(`User ${userId} was not deleted `);

    this.eventEmitter.emit('emit', {
      channel: 'user/data',
      data: { userId, isDelete: true },
    });

    return userId;
  }
}
