import { Component, OnInit} from '@angular/core';
import { Meta, MetaDefinition } from '@angular/platform-browser';
import * as $ from "jquery"

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'covid19-new';

  //--------------Constructor---------------------------
  constructor(private metaService: Meta) {
    this.addTag();
}

addTag() {
   this.metaService.addTag({ name: 'description', content: 'Coronavirus (Covid19) - Estadísticas en tiempo real de todos los paises y también la regiones' });
   this.metaService.addTag({ name: 'robots', content: 'index,follow' });
   this.metaService.addTag({ name: 'language', content: 'Spanish' });
   this.metaService.addTag({name: 'keywords', content: 'covid19,coronavirus,coronavirus españa,covid esp,corona virus españa, track, tracking covid19, coronavirus regiones,track coronavirus, corona'});
   this.metaService.addTag({ property: 'og:title', content: 'Datos Covid19 en tiempo real' });

   this.metaService.addTag({ name: 'apple-mobile-web-app-capable', content: 'no' });
   this.metaService.addTag({ name: 'apple-mobile-web-app-status-bar-style', content: 'default' });
   this.metaService.addTag({ name: 'apple-mobile-web-app-title', content: 'Datos Covid19' });
}

  ngOnInit() {


  }

}
