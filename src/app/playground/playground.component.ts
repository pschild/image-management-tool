import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ElectronService } from '../core/services/electron.service';
import { DialogService } from '../core/services/dialog.service';
import { AppConfig } from '../../environments/environment';
import { MatMenuTrigger } from '@angular/material';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent, MatChipInputEvent } from '@angular/material';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { Select, Store } from '@ngxs/store';
import { AppendBar, FooState } from './playground.state';

@Component({
  selector: 'app-playground',
  templateUrl: './playground.component.html',
  styleUrls: ['./playground.component.scss']
})
export class PlaygroundComponent implements OnInit {

  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = false;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  fruitCtrl = new FormControl();
  filteredFruits: Observable<string[]>;
  fruits: string[] = ['Lemon'];
  allFruits: string[] = ['Apple', 'Lemon', 'Lime', 'Orange', 'Strawberry'];

  @ViewChild('fruitInput') fruitInput: ElementRef<HTMLInputElement>;

  @ViewChild('contextMenuTrigger', { read: MatMenuTrigger }) public contextMenuTrigger: MatMenuTrigger;
  public menuLeft = 0;
  public menuTop = 0;

  applicationVersion: string;
  greetings: string;

  @Select(FooState) foo$: Observable<string>;

  constructor(
    private http: HttpClient,
    private electronService: ElectronService,
    private dialogService: DialogService,
    private toastr: ToastrService,
    private store: Store
  ) {
    this.filteredFruits = this.fruitCtrl.valueChanges.pipe(
      startWith(null),
      map((fruit: string | null) => fruit ? this._filter(fruit) : this.allFruits.slice()));
  }

  ngOnInit() {
    this.applicationVersion = this.electronService.getApplicationVersion();

    this.http.get(`${AppConfig.serverBaseUrl}/welcome/philippe`)
      .subscribe((args) => {
        this.greetings = args.toString();
      });
  }

  openFolderDialog() {
    this.dialogService.showOpenFolderDialog((filePaths: string[], bookmarks: string[]) => {
      console.log(filePaths);
    }, true);
  }

  openFileDialog() {
    this.dialogService.showOpenFileDialog((filePaths: string[], bookmarks: string[]) => {
      if (filePaths && filePaths.length) {
        const chosenFilePath = filePaths[0];
        this.http.get(`${AppConfig.serverBaseUrl}/cropImage/${encodeURI(chosenFilePath)}`)
          .subscribe((args) => {
            console.log(args);
          });
      }
    });
  }

  openContextMenu(event) {
    event.preventDefault();
    this.menuLeft = event.x;
    this.menuTop = event.y;
    this.contextMenuTrigger.openMenu();
  }

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Add our fruit
    if ((value || '').trim()) {
      this.fruits.push(value.trim());
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }

    this.fruitCtrl.setValue(null);
  }

  remove(fruit: string): void {
    const index = this.fruits.indexOf(fruit);

    if (index >= 0) {
      this.fruits.splice(index, 1);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.fruits.push(event.option.viewValue);
    this.fruitInput.nativeElement.value = '';
    this.fruitCtrl.setValue(null);
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.allFruits.filter(fruit => fruit.toLowerCase().indexOf(filterValue) === 0);
  }

  showSuccess() {
    this.toastr.success('Hello world!', 'Toastr fun!');
  }

  onAppendClick() {
    this.store.dispatch(new AppendBar('baz'));
  }

}
