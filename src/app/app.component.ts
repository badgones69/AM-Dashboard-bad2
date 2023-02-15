import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  public menuOpened: boolean = false;
  public airlineMenuExpanded: boolean = false;
  public hubMenuExpanded: boolean = false;
  public airplaneMenuExpanded: boolean = false;
  public routeMenuExpanded: boolean = false;
  public helpMenuExpanded: boolean = false;

  constructor() {
  }

  ngOnInit(): void {
    // This class will never be initialized
  }

  menuToogle(): void {
    this.menuOpened = !this.menuOpened;

    if (!this.menuOpened) {
      this.airlineMenuExpanded = false;
      this.hubMenuExpanded = false;
      this.airplaneMenuExpanded = false;
      this.routeMenuExpanded = false;
      this.helpMenuExpanded = false;
    }
  }

  airlineMenuToogle(): void {
    this.airlineMenuExpanded = !this.airlineMenuExpanded;
  }

  hubMenuToogle(): void {
    this.hubMenuExpanded = !this.hubMenuExpanded;
  }

  airplaneMenuToogle(): void {
    this.airplaneMenuExpanded = !this.airplaneMenuExpanded;
  }

  routeMenuToogle(): void {
    this.routeMenuExpanded = !this.routeMenuExpanded;
  }

  helpMenuToogle(): void {
    this.helpMenuExpanded = !this.helpMenuExpanded;
  }
}
