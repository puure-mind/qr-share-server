import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { SignalingModule } from './signaling/signaling.module';

@Module({
  imports: [ConfigModule.forRoot(), SignalingModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
