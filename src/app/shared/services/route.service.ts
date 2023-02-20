import {Injectable} from '@angular/core';
import {ROUTE_SERVICE_URL} from "../constants/services-constants";
import {BehaviorSubject, Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {Route} from "../models/route";
import {map} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class RouteService {

  private routesCollection$: BehaviorSubject<Route[]> = new BehaviorSubject<Route[]>([]);

  constructor(private http: HttpClient) {
    this.refreshCollection();
  }

  public refreshCollection(): void {
    this.http.get<Route[]>(`${ROUTE_SERVICE_URL}`).pipe(
      map((tab) => {
        return tab.map((route) => {
          return new Route(route);
        })
      })
    ).subscribe((data) => {
      this.routesCollection$.next(data);
    })
  }

  public get routesCollection(): Observable<Route[]> {
    return this.routesCollection$;
  }
}
