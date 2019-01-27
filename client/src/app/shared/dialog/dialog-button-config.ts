import { MatDialogRef } from '@angular/material';
import { DialogComponent } from './dialog.component';
import { DialogButtonColor, DialogButtonStyle, DialogResult } from './dialog.enum';

export interface IDialogButtonConfig {
    label: string;
    onClickListener: (ref: MatDialogRef<DialogComponent>, customData: any) => void;
    color?: DialogButtonColor;
    style?: DialogButtonStyle;
}

export const DIALOG_YES_BUTTON: IDialogButtonConfig = {
    label: 'Ja',
    color: DialogButtonColor.PRIMARY,
    style: DialogButtonStyle.FLAT,
    onClickListener: (ref: MatDialogRef<DialogComponent>) => {
        ref.close({
            result: DialogResult.YES
        });
    }
};

export const DIALOG_NO_BUTTON: IDialogButtonConfig = {
    label: 'Nein',
    color: DialogButtonColor.NONE,
    style: DialogButtonStyle.STROKED,
    onClickListener: (ref: MatDialogRef<DialogComponent>) => {
        ref.close({
            result: DialogResult.NO
        });
    }
};

export const DIALOG_OK_BUTTON: IDialogButtonConfig = {
    label: 'OK',
    color: DialogButtonColor.PRIMARY,
    style: DialogButtonStyle.FLAT,
    onClickListener: (ref: MatDialogRef<DialogComponent>) => {
        ref.close({
            result: DialogResult.OK
        });
    }
};

export const DIALOG_ABORT_BUTTON: IDialogButtonConfig = {
    label: 'Abbrechen',
    color: DialogButtonColor.NONE,
    style: DialogButtonStyle.NONE,
    onClickListener: (ref: MatDialogRef<DialogComponent>) => {
        ref.close({
            result: DialogResult.ABORT
        });
    }
};

export const DIALOG_SAVE_BUTTON: IDialogButtonConfig = {
    label: 'Speichern',
    color: DialogButtonColor.PRIMARY,
    style: DialogButtonStyle.FLAT,
    onClickListener: (ref: MatDialogRef<DialogComponent>, customData: any) => {
        ref.close({
            customData,
            result: DialogResult.SAVE
        });
    }
};

export const YES_NO_DIALOG_BUTTON_CONFIG = [DIALOG_NO_BUTTON, DIALOG_YES_BUTTON];
export const ABORT_OK_BUTTON_CONFIG = [DIALOG_ABORT_BUTTON, DIALOG_OK_BUTTON];
export const OK_BUTTON_CONFIG = [DIALOG_OK_BUTTON];
export const ABORT_SAVE_BUTTON_CONFIG = [DIALOG_ABORT_BUTTON, DIALOG_SAVE_BUTTON];
export const RELOCATION_BUTTON_CONFIG = [
    DIALOG_ABORT_BUTTON,
    {
        label: 'Entfernen',
        color: DialogButtonColor.WARN,
        style: DialogButtonStyle.STROKED,
        onClickListener: (ref: MatDialogRef<DialogComponent>, customData: any) => {
            ref.close({
                customData,
                result: DialogResult.RELOCATION_REMOVE
            });
        }
    },
    {
        label: 'Suchen',
        color: DialogButtonColor.PRIMARY,
        style: DialogButtonStyle.FLAT,
        onClickListener: (ref: MatDialogRef<DialogComponent>, customData: any) => {
            ref.close({
                customData,
                result: DialogResult.RELOCATION_SEARCH
            });
        }
    }
];
