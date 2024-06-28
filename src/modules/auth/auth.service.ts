import {
    ConflictException, Injectable, ServiceUnavailableException, UnauthorizedException 
} from '@nestjs/common';
import { compare, hash } from 'bcryptjs';
import { SigninDto } from './dtos/signin';
import { UsersRepository } from 'src/shared/database/repositories/users.repositories';
import { JwtService } from '@nestjs/jwt';
import { SignupDto } from './dtos/signup';
import { MailService } from '../mail/mail.service';
import { ForgetPasswordDto } from './dtos/forget-password';
import { env } from 'src/shared/config/env';
import { ResetPasswordDto } from './dtos/reset-password';
  
  @Injectable()
  export class AuthService {
    constructor(
      private readonly usersRepo: UsersRepository,
      private readonly jwtService: JwtService,
      private readonly mailService: MailService,
    ) {}
  
    async signin(signinDto: SigninDto) {
      const { email, password } = signinDto;

      const user = await this.usersRepo.findUnique({
        where: { email },
      });

      if (!user) {
        throw new UnauthorizedException('Invalid credentials');
      }

      const isPasswordValid = await compare(password, user.password);

      if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid credentials.');
      }

      const accessToken = await this.generateAccessToken(user.id);

      return { accessToken };
    }

    async signup(signupDto: SignupDto) {
      const { name, phone, email, password } = signupDto;

      const emailTaken = await this.usersRepo.findUnique({
        where: { email },
        select: { id: true },
      });

      if (emailTaken) {
        throw new ConflictException('This email is already in use.');
      }
  
      const hashedPassword = await hash(password, 12);
  
      const user = await this.usersRepo.create({
        data: {
          name,
          phone,
          email,
          password: hashedPassword,
        },
      });

      const accessToken = await this.generateAccessToken(user.id);

      return { accessToken };
    }

    async forgetPassword(forgetPasswordDto: ForgetPasswordDto) {
      const { email } = forgetPasswordDto
  
      const user = await this.usersRepo.findUnique({
        where: { email },
      })
  
      if (!user) {
        throw new UnauthorizedException('Invalid email.')
      }
  
      const resetToken = await this.generateResetPasswordToken(user.id)
  
      try {
        await this.mailService.send({
          to: email,
          subject: 'Recuperação de senha - Arena Beach One',
          msg: resetToken,
          isRecoverPass: true
        },)
      } catch(error) {
        throw new ServiceUnavailableException('Error during email send.')
      }
    }

    async resetPassword(userId: string, resetPasswordDto: ResetPasswordDto) {
      const { newPassword } = resetPasswordDto
  
      const hashedNewPassword = await hash(newPassword, 12)
  
      await this.usersRepo.update({
        where: { id: userId },
        data: { password: hashedNewPassword }
      })
    }

    private generateAccessToken(userId: string) {
      return this.jwtService.signAsync({ sub: userId });
    }

    private generateResetPasswordToken(userId: string) {
      return this.jwtService.signAsync(
        { sub: userId },
        { secret: env.resetPasswordJwtSecret, expiresIn: 300 })
    }
  }