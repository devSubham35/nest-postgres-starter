import { JwtService } from '@nestjs/jwt';
import { Injectable } from '@nestjs/common';
import { AuthenticatedUser } from '../common.types';
@Injectable()
export class TokenService {

  constructor(private readonly jwtService: JwtService) { }

  async generateToken(payload: AuthenticatedUser) {
    return await this.jwtService.signAsync(payload)
  }

  async verifyToken(accessToken: string) {
    return await this.jwtService.verifyAsync<AuthenticatedUser>(accessToken)
  }

}
