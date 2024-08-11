import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {CONFIRM_DIALOG_MODE} from "../../../shared/constants/dialog-constants";
import {DELETE_FORM_MODE, HUB_FORM_TITLE} from "../../../shared/constants/form-constants";
import {takeUntil} from "rxjs/operators";
import {AirportService} from "../../../shared/services/airport.service";
import {NotificationService} from "../../../shared/services/notification.service";
import {Subject} from "rxjs";

@Component({
  selector: 'app-page-about',
  templateUrl: './page-delete-hub.component.html',
  styleUrls: []
})
export class PageDeleteHubComponent implements OnInit, OnDestroy {

  public unsubscriber: Subject<void> = new Subject<void>();

  @Input() public hubId !: number;

  public deleteHubDialogTitle = `${DELETE_FORM_MODE} ${HUB_FORM_TITLE}`;
  public deleteHubDialogMode = CONFIRM_DIALOG_MODE;

  constructor(private dialog: MatDialog, private airportService: AirportService, private notificationService: NotificationService) {
  }

  ngOnInit(): void {
    // This class will never be initialized
  }

  deleteHub(response: boolean) {
    if (response) {
      this.airportService.deleteAirport(this.hubId).pipe(takeUntil(this.unsubscriber)).subscribe(() => {
        this.notificationService.showSuccess(`${DELETE_FORM_MODE} ${HUB_FORM_TITLE}`, 'Votre hub a bien été supprimé !');
      });
    }
  }

  ngOnDestroy(): void {
    this.unsubscriber.next();
    this.unsubscriber.complete();
  }
}
