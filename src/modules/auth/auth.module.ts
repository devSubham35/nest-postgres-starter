import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module';
import { config } from 'src/common/utils/config';
import { AuthController } from './auth.controller';
import { TokenService } from 'src/common/services/token.service';

@Module({
  imports: [
    UserModule,
    JwtModule.register({
      secret: config.JWT_SECRET,
      signOptions: { expiresIn: "1d" },
    })
  ],
  exports: [TokenService],
  providers: [AuthService, TokenService],
  controllers: [AuthController],
})
export class AuthModule { }
