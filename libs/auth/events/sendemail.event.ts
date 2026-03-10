import { OnEvent } from '@nestjs/event-emitter';
import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { createWelcomeEmailTemplate } from '@app/emailTemplate';

@Injectable()
export class SendEmailListener {
  constructor(@Inject('RESEND') private resendService: any) {}
  @OnEvent('user.created', { async: true })
  async handleUserCreated(payload: {
    email: string;
    name: string;
    clientURL: any;
  }) {
    const { email, name, clientURL } = payload;
    const { data, error } = await this.resendService.resend.emails.send({
      from: `${this.resendService.sender.name} <${this.resendService.sender.email}>`,
      to: email,
      subject: 'Welcome to Chat-App!',
      html: createWelcomeEmailTemplate(name, clientURL),
    });

    if (error) {
      throw new InternalServerErrorException('Failed to send welcome email');
    }

     return { message: 'Welcome email sent successfully' };
  }
}
