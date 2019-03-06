import { Component, OnInit } from '@angular/core';
import { TagService } from './tag.service';
import { Observable, Subject } from 'rxjs';
import { ITagDto } from '../../../../../shared/dto/ITag.dto';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-tag-management',
  templateUrl: './tag-management.component.html',
  styleUrls: ['./tag-management.component.scss']
})
export class TagManagementComponent implements OnInit {

  allTags$: Observable<ITagDto[]>;
  tagToEdit$ = new Subject<ITagDto>();

  constructor(
    private tagService: TagService,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    this.refreshList();
  }

  refreshList() {
    this.allTags$ = this.tagService.loadAll();
  }

  handleEdit(tagToEdit: ITagDto) {
    this.tagToEdit$.next(tagToEdit);
  }

  handleSave(tag: ITagDto) {
    if (tag.id && !isNaN(+tag.id)) {
      console.log('update', tag);
    } else {
      this.tagService.create(tag.label).subscribe((createdTag: ITagDto) => {
        this.refreshList();
        this.toastr.success(`Tag "${createdTag.label}" erfolgreich angelegt`);
      });
    }
  }

}
