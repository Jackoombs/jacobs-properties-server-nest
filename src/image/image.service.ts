import { Injectable, Inject } from '@nestjs/common';
import sharp from 'sharp';
import ImageKit from 'imagekit';
import axios from 'axios';
import { PropertyImageModel } from '@reapit/foundations-ts-definitions';
import { FileService } from '../file/file.service';

@Injectable()
export class ImageService {
  constructor(
    @Inject('IMAGE_KIT') private readonly imageKit: ImageKit,
    private readonly fileService: FileService,
  ) {}
  async processAllImages(images: PropertyImageModel[]) {
    for (const [index, image] of images.entries()) {
      const fileName = this.fileService.removeExtension(image.id);
      if (index === 0) {
        await this.processImage(
          image.url,
          fileName + '-sm.webp',
          image.propertyId,
          450,
          300,
        );
      }
      await this.processImage(
        image.url,
        fileName + '-lg.webp',
        image.propertyId,
        825,
        550,
      );
    }
  }

  async processImage(
    url: string,
    fileName: string,
    dirName: string,
    width: number,
    height: number,
  ) {
    try {
      const res = await axios.get(url, { responseType: 'arraybuffer' });
      const imageData = Buffer.from(res.data, 'binary');
      const resizedData = await this.resizeImage(imageData, width, height);
      await this.uploadImage(resizedData, fileName, dirName);
    } catch (error) {
      console.log(error);
    }
  }

  async resizeImage(image: Buffer, width: number, height: number) {
    return await sharp(image)
      .resize(width, height)
      .webp({ quality: 80 })
      .toBuffer();
  }

  async uploadImage(image: Buffer, fileName: string, dirName: string) {
    console.log(ImageKit);
    const imagekit = new ImageKit({
      publicKey: 'public_4LM2PTPwrb1Le2NlI1aDbdce/A4=',
      privateKey: process.env.IMAGEKIT_KEY,
      urlEndpoint: 'https://ik.imagekit.io/k6joqq39e',
    });

    await imagekit.upload({
      file: image,
      fileName: fileName,
      folder: dirName,
      useUniqueFileName: false,
      overwriteFile: false,
    });
    console.log('file uploaded');
  }
}
