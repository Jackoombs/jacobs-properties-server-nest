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
import { FormService } from './form/form.service';
import { FormController } from './form/form.controller';
import { UrlService } from './url/url.service';
import { ConfigModule } from '@nestjs/config';
import { AppBootstrapService } from './app-bootstrap/app-bootstrap.service';
import { PropertyController } from './property/property.controller';
import ImageKit from 'imagekit';

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [
    AppController,
    ReapitController,
    FormController,
    PropertyController,
  ],
  providers: [
    AppService,
    ReapitService,
    FileService,
    DataService,
    ImageService,
    EmailService,
    PropertyService,
    FormService,
    UrlService,
    AppBootstrapService,
    {
      provide: 'IMAGE_KIT',
      useFactory: () =>
        new ImageKit({
          publicKey: 'public_4LM2PTPwrb1Le2NlI1aDbdce/A4=',
          privateKey: process.env.IMAGEKIT_KEY,
          urlEndpoint: 'https://ik.imagekit.io/k6joqq39e',
        }),
    },
  ],
})
export class AppModule {}
