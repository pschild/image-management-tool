import { IMergedFolderDto } from './IMergedFolder.dto';
import { IMergedImageDto } from './IMergedImage.dto';

export interface IExplorerContentDto {
    folders: IMergedFolderDto[];
    images: IMergedImageDto[];
}
