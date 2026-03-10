import { Inject, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';


@Module({
    providers: [{
        provide: 'CLOUDINARY',
        useFactory: async (config: ConfigService) => {
            return cloudinary.config({
                cloud_name: config.get<string>('cloudinary.name'),
                api_key: config.get<string>('cloudinary.apiKey'),
                api_secret: config.get<string>('cloudinary.apiSecret'),
            });
        },
        inject: [ConfigService]
    }],
    exports: ['CLOUDINARY']
})

export class CloudinaryModule {}
