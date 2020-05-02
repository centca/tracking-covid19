import { Component, OnInit, ViewChild, AfterViewInit,ElementRef } from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {Covid19Service} from './covid19.service';
import {Pais} from './covid19';

import {Confirmados} from './covid19';
import {Recuperados} from './covid19';
import {GoogleCharts} from 'google-charts';

import * as $ from "jquery"


@Component({
  selector: 'app-covid19',
  templateUrl: './covid19.component.html',
  styleUrls: ['./covid19.component.css']
})

export class Covid19Component implements OnInit, AfterViewInit{
  title = 'covid19-new';
  globalPaises: Pais[] = [];
  resultadoGlobal: Pais = <Pais>{};
  breakpoint: number;
  fechaUpdate: string = "";

  confirmados: Confirmados[] = [];
  recuperados: Recuperados[] = [];

  isShowDivIf: string;

  onResize(event) {
    this.breakpoint = (event.target.innerWidth <= 400) ? 1 : 6;
  }

  //-------------Paginacion-------------------
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  @ViewChild('chartElement') chartElement: ElementRef<HTMLElement>;

  //--------------Constructor---------------------------
  constructor(private covid19Service: Covid19Service) { }

  displayedColumns: string[] = ['pais', 'totalConfirmados','nuevosConfirmados','totalMuertos','nuevosMuertos', 'totalRecuperados'];
  dataSource = new MatTableDataSource<Pais>(this.globalPaises);

  ngOnInit() {
    this.getGlobal();
    this.getGlobalResultado();

    this.breakpoint = (window.innerWidth <= 768) ? 1 : 3;
    this.getCharts('mapa');

  }

  ngAfterViewInit() {

    $(".btn.btn-default").click(function() {
      $('.btn.btn-default').removeClass('active');
      $(this).addClass('active');

    });

    this.paginator._intl.itemsPerPageLabel="Items por página";
    setTimeout(() => this.dataSource.paginator = this.paginator,500);

  }

  //-------------Filtro-------------------
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

  }

  //Get::::Todos los paises:::::::::
  getGlobal(): Pais[]{
    this.covid19Service.getGlobal().subscribe(response =>{

      for(let i = 0; i<response["data"].length; i++){
          let globalPais: Pais = <Pais>{};
          globalPais.pais = response["data"][i]["name"];
          globalPais.totalConfirmados= response["data"][i]["latest_data"]["confirmed"];
          globalPais.nuevosConfirmados= response["data"][i]["today"]["confirmed"];
          globalPais.totalMuertos= response["data"][i]["latest_data"]["deaths"];
          globalPais.nuevosMuertos= response["data"][i]["today"]["deaths"];
          globalPais.totalRecuperados= response["data"][i]["latest_data"]["recovered"];
          this.globalPaises.push(globalPais);
      }

    });
    return this.globalPaises;

  }
  //Get::::Resultado total de muertos, confirmados y recuperados:::::::::
  getGlobalResultado(): Pais{
    this.covid19Service.getGlobalResultado().subscribe(response => {
      console.log(response["data"])
      for(let i of response["data"]){
        this.resultadoGlobal.totalConfirmados = i["confirmed"];
        this.resultadoGlobal.totalRecuperados = i["recovered"];
        this.resultadoGlobal.totalMuertos = i["deaths"];
        this.fechaUpdate = i["updated_at"];
        this.fechaUpdate = this.fechaUpdate.split("T")[1].split(".")[0];
        break;
      }
    });
    return this.resultadoGlobal;
  }


  //::::::Charts de GEO y LINE::::::::::::::::::
  getCharts(valor:string){
    if(valor == 'mapa'){

      this.isShowDivIf = 'mapa';
      let totalTimeline: any[] = [];
      this.covid19Service.getGlobal().subscribe(response =>{

        for(let i = 0; i<response["data"].length; i++){
            let globalPais: any[] = [];
            globalPais.push(response["data"][i]["code"]);
            globalPais.push(response["data"][i]["latest_data"]["confirmed"]);
            globalPais.push(response["data"][i]["latest_data"]["recovered"]);
            totalTimeline.push(globalPais);
        }
        totalTimeline.unshift(["Pais", "Confirmados","Recuperados"]);


        setTimeout(() => GoogleCharts.load(drawRegionsMap, {'packages':['corechart'],
        'mapsApiKey': 'AIzaSyCa707Z6twDDBtocVLpoAeDflfUdDOADpk'}),5);

        function drawRegionsMap() {
            var data = GoogleCharts.api.visualization.arrayToDataTable(totalTimeline);

            var options = {
              backgroundColor: '#2E342F',
              colorAxis: {colors: ['#6C3483']}
            };

            var chart = new GoogleCharts.api.visualization.GeoChart(document.getElementById('regions_div'));

            chart.draw(data, options);
        }

      });


    }else{

        this.isShowDivIf = 'line';
        let totalTimeline: any[] = [];
        this.covid19Service.getGlobalResultado().subscribe(response => {
            //::::::::::::Grafica LINE:::::::::::::::
            for(let i of response["data"]){
              let totalGlobalFor: any[] = [];
              let fecha = i["updated_at"].split('T')[0];
              totalGlobalFor.push(new Date(fecha.split("-")[0],fecha.split("-")[1]-1,fecha.split("-")[2]));
              totalGlobalFor.push(i["confirmed"]);
              totalGlobalFor.push(i["recovered"]);
              totalTimeline.push(totalGlobalFor)
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

}
