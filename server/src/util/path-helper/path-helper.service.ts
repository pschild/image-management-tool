import { Injectable } from '@nestjs/common';
import * as path from 'path';

@Injectable()
export class PathHelperService {

    DRIVE_LETTER_REGEX = new RegExp(/^([A-Z]{1}:)[\.\\/]?$/);

    getAsName(givenPath: string): string {
        if (this.isSystemDrive(givenPath)) {
            return this.getSystemDriveLetterWithColon(givenPath);
        }
        return givenPath;
    }

    getAsDirectory(givenPath: string): string {
        if (this.isSystemDrive(givenPath)) {
            return this.getSystemDriveLetterWithColon(givenPath) + path.sep;
        }
        return givenPath;
    }

    getSystemDriveLetterWithColon(input: string): string {
        const match = input.match(this.DRIVE_LETTER_REGEX);
        if (match) {
            return match[1];
        }
        throw new Error(`Cannot extract drive letter from ${input}`);
    }

    isSystemDrive(givenPath: string): boolean {
        return givenPath.match(this.DRIVE_LETTER_REGEX) !== null;
    }
}
