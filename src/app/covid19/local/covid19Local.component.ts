import { Component, OnInit, ViewChild, AfterViewInit  } from '@angular/core';
import {ActivatedRoute,Router} from '@angular/router';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {Covid19LocalService} from './covid19Local.service';
import {Region} from './covid19Local';
import {NombrePaises} from './covid19Local';
import {Pais} from './covid19Local';

import {GoogleCharts} from 'google-charts';

import * as $ from "jquery";
declare var jQuery: any;

@Component({
  selector: 'app-covid19Local',
  templateUrl: './covid19Local.component.html',
  styleUrls: ['./covid19Local.component.css']
})

export class Covid19LocalComponent implements OnInit, AfterViewInit{
  title = 'covid19-new';
  regiones: Region[] = [];
  breakpoint: number;
  selectPais: string;
  nombrePaises: NombrePaises[] = [];

  //--------------Constructor---------------------------
  constructor(private covid19LocalService: Covid19LocalService, private activatedRoute: ActivatedRoute, private router: Router) { }

  //-------------Paginacion----------------------------
  @ViewChild(MatPaginator) paginator: MatPaginator;

  displayedColumns: string[] = ['name', 'totalConfirmados','nuevosConfirmados','totalMuertos','nuevosMuertos', 'totalRecuperados','nuevosRecuperados'];
  dataSource = new MatTableDataSource<Region>(this.regiones);

  ngAfterViewInit():void {
    setTimeout(() => jQuery(".selectpicker").selectpicker(),1500);
  }

