import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Covid19Component } from './covid19/covid19.component';
import { Covid19LocalComponent } from './covid19/local/covid19Local.component';
//import { GeoChartsCovid19Component } from './covid19/graficas/geocharts.component';

const routes: Routes = [
  {path:'', redirectTo:'/global', pathMatch:'full'},
  {path: 'global', component: Covid19Component},
  {path: 'local', component: Covid19LocalComponent},
  {path: 'local/paises', component: Covid19LocalComponent}

]


@NgModule({
  imports: [ RouterModule.forRoot(routes)],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
