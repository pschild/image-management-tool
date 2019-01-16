import { PathHelperService } from './pathHelper.service';
import 'jest-extended';
import { Test } from '@nestjs/testing';

describe('pathHelperServiceService', () => {
    let pathHelperService: PathHelperService;

    beforeAll(async () => {
        const module = await Test.createTestingModule({
            providers: [PathHelperService]
        }).compile();

        pathHelperService = module.get<PathHelperService>(PathHelperService);
    });

    describe('getAsName', () => {
        it('should return a paths name', () => {
            expect(pathHelperService.getAsName('A:')).toBe('A:');
            expect(pathHelperService.getAsName('B:.')).toBe('B:');
            expect(pathHelperService.getAsName('C:\\')).toBe('C:');
            expect(pathHelperService.getAsName('D:/')).toBe('D:');

            expect(pathHelperService.getAsName('x:')).toBe('x:');
            expect(pathHelperService.getAsName('E')).toBe('E');
            expect(pathHelperService.getAsName('F.')).toBe('F.');
            expect(pathHelperService.getAsName('G\\')).toBe('G\\');
            expect(pathHelperService.getAsName('H/')).toBe('H/');

            expect(pathHelperService.getAsName('C:\\foo\\bar')).toBe('C:\\foo\\bar');
        });
    });

    describe('getAsDirectory', () => {
        it('should return a paths name', () => {
            expect(pathHelperService.getAsDirectory('A:')).toBe('A:\\');
            expect(pathHelperService.getAsDirectory('B:.')).toBe('B:\\');
            expect(pathHelperService.getAsDirectory('C:\\')).toBe('C:\\');
            expect(pathHelperService.getAsDirectory('D:/')).toBe('D:\\');

            expect(pathHelperService.getAsDirectory('x:')).toBe('x:');
            expect(pathHelperService.getAsDirectory('E')).toBe('E');
            expect(pathHelperService.getAsDirectory('F.')).toBe('F.');
            expect(pathHelperService.getAsDirectory('G\\')).toBe('G\\');
            expect(pathHelperService.getAsDirectory('H/')).toBe('H/');

            expect(pathHelperService.getAsDirectory('C:\\foo\\bar')).toBe('C:\\foo\\bar');
        });
    });

    describe('getSystemDriveLetterWithColon', () => {
        it('should extract a drive letter', () => {
            expect(pathHelperService.getSystemDriveLetterWithColon('A:')).toBe('A:');
            expect(pathHelperService.getSystemDriveLetterWithColon('B:.')).toBe('B:');
            expect(pathHelperService.getSystemDriveLetterWithColon('C:\\')).toBe('C:');
            expect(pathHelperService.getSystemDriveLetterWithColon('D:/')).toBe('D:');
        });

        it('should throw an error when its no drive letter', () => {
            expect(() => pathHelperService.getSystemDriveLetterWithColon('x:')).toThrow(new Error(`Cannot extract drive letter from x:`));
            expect(() => pathHelperService.getSystemDriveLetterWithColon('E')).toThrow(new Error(`Cannot extract drive letter from E`));
            expect(() => pathHelperService.getSystemDriveLetterWithColon('F.')).toThrow(new Error(`Cannot extract drive letter from F.`));
            expect(() => pathHelperService.getSystemDriveLetterWithColon('G\\')).toThrow(new Error(`Cannot extract drive letter from G\\`));
            expect(() => pathHelperService.getSystemDriveLetterWithColon('H/')).toThrow(new Error(`Cannot extract drive letter from H/`));
        });
    });

    describe('isSystemDrive', () => {
        it('should detect a drive letter', () => {
            expect(pathHelperService.isSystemDrive('A:')).toBeTrue();
            expect(pathHelperService.isSystemDrive('B:.')).toBeTruthy();
            expect(pathHelperService.isSystemDrive('C:\\')).toBeTruthy();
            expect(pathHelperService.isSystemDrive('D:/')).toBeTruthy();
        });

        it('should detect non drive letters', () => {
            expect(pathHelperService.isSystemDrive('x:')).toBeFalse();
            expect(pathHelperService.isSystemDrive('E')).toBeFalsy();
            expect(pathHelperService.isSystemDrive('F.')).toBeFalsy();
            expect(pathHelperService.isSystemDrive('G\\')).toBeFalsy();
            expect(pathHelperService.isSystemDrive('H/')).toBeFalsy();
        });
    });
});
