import { Controller, Get, Param, Post, Body } from '@nestjs/common';
import { WelcomeService } from './welcome.service';
import * as path from 'path';
import * as afs from 'async-file';
import { post, get } from 'request-promise';
import { ConfigService } from '../config/config.service';

@Controller('welcome')
export class WelcomeController {
    constructor(
        private readonly welcomeService: WelcomeService,
        private readonly configService: ConfigService
    ) { }

    @Get('greet/:name')
    greet(@Param('name') name: string): string {
        return this.welcomeService.generateGreeting(name);
    }

    @Get('dbtest')
    async test() {
        return this.welcomeService.findAllFolders();
    }

    @Post('cropImage')
    async cropImage(@Body() data: any): Promise<any> {
        const formData = {
            file: {
                value: afs.createReadStream(data.filePath),
                options: {
                    filename: path.basename(data.filePath)
                }
            },
            fuzzValue: data.fuzzValue
        };

        const cropResult = await post(this.configService.get('CROP_SERVICE_URL'), {
            formData: formData,
            json: true
        }).catch(error => {
            throw new Error(error.message);
        });

        cropResult.downloadPaths = [];
        for (const croppedImage of cropResult.croppedImages) {
            const downloadPath = await this.welcomeService.downloadImage(croppedImage.uri, data.filePath, croppedImage.name);
            cropResult.downloadPaths.push(downloadPath);
        }

        const removeUploadFolderResult = await get({
            uri: this.configService.get('CROP_SERVICE_URL'),
            qs: {
                action: 'removeUploadFolder',
                folderName: cropResult.uploadFolderName
            },
            json: true
        }).catch(error => {
            throw new Error(error.message);
        });

        if (!removeUploadFolderResult.success) {
            throw new Error('Upload folder could not be removed');
        }

        return cropResult;
    }
}
