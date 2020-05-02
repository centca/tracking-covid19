import { Injectable} from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class Covid19LocalService {

  constructor(private http: HttpClient) { }

  private proxyurl = "https://morning-river-35554.herokuapp.com/";
  private urlBase = "https://api.covid19tracking.narrativa.com/api/country/";
  //Resultado global de todos los paises
  getByPais(pais:string, fecha: string): Observable<any> {
    //return of(CLIENTES);
    let observable = this.http.get(this.proxyurl + `${this.urlBase}${pais}`+'?date_from=' + fecha).pipe(
      map(response => response as any)
    );
    return observable;
  }


  private urlBasePaises = "https://api.covid19tracking.narrativa.com/api/countries"
  getNombrePaises(): Observable<any> {
    let observable = this.http.get(this.proxyurl+this.urlBasePaises).pipe(
      map(response => response as any)
    );
    return observable;
  }




  private urlCodePaises = "https://corona-api.com/countries"
  getCodePaises(): Observable<any> {
    let observable = this.http.get(this.urlCodePaises).pipe(
      map(response => response as any)
    );
    return observable;
  }


  getByPaisCode(code:string): Observable<any> {
    let observable = this.http.get(`${this.urlCodePaises}/${code}`).pipe(
      map(response => response as any)
    );
    return observable;
  }

  getByPaisCodeTimeline(code:string): Observable<any> {
    let observable = this.http.get(`${this.urlCodePaises}/${code}`+'?include=timeline').pipe(
      map(response => response as any)
    );
    return observable;
  }
}
