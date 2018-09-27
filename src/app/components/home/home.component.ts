import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ElectronService } from '../../providers/electron.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  applicationVersion: string;
  greetings: string;

  constructor(private http: HttpClient, private electronService: ElectronService) { }

  ngOnInit() {
    this.applicationVersion = this.electronService.getApplicationVersion();

    this.http.get('http://localhost:4201/welcome/philippe')
      .subscribe((args) => {
        this.greetings = args.toString();
      });
  }

}
