import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {BehaviorSubject, map, Observable} from "rxjs";
import {Airport} from "../models/airport";
import {AIRPORT_SERVICE_URL} from "../constants/services-constants";
import {tap} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class AirportService {

  private airportsCollection$: BehaviorSubject<Airport[]> = new BehaviorSubject<Airport[]>([]);

  constructor(private http: HttpClient) {
    this.refreshCollection();
  }

  public refreshCollection(): void {
    this.http.get<Airport[]>(`${AIRPORT_SERVICE_URL}`).pipe(
      map((tab) => {
        return tab.map((airport) => {
          return new Airport(airport);
        })
      })
    ).subscribe((data) => {
      this.airportsCollection$.next(data);
    })
  }

  public get airportsCollection(): Observable<Airport[]> {
    return this.airportsCollection$;
  }

  public getHubs(): Observable<Airport[]> {
    return this.http.get<Airport[]>(`${AIRPORT_SERVICE_URL}?hub=true`);
  }

  public getAirport(id: number): Observable<any> {
    return this.http.get<Airport>(`${AIRPORT_SERVICE_URL}${id}`);
  }

  public createAirport(airport: any): Observable<Airport> {
    return this.http.post<Airport>(`${AIRPORT_SERVICE_URL}`, airport).pipe(
      tap(() => {
        this.refreshCollection();
      })
    );
  }

  public updateAirport(airport: Airport): Observable<Airport> {
    return this.http.put<Airport>(`${AIRPORT_SERVICE_URL}${airport.id}`, airport).pipe(
      tap(() => {
        this.refreshCollection();
      })
    );
  }

  public deleteAirport(airportId: number): Observable<Airport> {
    return this.http.delete<Airport>(`${AIRPORT_SERVICE_URL}${airportId}`).pipe(
      tap(() => {
        this.refreshCollection();
      })
    );
  }
}
