// services/api/src/modules/auth/auth.controller.ts
import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Public } from './public.decorator';
import { AuthService } from './auth.service';
import {
  EmailSignupDto,
  EmailLoginDto,
  AppleTokenDto,
  PhoneRequestOtpDto,
  PhoneVerifyDto,
  CompletePhoneProfileDto,
} from './dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Public()
  @Post(['signup/email', 'signup', 'register', 'users/signup', 'users/register'])
  signupEmailAliases(@Body() dto: EmailSignupDto) {
    return this.auth.signupEmail(dto);
  }

  @Public()
  @Post(['login/email', 'login'])
  loginEmailAliases(@Body() dto: EmailLoginDto) {
    return this.auth.loginEmail(dto);
  }

  @Public()
  @Post('apple')
  loginApple(@Body() dto: AppleTokenDto) {
    return this.auth.loginApple(dto);
  }

  @Public()
  @Post('phone/request-otp')
  requestPhoneOtp(@Body() dto: PhoneRequestOtpDto) {
    return this.auth.requestPhoneOtp(dto);
  }

  @Public()
  @Post('phone/verify')
  verifyPhoneOtp(@Body() dto: PhoneVerifyDto) {
    return this.auth.verifyPhoneOtp(dto);
  }

  @Public()
  @Post('phone/complete-profile')
  completePhoneProfile(@Body() dto: CompletePhoneProfileDto) {
    return this.auth.completePhoneProfile(dto);
  }
}
