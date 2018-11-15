import * as path from 'path';

export class PathHelper {

    // matches: A:, B:., C:\, D:/
    static DRIVE_LETTER_REGEX = new RegExp(/^([A-Z]{1}:)[\.\\/]?$/);

    static getAsName(givenPath: string): string {
        if (this.isSystemDrive(givenPath)) {
            return this.getSystemDriveLetterWithColon(givenPath);
        }
        return givenPath;
    }

    static getAsDirectory(givenPath: string): string {
        if (this.isSystemDrive(givenPath)) {
            return this.getSystemDriveLetterWithColon(givenPath) + path.sep;
        }
        return givenPath;
    }

    static getSystemDriveLetterWithColon(input: string): string {
        const match = input.match(this.DRIVE_LETTER_REGEX);
        if (match) {
            return match[1];
        }
        throw new Error(`Cannot extract drive letter from ${input}`);
    }

    static isSystemDrive(givenPath: string): boolean {
        return givenPath.match(this.DRIVE_LETTER_REGEX) !== null;
    }
}
