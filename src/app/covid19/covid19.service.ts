import { Injectable} from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class Covid19Service {

  constructor(private http: HttpClient) { }

  //https://corona-api.com/countries
  getGlobal(): Observable<any> {
    //return of(CLIENTES);
    let observable = this.http.get("https://corona-api.com/countries").pipe(
      map(response => response as any)
    );
    return observable;
  }

  //Resultado global de todos los paises
  getGlobalResultado(): Observable<any> {
    //return of(CLIENTES);
    let observable = this.http.get("https://corona-api.com/timeline").pipe(
      map(response => response as any)
    );
    return observable;
  }

  //Resultado global de todos los paises
  getByPais(pais): Observable<any> {
    //return of(CLIENTES);
    let observable = this.http.get("https://api.covid19tracking.narrativa.com/api/country/"+pais+"?date_from=2020-04-29").pipe(
      map(response => response as any)
    );
    return observable;
  }

}
