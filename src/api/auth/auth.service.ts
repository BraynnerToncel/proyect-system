import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { IUser } from '@interface/api/user/user.interface';
import {
  IAuth,
  IAuthenticatedUser,
  IJwtToken,
} from '@interface/api/auth/auth.interface';
import { BadRequestException } from '@nestjs/common/exceptions';
import * as bcrypt from 'bcryptjs';
import { UserService } from '@api/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtTokenService: JwtService,
  ) {}

  private signToken(tokenPayload: IJwtToken, remember = false): string {
    return this.jwtTokenService.sign(tokenPayload, {
      expiresIn: remember ? '6d' : '2h',
    });
  }

  async login({
    password,
    username,
    remember,
  }: IAuth): Promise<IAuthenticatedUser> {
    const userDb: IUser = await this.userService.findWithCondition({
      username: username.toLowerCase(),
    });

    // admin -> $2a$10$BbW6jeQa5DRe5u.uN8KMIeY2C82quaNRgD6on6YETvU0oz0mctNBO

    if (!userDb || !bcrypt.compareSync(password, userDb.userPassword))
      throw new BadRequestException('Invalid credentials');

    const tokenData: IJwtToken = {
      ...userDb,
      permissions: userDb.role.permissions.map((permission) => {
        return permission.permissionName;
      }),
    };

    delete tokenData.role.permissions;

    const token: string = this.signToken(tokenData, remember);
    return {
      token,
    };
  }
}
