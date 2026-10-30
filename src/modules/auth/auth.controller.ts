import { AuthService } from './auth.service';
import { SignInDto, SignUpDto } from './dto/auth.dto';
import { Body, Controller, Get, Post } from '@nestjs/common';
import { Public } from 'src/common/decorator/public.decorator';
import { UserId } from 'src/common/decorator/common.decorator';

@Controller('auth')
export class AuthController {

  constructor(private readonly authService: AuthService) { }

  @Public()
  @Post("sign-up")
  register(@Body() body: SignUpDto) {
    const result = this.authService.signup(body)
    return result
  }
  
  @Public()
  @Post("sign-in")
  async signin(@Body() body: SignInDto) {
    return await this.authService.signin(body);
  }
  
  
  @Get("profile")
  async profile(@UserId() userId: string) {
    return await this.authService.profile(userId);
  }
}
