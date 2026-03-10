import {Module} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';


@Module({
    providers: [{
        provide: 'RESEND',
        useFactory: (config: ConfigService) => {
            const resend = new Resend(config.get<string>('resend.apiKey'));
            const sender = {
                email: config.get<string>('resend.senderEmail'),
                name: config.get<string>('resend.senderName'),
            };
            return {
                resend,
                sender,
            }
        },
        inject: [ConfigService]
    }],
    exports: ['RESEND']
})
export class ResendModule {}