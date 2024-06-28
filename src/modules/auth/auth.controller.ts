import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SigninDto } from './dtos/signin';
import { SignupDto } from './dtos/signup';
import { IsPublic } from 'src/shared/decorators/IsPublic';
import { ForgetPasswordDto } from './dtos/forget-password';
import { ResetPasswordDto } from './dtos/reset-password';
import { ActiveUserId } from 'src/shared/decorators/ActiveUserId';
import { isResetPassword } from 'src/shared/decorators/IsResetPassword';

@IsPublic()
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signin')
  signin(@Body() signinDto: SigninDto) {
    return this.authService.signin(signinDto);
  }

  @Post('signup')
  signup(@Body() signupDto: SignupDto) {
    return this.authService.signup(signupDto);
  }

  @Post('forget-password')
  forgetPassword(@Body() forgetPassword: ForgetPasswordDto) {
    return this.authService.forgetPassword(forgetPassword)
  }

  @isResetPassword()
  @Post('reset-password')
  resetPassword(@ActiveUserId() userId: string, @Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.resetPassword(userId, resetPasswordDto)
  }
}