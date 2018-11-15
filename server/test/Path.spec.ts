import 'reflect-metadata';
import * as path from 'path';

describe('Path', function () {
    beforeAll(async () => {
        this.windowsPath = 'C:\\foo\\bar\\baz';
        this.posixPath = '/home/pi/bar/baz';
    });

    beforeEach(async () => {
    });

    afterAll(async () => {
    });

    it('can join path parts (Windows)', async () => {
        const pathParts = this.windowsPath.split(path.win32.sep);

        expect(path.win32.join('')).toBe('.');
        expect(path.win32.join(pathParts[0])).toBe('C:.'); // difference to posix
        expect(path.win32.join(pathParts[0], pathParts[1])).toBe(`C:${path.win32.sep}foo`);
        expect(path.win32.join(pathParts[0], pathParts[1], pathParts[2])).toBe(`C:${path.win32.sep}foo${path.win32.sep}bar`);
    });

    it('can get name of path part (Windows)', async () => {
        const pathParts = this.windowsPath.split(path.win32.sep);

        expect(pathParts[0]).toBe('C:'); // difference to posix
        expect(pathParts[1]).toBe('foo');
        expect(pathParts[2]).toBe('bar');
        expect(pathParts[3]).toBe('baz');
    });

    it('can join path parts (Posix)', async () => {
        const pathParts = this.posixPath.split(path.posix.sep);

        expect(path.posix.join('')).toBe('.');
        expect(path.posix.join(pathParts[0])).toBe('.'); // difference to win32
        expect(path.posix.join(pathParts[0], pathParts[1])).toBe(`home`);
        expect(path.posix.join(pathParts[0], pathParts[1], pathParts[2])).toBe(`home${path.posix.sep}pi`);
        expect(path.posix.join(pathParts[0], pathParts[1], pathParts[2], pathParts[3])).toBe(`home${path.posix.sep}pi${path.posix.sep}bar`);
    });

    it('can get name of path part (Linux)', async () => {
        const pathParts = this.posixPath.split(path.posix.sep);

        expect(pathParts[0]).toBe(''); // difference to win32
        expect(pathParts[1]).toBe('home');
        expect(pathParts[2]).toBe('pi');
        expect(pathParts[3]).toBe('bar');
        expect(pathParts[4]).toBe('baz');
    });
});
