import { Request } from 'express';
import { Reflector } from '@nestjs/core';
import { UserService } from '../user/user.service';
import { TokenService } from './../../common/services/token.service';
import { IS_PUBLIC_KEY } from 'src/common/decorator/public.decorator';
import { CanActivate, ExecutionContext, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class AuthGuard implements CanActivate {
  
  constructor(
    private readonly reflector: Reflector,
    private readonly tokenService: TokenService,
    private readonly userService: UserService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {

     if (this.reflector.getAllAndOverride<boolean>(
      IS_PUBLIC_KEY, 
      [
        context.getClass(),
        context.getHandler(),
      ])
    ) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException();
    }

    try {
      const payload = await this.tokenService.verifyToken(token);
      const user = await this.userService.findById(payload.sub)

      if(!user){
        throw new NotFoundException("Invalid token or user not found")
      }

      request['user'] = {
        sub: user.id,
        email: user.email
      };

    } catch {
      throw new UnauthorizedException();
    }
    
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
