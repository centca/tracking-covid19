import { Component, OnInit, AfterViewInit } from '@angular/core';
import * as $ from "jquery";

@Component({
  selector: 'footer-app',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit,AfterViewInit{
  title = 'covid19';
  region: string = 'spain'
  ngOnInit() {

  }
  ngAfterViewInit() {

  }
}
