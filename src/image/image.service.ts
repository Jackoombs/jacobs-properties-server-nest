import { Injectable } from '@nestjs/common';
import sharp from 'sharp';
import ImageKit from 'imagekit';
import axios from 'axios';
import { PropertyImageModel } from '@reapit/foundations-ts-definitions';

@Injectable()
export class ImageService {
  async processAllImages(images: PropertyImageModel[]) {
    for (const [index, image] of images.entries()) {
      if (index === 0) {
        this.processImage(
          image.url,
          image.id + '-sm.webp',
          image.propertyId,
          450,
          300,
        );
      }
      this.processImage(
        image.url,
        image.id + '-lg.webp',
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
    const res = await axios.get(url, { responseType: 'stream' });
    const imageData = await res.data;
    const resizedData = await this.resizeImage(imageData, width, height);
    this.uploadImage(resizedData, fileName, dirName);
  }

  async resizeImage(image: Buffer, width: number, height: number) {
    return await sharp(image)
      .resize(width, height)
      .webp({ quality: 80 })
      .toBuffer();
  }

  async uploadImage(image: Buffer, fileName: string, dirName: string) {
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
  }
}
