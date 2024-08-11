import {Component, OnDestroy, OnInit} from '@angular/core';
import {AirportService} from "../../../shared/services/airport.service";
import {Airport} from "../../../shared/models/airport";
import {NotificationService} from "../../../shared/services/notification.service";
import {EDIT_FORM_MODE, HUB_FORM_TITLE} from "../../../shared/constants/form-constants";
import {ActivatedRoute, Router} from "@angular/router";
import {takeUntil} from "rxjs/operators";
import {Observable, Subject} from "rxjs";

@Component({
  selector: 'app-page-add-hub',
  templateUrl: './page-edit-hub.component.html',
  styleUrls: []
})
export class PageEditHubComponent implements OnInit, OnDestroy {

  public unsubscriber: Subject<void> = new Subject<void>();

  public hubAirport!: Airport;
  public hubAirportId!: number;
  public hubAirport$!: Observable<Airport>;
  public formMode: string = EDIT_FORM_MODE;

  constructor(private airportService: AirportService, private notificationService: NotificationService, private route: ActivatedRoute, private router: Router) {
    this.hubAirportId = Number(this.route.snapshot.paramMap.get('id'));
    this.hubAirport$ = this.airportService.getAirport(this.hubAirportId);
  }

  ngOnInit(): void {
    // This class will never be initialized
  }

  editHub(hubAirport: Airport): void {
    hubAirport.id = this.hubAirportId;
    this.airportService.updateAirport(hubAirport).pipe(takeUntil(this.unsubscriber)).subscribe(() => {
      this.notificationService.showSuccess(`${this.formMode} ${HUB_FORM_TITLE}`, 'Votre hub a bien été modifié !');
      this.router.navigate(['hubs']);
    });
  }

  ngOnDestroy(): void {
    this.unsubscriber.next();
    this.unsubscriber.complete();
  }
}
