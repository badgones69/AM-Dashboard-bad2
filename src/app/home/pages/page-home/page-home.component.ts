import {Component, OnDestroy, OnInit} from '@angular/core';
import {AirlineService} from "../../../shared/services/airline.service";
import {APP_NAME} from "../../../shared/constants/app-constants";
import {Subject} from "rxjs";
import {takeUntil} from "rxjs/operators";

@Component({
  selector: 'app-page-home',
  templateUrl: './page-home.component.html',
  styleUrls: ['./page-home.component.scss']
})
export class PageHomeComponent implements OnInit, OnDestroy {

  public unsubscriber: Subject<void> = new Subject<void>();

  public welcomeMessage!: string;

  constructor(private airlineService: AirlineService) {
  }

  ngOnInit(): void {
    this.airlineService.getAirline(1).pipe(takeUntil(this.unsubscriber)).subscribe(
      airline => {
        this.welcomeMessage = 'le portail de la compagnie ' + airline.name;
      },
      () => this.welcomeMessage = `l\'application ${APP_NAME}`
    );
  }

  ngOnDestroy(): void {
    this.unsubscriber.next();
    this.unsubscriber.complete();
  }
}
