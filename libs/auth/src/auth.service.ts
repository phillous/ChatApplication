import { BadRequestException, Body, Inject, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '@app/schema/user.schema';
import { Model } from 'mongoose';
import { CreateUserDto } from '@app/auth/dto/requestDto/create.dto';
import * as bcrypt from 'bcrypt';
import { LoginDto } from '@app/auth/dto/requestDto/login.dto';
import { JwtService } from '@nestjs/jwt';
import type { Request } from 'express';
import { createWelcomeEmailTemplate } from '@app/emailTemplate';
import { ConfigService } from '@nestjs/config';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private User: Model<UserDocument>,
    private jwtService: JwtService,
    @Inject('CLOUDINARY') private cloudinary: any,
    @Inject('RESEND') private resendService: any,
    @Inject(ConfigService) private config: ConfigService,
    private eventEmitter : EventEmitter2
  ) {}
  saltRounds = 10;

  // const isMatch = await bcrypt.compare(password, user.password);

  async login(body : LoginDto) {
    const { email, password } = body;
    if (!email || !password) {
      throw new BadRequestException('Email and password are required');
    }
    const user = await this.User.findOne({ email });
    if (!user) {
      throw new BadRequestException('Invalid email or password');
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new BadRequestException('Invalid email or password');
    }
    const payload = {
      _id: user._id,
    };

    const token = this.jwtService.sign(payload);
    return {
      message: 'User logged in successfully',
      _id: user._id,
      fullName: user.fullName,
      profilePic: user.profilePic,
      token,
    };
  }

  async signup(body: CreateUserDto) {
    const { fullName, email, password } = body;

    // Basic validation
    if (!fullName || !email || !password) {
      throw new BadRequestException('All fields are required');
    }

    const existingUser = await this.User.findOne({ email });
    if (existingUser) {
      throw new BadRequestException('Email already exists');
    }
    const hashedPassword = await bcrypt.hash(password, this.saltRounds);
    const user = new this.User({ fullName, email, password: hashedPassword });
    await user.save();
    this.eventEmitter.emit('user.created', { email, fullName });
    // await this.sendWelcomeEmail(email, fullName, this.config.get('clientUrl'));
    const payload = {
      _id: user._id,
    };
    const token = this.jwtService.sign(payload);
    return { message: 'Signup successful', _id: user._id,
      fullName: user.fullName,
      profilePic: user.profilePic,
      token
 };
    
  }

  async logout() {
    return { message: 'Logout successful' };
  }
  
  async updateProfile(body: any, req: Request) {
    const {profilePic} = body;
    if(!profilePic) {
      throw new BadRequestException('Profile picture is required');
    }
    const userId = req?.user?._id;
    if(!userId) {
      throw new BadRequestException('User not found');
    }

    const uploadResponse = await this.cloudinary.uploader.upload(profilePic)
    const updatedUser = await this.User.findByIdAndUpdate(
      userId,
      { profilePic: uploadResponse.secure_url },
      { new: true }
    );

    if(!updatedUser){
        throw new BadRequestException('Failed to update profile picture');
    }

    return { message: 'Profile updated successfully' };
  }

  async sendWelcomeEmail(
    email: string,
    name: string,
    clientURL: any,
  ) {
    const { data, error } = await this.resendService.resend.emails.send({
      from: `${this.resendService.sender.name} <${this.resendService.sender.email}>`,
      to: email,
      subject: 'Welcome to Chat-App!',
      html: createWelcomeEmailTemplate(name, clientURL),
    });

    if (error) {
      throw new InternalServerErrorException('Failed to send welcome email');
    }

    if(!error)
      return {message: 'Welcome email sent successfully'};
  }
}


