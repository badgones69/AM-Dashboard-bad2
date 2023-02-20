import {Component, OnDestroy, OnInit} from '@angular/core';
import {RouteService} from "../../../shared/services/route.service";
import {AirportService} from "../../../shared/services/airport.service";
import {Airport} from "../../../shared/models/airport";
import {HUB_LIST_TITLE} from "../../../shared/constants/list-constants";
import {Route} from "../../../shared/models/route";
import {displayCity, displayCountryFlag, displayCountryName} from "../../../shared/utils/common-utils";
import {Observable, Subject} from "rxjs";
import {takeUntil} from "rxjs/operators";
import {Router} from "@angular/router";
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {PageDeleteHubComponent} from "../page-delete-hub/page-delete-hub.component";

@Component({
  selector: 'app-page-list-hub',
  templateUrl: './page-list-hub.component.html',
  styleUrls: ['../../../shared/styles/lists.scss']
})
export class PageListHubComponent implements OnInit, OnDestroy {

  public unsubscriber: Subject<void> = new Subject<void>();

  // List title
  public hubListTitle: string = HUB_LIST_TITLE;
  // List headers
  public hubListHeaders = ['IATA', 'Nom de l\'aéroport', 'Ville(s)', 'Pays', 'Lignes', 'Actions'];
  // List data
  public hubs: Airport[] = [];

  private routes$!: Observable<Route[]>;

  public currentPageMinIndex!: number;
  public currentPageMaxIndex!: number;
  public currentPage!: number;
  public totalPages: number = 1;

  constructor(private airportService: AirportService, private routeService: RouteService, private router: Router, public dialog: MatDialog) {
    this.routes$ = this.routeService.routesCollection;
  }

  ngOnInit(): void {
    this.airportService.getHubs().pipe(takeUntil(this.unsubscriber)).subscribe(hubs => {
      this.hubs = hubs;
      this.goToFirstPage();

      if (hubs.length > 1) {
        this.totalPages = Math.trunc(this.hubs.length / 10);

        if (this.hubs.length % 10 > 0) {
          this.totalPages++;
        }
      }
    });
  }

  // Formatted city display
  displayCity(hub: Airport): string {
    return displayCity(hub.city, hub.regionId);
  }

  // Country flag display
  displayCountryFlag(hub: Airport): string {
    return displayCountryFlag(hub.countryId);
  }

  // Country name display
  displayCountryName(hub: Airport): string {
    return displayCountryName(hub.countryId);
  }

  // Routes count display
  displayRoutesCount(hub: Airport): number {
    this.routes$.pipe(takeUntil(this.unsubscriber)).subscribe(routes => {
      return routes.filter(r => r.departureHub.id === hub.id).length;
    });
    return 0;
  }

  openHubForm(hub: Airport) {
    this.router.navigate(['hubs', 'edit', hub.id])
  }

  deleteHub(hub: Airport) {
    let dialogRef: MatDialogRef<PageDeleteHubComponent> = this.dialog.open(PageDeleteHubComponent, {
      disableClose: true,
      autoFocus: false
    });
    dialogRef.componentInstance.hubId = hub.id;
    dialogRef.afterClosed().pipe(takeUntil(this.unsubscriber)).subscribe(() => this.ngOnInit());
  }

  /* Pagination navigation */
  goToFirstPage(): void {
    this.currentPageMinIndex = 1;
    this.currentPageMaxIndex = 10 > this.hubs.length ? this.hubs.length : 10;
    this.currentPage = 1;
  }

  rewindFivePages(): void {
    this.currentPage -= 5;
    this.currentPageMinIndex = ((this.currentPage - 1) * 10) + 1;
    this.currentPageMaxIndex = this.currentPage * 10;
  }

  rewindOnePage(): void {
    this.currentPage--;
    this.currentPageMinIndex = ((this.currentPage - 1) * 10) + 1;
    this.currentPageMaxIndex = this.currentPage * 10;
  }

  forwardOnePage(): void {
    this.currentPage++;
    this.currentPageMinIndex = ((this.currentPage - 1) * 10) + 1;
    this.currentPageMaxIndex = this.currentPage === this.totalPages ? this.hubs.length : this.currentPage * 10;
  }

  forwardFivePages(): void {
    this.currentPage += 5;
    this.currentPageMinIndex = ((this.currentPage - 1) * 10) + 1;
    this.currentPageMaxIndex = this.currentPage === this.totalPages ? this.hubs.length : this.currentPage * 10;
  }

  goToLastPage(): void {
    this.currentPage = this.totalPages;
    this.currentPageMinIndex = ((this.currentPage - 1) * 10) + 1;
    this.currentPageMaxIndex = this.hubs.length;
  }

  ngOnDestroy(): void {
    this.unsubscriber.next();
    this.unsubscriber.complete();
  }
}
