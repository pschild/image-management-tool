import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { TagService } from '../tag.service';
import { COMMA, TAB } from '@angular/cdk/keycodes';
import { MatChipInputEvent, MatAutocompleteSelectedEvent } from '@angular/material';
import { Observable } from 'rxjs';
import { FormControl, FormArray } from '@angular/forms';
import { startWith, map, combineLatest } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { ITagDto } from '../../../../../../shared/dto/ITag.dto';

@Component({
  selector: 'app-tag-chips',
  templateUrl: './tag-chips.component.html',
  styleUrls: ['./tag-chips.component.scss']
})
export class TagChipsComponent implements OnInit {

  @Input() tagFormArray: FormArray;
  @Input() preSelectedTags: ITagDto[] = [];

  @ViewChild('tagInput') tagInput: ElementRef;

  separatorKeysCodes = [TAB, COMMA];
  tagInputControl = new FormControl();

  allTags$: Observable<ITagDto[]>;
  filteredTags$: Observable<ITagDto[]>;

  constructor(
    private tagService: TagService,
    private toastr: ToastrService
  ) {
    this.refreshSuggestions();
  }

  refreshSuggestions() {
    this.allTags$ = this.tagService.loadAll();
    this.filteredTags$ = this.allTags$.pipe(
      combineLatest(this.tagInputControl.valueChanges.pipe(startWith(''))),
      map(([allTags, searchTerm]) => this._filter(allTags, searchTerm)),
      map((filteredTags) => this._sort(filteredTags))
    );
  }

  ngOnInit() {
    if (this.preSelectedTags && this.preSelectedTags.length) {
      this.preSelectedTags.map((tag: ITagDto) => this.tagFormArray.push(new FormControl(tag)));
    }
  }

  onTagAdded(event: MatChipInputEvent): void {
    const inputEl = event.input;
    const tagLabel = event.value;

    if (!tagLabel || !tagLabel.length) {
      return;
    }

    this.tagService.create(tagLabel).subscribe(
      (createdTag: ITagDto) => {
        this.tagFormArray.push(new FormControl(createdTag));

        inputEl.value = '';
        this.tagInputControl.setValue(null);

        this.toastr.success(`Tag "${tagLabel}" erfolgreich angelegt`);
        this.refreshSuggestions();
      }
    );
  }

  onTagRemoved(tag: ITagDto): void {
    const index = this.tagFormArray.value.indexOf(tag);
    if (index >= 0) {
      this.tagFormArray.removeAt(index);
      this.refreshSuggestions();
    }
  }

  onTagSelected(event: MatAutocompleteSelectedEvent): void {
    this.tagFormArray.push(new FormControl(event.option.value));

    this.tagInput.nativeElement.value = '';
    this.tagInputControl.setValue(null);
  }

  _filter(allTags: ITagDto[], searchTerm: string): ITagDto[] {
    return allTags.filter((tag: ITagDto) => {
      const labelMatchesSearchTerm = tag.label.search(new RegExp(searchTerm, 'i')) >= 0;
      const tagIsNotSelected = !this.tagFormArray.value.find((selectedTag: ITagDto) => selectedTag.label === tag.label);
      return labelMatchesSearchTerm && tagIsNotSelected;
    });
  }

  _sort(tags: ITagDto[]): ITagDto[] {
    return tags.sort(
      (a, b) => (a.label.toLowerCase() > b.label.toLowerCase()) ? 1 : ((b.label.toLowerCase() > a.label.toLowerCase()) ? -1 : 0)
    );
  }

}
