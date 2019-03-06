import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ITagDto } from '../../../../../../shared/dto/ITag.dto';

@Component({
  selector: 'app-tag-list',
  templateUrl: './tag-list.component.html',
  styleUrls: ['./tag-list.component.scss']
})
export class TagListComponent implements OnInit {

  @Input() allTags: ITagDto[] = [];
  @Output() handleEdit: EventEmitter<ITagDto> = new EventEmitter<ITagDto>();

  constructor() { }

  ngOnInit() { }

  editTag(tag: ITagDto) {
    this.handleEdit.emit(tag);
  }
}
