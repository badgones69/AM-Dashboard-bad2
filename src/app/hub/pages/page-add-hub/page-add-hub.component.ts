import {Component, OnDestroy, OnInit} from '@angular/core';
import {AirportService} from "../../../shared/services/airport.service";
import {Airport} from "../../../shared/models/airport";
import {NULL} from "../../../shared/utils/common-utils";
import {NotificationService} from "../../../shared/services/notification.service";
import {ADD_FORM_MODE, HUB_FORM_TITLE} from "../../../shared/constants/form-constants";
import {Router} from "@angular/router";
import {takeUntil} from "rxjs/operators";
import {Subject} from "rxjs";

@Component({
  selector: 'app-page-add-hub',
  templateUrl: './page-add-hub.component.html',
  styleUrls: []
})
export class PageAddHubComponent implements OnInit, OnDestroy {

  public unsubscriber: Subject<void> = new Subject<void>();

  public hubAirport!: Airport;
  public formMode: string = ADD_FORM_MODE;

  constructor(private airportService: AirportService, private notificationService: NotificationService, private router: Router) {
  }

  ngOnInit(): void {
    // This class will never be initialized
  }

  addHub(hubAirport: Airport): void {
    this.airportService.createAirport(hubAirport).pipe(takeUntil(this.unsubscriber)).subscribe(hubAirportCreated => {
      if (hubAirportCreated.id != NULL) {
        this.notificationService.showSuccess(`${this.formMode} ${HUB_FORM_TITLE}`, 'Votre hub a bien été créé !');
        this.router.navigate(['hubs']);
      }
    });
  }

  ngOnDestroy(): void {
    this.unsubscriber.next();
    this.unsubscriber.complete();
  }
}
