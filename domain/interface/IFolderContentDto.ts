import { ImageDto } from '../ImageDto';
import { FolderDto } from '../FolderDto';

export interface IFolderContentDto {
    folders: FolderDto[];
    images: ImageDto[];
}
