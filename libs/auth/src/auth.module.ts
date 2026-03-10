import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from '@/api/src/auth/auth.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '@app/schema/user.schema';
import { ResendModule } from '@app/resend';
import { CloudinaryModule } from '@app/providers/cloudinary.provider';
import { SendEmailListener } from '../events/sendemail.event'

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    ResendModule, CloudinaryModule
  ],
  controllers: [AuthController],
  providers: [AuthService, SendEmailListener],
  exports: [AuthService]
})
export class AuthModule {
  
}
