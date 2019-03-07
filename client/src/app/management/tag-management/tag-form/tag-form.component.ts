import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ITagDto } from '../../../../../../shared/dto/ITag.dto';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-tag-form',
  templateUrl: './tag-form.component.html',
  styleUrls: ['./tag-form.component.scss']
})
export class TagFormComponent implements OnInit {

  @Input() tag$: Observable<ITagDto>;
  @Output() save: EventEmitter<ITagDto> = new EventEmitter<ITagDto>();

  @ViewChild('formEl') formEl;

  tagForm = this.fb.group({
    id: [''],
    label: ['', Validators.required]
  });

  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    this.tag$.subscribe((tag: ITagDto) => {
      this.tagForm.patchValue({
        id: tag.id,
        label: tag.label
      });
    });
  }

  onReset() {
    this.tagForm.reset();
  }

  onSubmit() {
    console.log(this.tagForm.status);
    console.log(this.tagForm.valid);
    console.log(this.tagForm.value);
    if (this.tagForm.valid) {
      this.save.emit(this.tagForm.value);
      this.formEl.resetForm();
    }
  }

}
