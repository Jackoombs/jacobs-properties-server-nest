import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ReapitService } from './reapit/reapit.service';
import { ReapitController } from './reapit/reapit.controller';
import { FileService } from './file/file.service';
import { DataService } from './data/data.service';
import { ImageService } from './image/image.service';
import { EmailService } from './email/email.service';
import { PropertyService } from './property/property.service';

@Module({
  imports: [],
  controllers: [AppController, ReapitController],
  providers: [
    AppService,
    ReapitService,
    FileService,
    DataService,
    ImageService,
    EmailService,
    PropertyService,
  ],
})
export class AppModule {}
