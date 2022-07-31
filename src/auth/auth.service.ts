import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { v4 } from 'uuid';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { AuthDto } from './dto';
import { Env, InfoForUser } from 'src/utils/constants';
import { Tokens, JwtPayload } from './types';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private config: ConfigService,
  ) {}

  async singup(dto: AuthDto): Promise<Tokens> {
    const hash = await this.hashData(dto.password);

    const newUser = await this.prisma.auth
      .create({
        data: {
          id: v4(),
          login: dto.login,
          hash,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        },
      })
      .catch((error) => {
        if (error instanceof PrismaClientKnownRequestError) {
          throw new ForbiddenException(InfoForUser.CREDENTIALS_INCORRECT);
        }
        throw error;
      });

    const tokens = await this.getTokens(newUser.id, newUser.login);
    await this.updateRtHash(newUser.id, tokens.refreshToken);
    return tokens;
  }

  async login(dto: AuthDto): Promise<Tokens> {
    const user = await this.findOneByLogin(dto.login);

    if (!user) throw new ForbiddenException(InfoForUser.ACCESS_DENIED);

    const passwordMatches = await bcrypt.compare(dto.password, user.hash);
    if (!passwordMatches)
      throw new ForbiddenException(InfoForUser.ACCESS_DENIED);

    const tokens = await this.getTokens(user.id, user.login);
    await this.updateRtHash(user.id, tokens.refreshToken);
    return tokens;
  }

  async refreshTokens(userId: string, rt: string) {
    const user = await this.findOneById(userId);

    if (!user || !user.hashedRt)
      throw new ForbiddenException(InfoForUser.ACCESS_DENIED);

    const rtMatches = await bcrypt.compare(rt, user.hashedRt);
    if (!rtMatches) throw new ForbiddenException(InfoForUser.ACCESS_DENIED);

    const tokens = await this.getTokens(user.id, user.login);
    await this.updateRtHash(user.id, tokens.refreshToken);
    return tokens;
  }

  async getRefreshTokens(rt: string) {
    if (!rt) throw new UnauthorizedException(InfoForUser.JWT_REFRESH);
    const userId = await this.getCurrentUserId(rt);
    return this.refreshTokens(userId, rt);
  }

  private async hashData(data: string) {
    return await bcrypt.hash(data, +process.env.CRYPT_SALT);
  }

  async getTokens(userId: string, login: string): Promise<Tokens> {
    const jwtPayload: JwtPayload = { sub: userId, login };

    const [access_token, refresh_token] = await Promise.all([
      this.jwtService.signAsync(jwtPayload, {
        secret: this.config.get<string>(Env.JWT_SECRET_KEY),
        expiresIn: this.config.get<string>(Env.TOKEN_EXPIRE_TIME),
      }),
      this.jwtService.signAsync(jwtPayload, {
        secret: this.config.get<string>(Env.JWT_SECRET_REFRESH_KEY),
        expiresIn: this.config.get<string>(Env.TOKEN_REFRESH_EXPIRE_TIME),
      }),
    ]);

    return { accessToken: access_token, refreshToken: refresh_token };
  }

  async updateRtHash(userId: string, rt: string) {
    const hash = await this.hashData(rt);

    await this.prisma.auth.update({
      where: { id: userId },
      data: { hashedRt: hash },
    });
  }

  async findOneById(userId: string) {
    return await this.prisma.auth.findUnique({ where: { id: userId } });
  }

  async findOneByLogin(login: string) {
    return await this.prisma.auth.findUnique({ where: { login } });
  }

  async getCurrentUserId(context: string) {
    const reqeust = await this.jwtService.verifyAsync(context, {
      secret: this.config.get<string>(Env.JWT_SECRET_REFRESH_KEY),
    });

    return reqeust['sub'];
  }
}
