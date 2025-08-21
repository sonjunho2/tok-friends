import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Public } from './public.decorator';
import { AuthService } from './auth.service';
import { EmailSignupDto, EmailLoginDto, AppleTokenDto } from './dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Public()
  @Post('signup/email')
  signupEmail(@Body() dto: EmailSignupDto) {
    return this.auth.signupEmail(dto);
  }

  @Public()
  @Post('login/email')
  loginEmail(@Body() dto: EmailLoginDto) {
    return this.auth.loginEmail(dto);
  }

  @Public()
  @Post('apple')
  loginApple(@Body() dto: AppleTokenDto) {
    return this.auth.loginApple(dto);
  }
}
