import { Component, OnInit, Input, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { TagService } from '../tag.service';
import { COMMA, TAB, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent, MatAutocompleteSelectedEvent, MatAutocomplete } from '@angular/material';
import { Observable, BehaviorSubject } from 'rxjs';
import { ITagDto } from '../../../../../shared/dto/ITag.dto';
import { FormControl } from '@angular/forms';
import { startWith, map, combineLatest } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-tag-chips',
  templateUrl: './tag-chips.component.html',
  styleUrls: ['./tag-chips.component.scss']
})
export class TagChipsComponent implements OnInit {

  separatorKeysCodes = [TAB, COMMA, ENTER];

  @ViewChild('tagInput') tagInput: ElementRef;
  @ViewChild('autoComplete') matAutocomplete: MatAutocomplete;

  tagControl = new FormControl();

  @Input() preSelectedTags: ITagDto[] = [];
  @Output() chipsChange: EventEmitter<ITagDto[]> = new EventEmitter();

  allTags$: Observable<ITagDto[]>;
  filteredTags$: Observable<ITagDto[]>;
  selectedTags: ITagDto[] = [];
  test$ = new BehaviorSubject<boolean>(true);

  constructor(
    private tagService: TagService,
    private toastr: ToastrService
  ) {
    this.refreshSuggestions();
  }

  refreshSuggestions() {
    this.allTags$ = this.tagService.loadAll();
    this.filteredTags$ = this.allTags$.pipe(
      combineLatest(this.tagControl.valueChanges.pipe(startWith(''))),
      map(([allTags, searchTerm]) => this._filter(allTags, searchTerm)),
      map((filteredTags) => this._sort(filteredTags))
    );
  }

  ngOnInit() {
    this.selectedTags = this.preSelectedTags || [];
  }

  onTagAdded(event: MatChipInputEvent): void {
    const inputEl = event.input;
    const tagLabel = event.value;

    if (!tagLabel || !tagLabel.length || this.matAutocomplete.isOpen) {
      return;
    }

    this.tagService.create(tagLabel).subscribe(
      (createdTag: ITagDto) => {
        this.selectedTags.push(createdTag);
        this.chipsChange.emit(this.selectedTags);

        inputEl.value = '';
        this.tagControl.setValue(null);

        this.toastr.success(`Tag "${tagLabel}" hinzugefügt`);
        this.refreshSuggestions();
      }
    );
  }

  onTagRemoved(tag: ITagDto): void {
    const index = this.selectedTags.indexOf(tag);
    if (index >= 0) {
      this.selectedTags.splice(index, 1);
      this.refreshSuggestions();
      this.chipsChange.emit(this.selectedTags);
    }
  }

  onTagSelected(event: MatAutocompleteSelectedEvent): void {
    this.selectedTags.push(event.option.value);
    this.chipsChange.emit(this.selectedTags);

    this.tagInput.nativeElement.value = '';
    this.tagControl.setValue(null);
  }

  _filter(allTags: ITagDto[], searchTerm: string): ITagDto[] {
    return allTags.filter((tag: ITagDto) => {
      const labelMatchesSearchTerm = tag.label.search(new RegExp(searchTerm, 'i')) >= 0;
      const tagIsNotSelected = !this.selectedTags.find((selectedTag: ITagDto) => selectedTag.label === tag.label);
      return labelMatchesSearchTerm && tagIsNotSelected;
    });
  }

  _sort(tags: ITagDto[]): ITagDto[] {
    return tags.sort(
      (a, b) => (a.label.toLowerCase() > b.label.toLowerCase()) ? 1 : ((b.label.toLowerCase() > a.label.toLowerCase()) ? -1 : 0)
    );
  }

}
