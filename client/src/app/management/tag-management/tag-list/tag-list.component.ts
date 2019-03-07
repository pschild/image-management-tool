import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ITagDto } from '../../../../../../shared/dto/ITag.dto';
import { IColumnInterface } from '../../../shared/table-wrapper/IColumnDefinition';
import { ITableConfig } from '../../../shared/table-wrapper/ITableConfig';

@Component({
  selector: 'app-tag-list',
  templateUrl: './tag-list.component.html',
  styleUrls: ['./tag-list.component.scss']
})
export class TagListComponent implements OnInit {

  @Input() allTags: ITagDto[] = [];
  @Output() handleEdit: EventEmitter<ITagDto> = new EventEmitter<ITagDto>();
  @Output() handleRemove: EventEmitter<ITagDto> = new EventEmitter<ITagDto>();

  tableConfig: ITableConfig = {
    enablePaging: true,
    enableSorting: true
  };
  columns: IColumnInterface[] = [
    {
      columnDef: 'id',
      header: 'ID',
      cellContent: (element: ITagDto) => `${element.id}`
    },
    {
      columnDef: 'label',
      header: 'Label',
      cellContent: (element: ITagDto) => `${element.label}`
    },
    {
      columnDef: 'editAction',
      header: '',
      cellContent: () => '',
      cellAction: (element: ITagDto) => this.editTag(element),
      icon: 'edit'
    },
    {
      columnDef: 'deleteAction',
      header: '',
      cellContent: () => '',
      cellAction: (element: ITagDto) => this.removeTag(element),
      icon: 'delete'
    }
  ];

  constructor() { }

  ngOnInit() { }

  editTag(tag: ITagDto) {
    this.handleEdit.emit(tag);
  }

  removeTag(tag: ITagDto) {
    this.handleRemove.emit(tag);
  }
}
