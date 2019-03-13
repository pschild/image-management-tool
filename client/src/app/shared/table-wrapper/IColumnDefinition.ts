export interface IColumnInterface {
    columnDef: string;
    header: string;
    isHidden?: boolean;
    cellContent: (element: any) => string;
    cellAction?: (element: any) => any;
    icon?: string;
    isSearchable?: boolean;
}
