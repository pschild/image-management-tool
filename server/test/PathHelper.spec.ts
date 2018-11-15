import 'reflect-metadata';
import { PathHelper } from '../src/util/PathHelper';

describe('PathHelper', function () {
    beforeAll(async () => {
    });

    beforeEach(async () => {
    });

    afterAll(async () => {
    });

    it('can detect a drive letter', async () => {
        expect(PathHelper.isSystemDrive('A:')).toBeTruthy();
        expect(PathHelper.isSystemDrive('B:.')).toBeTruthy();
        expect(PathHelper.isSystemDrive('C:\\')).toBeTruthy();
        expect(PathHelper.isSystemDrive('D:/')).toBeTruthy();

        expect(PathHelper.isSystemDrive('x:')).toBeFalsy();
        expect(PathHelper.isSystemDrive('E')).toBeFalsy();
        expect(PathHelper.isSystemDrive('F.')).toBeFalsy();
        expect(PathHelper.isSystemDrive('G\\')).toBeFalsy();
        expect(PathHelper.isSystemDrive('H/')).toBeFalsy();
    });

    it('can extract a drive letter', async () => {
        expect(PathHelper.getSystemDriveLetterWithColon('A:')).toBe('A:');
        expect(PathHelper.getSystemDriveLetterWithColon('B:.')).toBe('B:');
        expect(PathHelper.getSystemDriveLetterWithColon('C:\\')).toBe('C:');
        expect(PathHelper.getSystemDriveLetterWithColon('D:/')).toBe('D:');

        expect(() => PathHelper.getSystemDriveLetterWithColon('x:')).toThrow(new Error(`Cannot extract drive letter from x:`));
        expect(() => PathHelper.getSystemDriveLetterWithColon('E')).toThrow(new Error(`Cannot extract drive letter from E`));
        expect(() => PathHelper.getSystemDriveLetterWithColon('F.')).toThrow(new Error(`Cannot extract drive letter from F.`));
        expect(() => PathHelper.getSystemDriveLetterWithColon('G\\')).toThrow(new Error(`Cannot extract drive letter from G\\`));
        expect(() => PathHelper.getSystemDriveLetterWithColon('H/')).toThrow(new Error(`Cannot extract drive letter from H/`));
    });

    it('can extract a drive letter', async () => {
        expect(PathHelper.getSystemDriveLetterWithColon('A:')).toBe('A:');
        expect(PathHelper.getSystemDriveLetterWithColon('B:.')).toBe('B:');
        expect(PathHelper.getSystemDriveLetterWithColon('C:\\')).toBe('C:');
        expect(PathHelper.getSystemDriveLetterWithColon('D:/')).toBe('D:');

        expect(() => PathHelper.getSystemDriveLetterWithColon('x:')).toThrow(new Error(`Cannot extract drive letter from x:`));
        expect(() => PathHelper.getSystemDriveLetterWithColon('E')).toThrow(new Error(`Cannot extract drive letter from E`));
        expect(() => PathHelper.getSystemDriveLetterWithColon('F.')).toThrow(new Error(`Cannot extract drive letter from F.`));
        expect(() => PathHelper.getSystemDriveLetterWithColon('G\\')).toThrow(new Error(`Cannot extract drive letter from G\\`));
        expect(() => PathHelper.getSystemDriveLetterWithColon('H/')).toThrow(new Error(`Cannot extract drive letter from H/`));
    });

    it('can return a paths name', async () => {
        expect(PathHelper.getAsName('A:')).toBe('A:');
        expect(PathHelper.getAsName('B:.')).toBe('B:');
        expect(PathHelper.getAsName('C:\\')).toBe('C:');
        expect(PathHelper.getAsName('D:/')).toBe('D:');

        expect(PathHelper.getAsName('x:')).toBe('x:');
        expect(PathHelper.getAsName('E')).toBe('E');
        expect(PathHelper.getAsName('F.')).toBe('F.');
        expect(PathHelper.getAsName('G\\')).toBe('G\\');
        expect(PathHelper.getAsName('H/')).toBe('H/');

        expect(PathHelper.getAsName('C:\\foo\\bar')).toBe('C:\\foo\\bar');
    });

    it('can return a paths name', async () => {
        expect(PathHelper.getAsDirectory('A:')).toBe('A:\\');
        expect(PathHelper.getAsDirectory('B:.')).toBe('B:\\');
        expect(PathHelper.getAsDirectory('C:\\')).toBe('C:\\');
        expect(PathHelper.getAsDirectory('D:/')).toBe('D:\\');

        expect(PathHelper.getAsDirectory('x:')).toBe('x:');
        expect(PathHelper.getAsDirectory('E')).toBe('E');
        expect(PathHelper.getAsDirectory('F.')).toBe('F.');
        expect(PathHelper.getAsDirectory('G\\')).toBe('G\\');
        expect(PathHelper.getAsDirectory('H/')).toBe('H/');

        expect(PathHelper.getAsDirectory('C:\\foo\\bar')).toBe('C:\\foo\\bar');
    });
});
