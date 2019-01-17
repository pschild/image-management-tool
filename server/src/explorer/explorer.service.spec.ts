import 'jest-extended';
import { ExplorerService } from './explorer.service';
import { FolderDto } from '../../../domain/FolderDto';
import { createTestModule } from '../../test/utils/test-utils';
import { FolderService } from '../folder/folder.service';
import { PathHelperService } from '../util/pathHelper.service';
import { Folder } from '../entity/Folder';
import { IFileDto } from '../../../domain/interface/IFileDto';
import { ImageDto } from '../../../domain/ImageDto';
import { Image } from '../entity/Image';

describe('ExplorerService', () => {
    let explorerService: ExplorerService;

    let fsFolders: IFileDto[];
    let dbFolders: Folder[];
    let fsImages: IFileDto[];
    let dbImages: Image[];

    beforeAll(async () => {
        const module = await createTestModule({
            providers: [FolderService, ExplorerService, PathHelperService]
        });
        explorerService = module.get<ExplorerService>(ExplorerService);
    });

    beforeEach(() => {
        fsFolders = [{
            name: 'F1',
            absolutePath: 'some/drive/F1',
            isFile: false,
            isDirectory: true
        }, {
            name: 'F2',
            absolutePath: 'some/drive/F2',
            isFile: false,
            isDirectory: true
        }];

        dbFolders = [{
            id: 1,
            name: 'F1',
            children: [],
            parent: null,
            images: [],
            dateAdded: new Date()
        }, {
            id: 2,
            name: 'F2',
            children: [],
            parent: null,
            images: [],
            dateAdded: new Date()
        }];

        fsImages = [{
            name: 'img1',
            absolutePath: 'some/drive/img1.jpg',
            extension: 'jpg',
            isFile: true,
            isDirectory: false
        }, {
            name: 'img2',
            absolutePath: 'some/drive/img2.PNG',
            extension: 'PNG',
            isFile: true,
            isDirectory: false
        }];

        dbImages = [{
            id: 1,
            name: 'img1',
            originalName: 'original Name 1',
            extension: 'jpg',
            dateAdded: new Date(),
            description: 'Some Description 1',
            dateFrom: new Date(),
            dateTo: new Date(),
            parentFolder: {
                id: 1,
                name: 'F1',
                children: [],
                parent: null,
                images: [],
                dateAdded: new Date()
            },
            persons: [],
            tags: [],
            place: null
        }, {
            id: 2,
            name: 'img2',
            originalName: 'original Name 2',
            extension: 'PNG',
            dateAdded: new Date(),
            description: 'Some Description 2',
            dateFrom: new Date(),
            dateTo: new Date(),
            parentFolder: {
                id: 1,
                name: 'F1',
                children: [],
                parent: null,
                images: [],
                dateAdded: new Date()
            },
            persons: [],
            tags: [],
            place: null
        }];
    });

    describe('getMergedFolderList', () => {
        it('should return an empty array when no folders given', async () => {
            const result: FolderDto[] = await explorerService.getMergedFolderList([], []);
            expect(result).toBeArrayOfSize(0);
        });

        it('should merge correctly when FS and DB are equal', async () => {
            const result: FolderDto[] = await explorerService.getMergedFolderList(fsFolders, dbFolders);
            expect(result).toBeArrayOfSize(2);

            expect(result.map(folderDto => folderDto.id)).toEqual([1, 2]);
            expect(result.map(folderDto => folderDto.name)).toEqual(['F1', 'F2']);
            expect(result.map(folderDto => folderDto.addedInFs)).toEqual([false, false]);
            expect(result.map(folderDto => folderDto.removedInFs)).toEqual([false, false]);
        });

        it('should merge correctly when FS contains added folders', async () => {
            fsFolders.push({
                name: 'F3',
                absolutePath: 'some/drive/F3',
                isFile: false,
                isDirectory: true
            }); // add 3rd element
            const result: FolderDto[] = await explorerService.getMergedFolderList(fsFolders, dbFolders);
            expect(result).toBeArrayOfSize(3);

            expect(result.map(folderDto => folderDto.id)).toEqual([1, 2, undefined]);
            expect(result.map(folderDto => folderDto.name)).toEqual(['F1', 'F2', 'F3']);
            expect(result.map(folderDto => folderDto.addedInFs)).toEqual([false, false, true]);
            expect(result.map(folderDto => folderDto.removedInFs)).toEqual([false, false, false]);
        });

        it('should merge correctly when FS contains removed folders', async () => {
            fsFolders.pop(); // remove last element
            const result: FolderDto[] = await explorerService.getMergedFolderList(fsFolders, dbFolders);
            expect(result).toBeArrayOfSize(2);

            expect(result.map(folderDto => folderDto.id)).toEqual([1, 2]);
            expect(result.map(folderDto => folderDto.name)).toEqual(['F1', 'F2']);
            expect(result.map(folderDto => folderDto.addedInFs)).toEqual([false, false]);
            expect(result.map(folderDto => folderDto.removedInFs)).toEqual([false, true]);
        });
    });

    describe('getMergedImageList', () => {
        it('should return an empty array when no images given', async () => {
            const result: ImageDto[] = await explorerService.getMergedImageList([], []);
            expect(result).toBeArrayOfSize(0);
        });

        it('should merge correctly when FS and DB are equal', async () => {
            const result: ImageDto[] = await explorerService.getMergedImageList(fsImages, dbImages);
            expect(result).toBeArrayOfSize(2);

            expect(result.map(imageDto => imageDto.id)).toEqual([1, 2]);
            expect(result.map(imageDto => imageDto.name)).toEqual(['img1', 'img2']);
            expect(result.map(imageDto => imageDto.extension)).toEqual(['jpg', 'PNG']);
            expect(result.map(imageDto => imageDto.addedInFs)).toEqual([false, false]);
            expect(result.map(imageDto => imageDto.removedInFs)).toEqual([false, false]);
        });

        it('should merge correctly when FS contains added images', async () => {
            fsImages.push({
                name: 'img3',
                absolutePath: 'some/drive/img3.jpg',
                extension: 'gif',
                isFile: true,
                isDirectory: false
            }); // add 3rd element
            const result: ImageDto[] = await explorerService.getMergedImageList(fsImages, dbImages);
            expect(result).toBeArrayOfSize(3);

            expect(result.map(imageDto => imageDto.id)).toEqual([1, 2, undefined]);
            expect(result.map(imageDto => imageDto.name)).toEqual(['img1', 'img2', 'img3']);
            expect(result.map(imageDto => imageDto.extension)).toEqual(['jpg', 'PNG', 'gif']);
            expect(result.map(imageDto => imageDto.addedInFs)).toEqual([false, false, true]);
            expect(result.map(imageDto => imageDto.removedInFs)).toEqual([false, false, false]);
        });

        it('should merge correctly when FS contains removed images', async () => {
            fsImages.pop(); // remove last element
            const result: ImageDto[] = await explorerService.getMergedImageList(fsImages, dbImages);
            expect(result).toBeArrayOfSize(2);

            expect(result.map(imageDto => imageDto.id)).toEqual([1, 2]);
            expect(result.map(imageDto => imageDto.name)).toEqual(['img1', 'img2']);
            expect(result.map(imageDto => imageDto.extension)).toEqual(['jpg', 'PNG']);
            expect(result.map(imageDto => imageDto.addedInFs)).toEqual([false, false]);
            expect(result.map(imageDto => imageDto.removedInFs)).toEqual([false, true]);
        });
    });
});
