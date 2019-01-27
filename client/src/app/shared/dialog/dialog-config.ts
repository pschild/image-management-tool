import { DialogIcons, DialogResult } from './dialog.enum';
import { IDialogButtonConfig } from './dialog-button-config';

export interface IDialogConfig {
    title: string;
    message: string;
    panelClass?: string;
    iconName?: DialogIcons;
    customData?: any;
    buttonConfig?: IDialogButtonConfig[];
}

export interface IDialogResult {
    result: DialogResult;
    customData?: any;
}
