import { Component, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit {

  navigationItems = [
    { label: 'Explorer', iconClass: 'folder', route: '/explorer' },
    { label: 'Management', iconClass: 'table_chart', route: '/management' },
    { label: 'Tags', iconClass: 'bookmarks', route: '/management/tags', isChild: true },
    { label: 'Settings', iconClass: 'settings', route: '/settings' },
    { label: 'Playground', iconClass: 'child_care', route: '/playground' }
  ];

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches)
    );

  constructor(private breakpointObserver: BreakpointObserver) { }

  ngOnInit() {
  }

}
