import { Module } from '@nestjs/common';
import { GatewayProvider } from '@/websocket/src/websocket.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '@app/schema/user.schema';


@Module({
    imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema }
    ])
  ],
 providers: [GatewayProvider],
 exports: [GatewayProvider]
})


export class GateWayModule{}