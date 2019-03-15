import { Component, OnInit, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-image-marker',
  template: `
    <div [ngStyle]="{left: x, top: y}">
      <mat-form-field>
        <mat-label>Name</mat-label>
        <input matInput placeholder="Name">
      </mat-form-field>
      <button mat-raised-button color="primary" (click)="remove()">Löschen</button>
    </div>
  `,
  styles: [`
    div {
      position: absolute;
      background-color: rgba(255, 255, 255, 0.5);
    }
  `]
})
export class ImageMarkerComponent implements OnInit {

  public x: string;
  public y: string;
  public onDel: EventEmitter<any> = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  remove() {
    this.onDel.emit();
  }

}
