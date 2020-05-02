import { Component, OnInit, AfterViewInit } from '@angular/core';
import * as $ from "jquery";

@Component({
  selector: 'header-app',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit,AfterViewInit{
  title = 'covid19';
  region: string = 'spain'
  ngOnInit() {

  }
  ngAfterViewInit() {

    if(window.location.pathname=='/local'){
      $('a.nav-link.local').addClass('active');
      $('a.nav-link.global').removeClass('active');
    }else{

      $('a.nav-link.global').addClass('active');
      $('a.nav-link.local').removeClass('active');
    }

    $(".navbar-dark .navbar-nav .nav-link").click(function() {
      $('.navbar-dark .navbar-nav .nav-link').removeClass('active');
      $(this).addClass('active');
    });


  }
}
