import { Component, OnInit, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { MatTableDataSource, MatSort, MatPaginator } from '@angular/material';
import { IColumnInterface } from './IColumnDefinition';
import { ITableConfig } from './ITableConfig';

@Component({
  selector: 'app-table-wrapper',
  templateUrl: './table-wrapper.component.html',
  styleUrls: ['./table-wrapper.component.scss']
})
export class TableWrapperComponent implements OnInit, OnChanges {

  @Input() config: ITableConfig;
  @Input() columns: IColumnInterface[] = [];
  @Input() elements = [];

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  displayedColumns: string[];
  dataSource: MatTableDataSource<any>;

  constructor() { }

  ngOnInit() {
    this.createTableRows();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.createTableRows();
  }

  createTableRows() {
    this.displayedColumns = this.columns.map(x => x.columnDef);
    this.dataSource = new MatTableDataSource(this.elements);
    if (this.elements) {
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    }
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

}