  //-------------Filtro-------------------
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

  }

  ngOnInit() {
    //this.paginator._intl.itemsPerPageLabel="Items por página";
    //setTimeout(() => this.dataSource.paginator = this.paginator,3000);

    this.getCodePaises()

    //-------------------------Grafica por defecto ESPAÑA-------------------------
    this.covid19LocalService.getByPaisCode('ES').subscribe(response => {
        this.paisCode.name = response["data"]["name"]
        this.paisCode.totalConfirmados = response["data"]["latest_data"]["confirmed"]
        this.paisCode.nuevosConfirmados = response["data"]["today"]["confirmed"]
        this.paisCode.totalMuertos = response["data"]["latest_data"]["deaths"]
        this.paisCode.nuevosMuertos = response["data"]["today"]["deaths"]
        this.paisCode.totalRecuperados = response["data"]["latest_data"]["recovered"]

    });
    let totalTimeline: any[] = [];
    this.covid19LocalService.getByPaisCodeTimeline('ES').subscribe(response =>{
      for(let i of response["data"]["timeline"]){
        let totalGlobalFor: any[] = [];
        let fecha = i["updated_at"].split('T')[0];
        totalGlobalFor.push(new Date(fecha.split("-")[0],fecha.split("-")[1]-1,fecha.split("-")[2]));
        totalGlobalFor.push(i["confirmed"]);
        totalGlobalFor.push(i["recovered"]);
        totalTimeline.push(totalGlobalFor);
      }

      GoogleCharts.load(drawChart, {'packages':['corechart'],
      'mapsApiKey': 'AIzaSyCa707Z6twDDBtocVLpoAeDflfUdDOADpk'});

      function drawChart() {

        var data = new GoogleCharts.api.visualization.DataTable();
        data.addColumn('date', 'Day');
        data.addColumn('number', 'Confirmados');
        data.addColumn('number', 'Recuperados');
        data.addRows(totalTimeline);

      var formatter = new GoogleCharts.api.visualization.DateFormat({formatType: 'short',pattern: "d/M/yy"});

      // Reformat our data.
      formatter.format(data, 0);

      var options = {
          hAxis: {
            titleTextStyle: {color: 'white'},
            textStyle: {color: 'white', fontName: 'Changa'},
            slantedText: true, slantedTextAngle:60,
            format: 'd/M/yy',
            gridlines:{color: '#333', minSpacing: 30}
          },
          vAxis: {
            minValue: 0,
            textStyle: {color: 'white', fontName: 'Changa'},
            gridlines:{color: '#6C3483', minSpacing: 30}
          },
          backgroundColor: '#2E342F',

          series: {
            0: { color: '#6C3483', lineDashStyle: [1, 1], pointSize: 5 },
            1: { color: 'white', lineDashStyle: [1, 1], pointSize: 5}
          },
          legend:{position: 'bottom', textStyle: {color: 'white', fontSize: 16, fontName: 'Changa'}},
          chartArea:{left:'75',right:'10',width:'100%'}
        };

        var chart = new GoogleCharts.api.visualization.AreaChart(document.getElementById('chart_div'));
        chart.draw(data, options);
      }
    });
    //-------------------------Grafica por defecto ESPAÑA-------------------------
  }
  isRegionActiva: boolean = false;
  getRegionesClick(pais:string){

    this.regiones = [];
    let date = new Date()
    let day = new Date(date.getTime() - 24*60*60*1000).getDate();
    let month = date.getMonth() + 1
    let year = date.getFullYear()
    let fechaTotal: string = (year).toString() + "-" + (month).toString() + "-" + (day).toString();
    this.isRegionActiva = true

    this.covid19LocalService.getByPais(pais,fechaTotal).subscribe(response => {

        let countries = Object.keys(response['dates']).map((k,i) => response['dates'][k])[0]['countries'];
        let regions = Object.keys(countries).map((k,i) => countries[k])[0]["regions"];
        for(let r of regions){
          let region: Region = new Region();
          region.name = r["name"];
          region.totalConfirmados = r["today_confirmed"];
          region.nuevosConfirmados = r["today_new_confirmed"];
          region.totalMuertos = r["today_deaths"];
          region.nuevosMuertos = r["today_new_deaths"];
          region.totalRecuperados = r["today_recovered"];
          region.nuevosRecuperados = r["today_new_recovered"];
          this.regiones.push(region);
        }

        this.dataSource = new MatTableDataSource<Region>(this.regiones)
        this.paginator._intl.itemsPerPageLabel="Items por página";
        this.dataSource.paginator = this.paginator;
    });


  }

  //-------------Obtenemos el CODE Y NOMBRE de cada PAIS----------------
  listCode: NombrePaises[] = [];
  getCodePaises(): NombrePaises[]{
    this.covid19LocalService.getCodePaises().subscribe(response => {
      for(let i of response["data"]){
        let codeName: NombrePaises = new NombrePaises();
        if(i["code"]!="ES"){
          codeName.name = i["code"] +"-"+ i["name"];
          this.listCode.push(codeName);
        }
      }
    });
    this.listCode.unshift({name:"ES-Spain"})
    return this.listCode;
  }

  selec: string;
  paisCode: Pais = new Pais();
  isShowRegiones:boolean = false;
  isShowEspania:string = "Spain";
  changedP(e){
    this.isRegionActiva = false;
    this.selec = e.target.value;
    this.selec = this.selec.split("-")[0];
    let paisSelect = (e.target.value).split("-")[1]
    this.isShowEspania = paisSelect;
    let paisesArray: any[] = ["Spain","USA","Chile","China","India","Italy","Brazil","Canada","France","Mexico","Denmark",
                        "Germany","Colombia","Portugal","Argentina","Australia","Netherlands","Switzerland","UK"];

    this.isShowRegiones = false;
    for(let p of paisesArray){
      if(p == paisSelect){
        this.isShowRegiones = true;
      }
    }

    this.covid19LocalService.getByPaisCode(this.selec).subscribe(response => {

        if(response["data"]["name"] =="USA"){
          this.paisCode.name = "US";
        }else if(response["data"]["name"] =="UK"){
          this.paisCode.name = "United_Kingdom";
        }else{
          this.paisCode.name = response["data"]["name"];
        }

        this.paisCode.totalConfirmados = response["data"]["latest_data"]["confirmed"]
        this.paisCode.nuevosConfirmados = response["data"]["today"]["confirmed"]
        this.paisCode.totalMuertos = response["data"]["latest_data"]["deaths"]
        this.paisCode.nuevosMuertos = response["data"]["today"]["deaths"]
        this.paisCode.totalRecuperados = response["data"]["latest_data"]["recovered"]

    });

    let totalTimeline: any[] = [];
    this.covid19LocalService.getByPaisCodeTimeline(this.selec).subscribe(response =>{
      for(let i of response["data"]["timeline"]){
        let totalGlobalFor: any[] = [];
        let fecha = i["updated_at"].split('T')[0];
        totalGlobalFor.push(new Date(fecha.split("-")[0],fecha.split("-")[1]-1,fecha.split("-")[2]));
        totalGlobalFor.push(i["confirmed"]);
        totalGlobalFor.push(i["recovered"]);
        totalTimeline.push(totalGlobalFor);
      }

      GoogleCharts.load(drawChart, {'packages':['corechart'],
      'mapsApiKey': 'AIzaSyCa707Z6twDDBtocVLpoAeDflfUdDOADpk'});

      function drawChart() {

        var data = new GoogleCharts.api.visualization.DataTable();
        data.addColumn('date', 'Day');
        data.addColumn('number', 'Confirmados');
        data.addColumn('number', 'Recuperados');
        data.addRows(totalTimeline);

      var formatter = new GoogleCharts.api.visualization.DateFormat({formatType: 'short',pattern: "d/M/yy"});

      // Reformat our data.
      formatter.format(data, 0);

      var options = {
          hAxis: {
            titleTextStyle: {color: 'white'},
            textStyle: {color: 'white', fontName: 'Changa'},
            slantedText: true, slantedTextAngle:60,
            format: 'd/M/yy',
            gridlines:{color: '#333', minSpacing: 30}
          },
          vAxis: {
            minValue: 0,
            textStyle: {color: 'white', fontName: 'Changa'},
            gridlines:{color: '#6C3483', minSpacing: 30}
          },
          backgroundColor: '#2E342F',

          series: {
            0: { color: '#6C3483', lineDashStyle: [1, 1], pointSize: 5 },
            1: { color: 'white', lineDashStyle: [1, 1], pointSize: 5}
          },
          legend:{position: 'bottom', textStyle: {color: 'white', fontSize: 16, fontName: 'Changa'}},
          chartArea:{left:'75',right:'10',width:'100%'}
        };

        var chart = new GoogleCharts.api.visualization.AreaChart(document.getElementById('chart_div'));
        chart.draw(data, options);
      }
    });

  }

}
