import {Component, OnInit} from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {APP_NAME} from "../../../shared/constants/app-constants";
import packageJson from "../../../../../../AM-Dashboard/package.json";
import {INFO_DIALOG_MODE} from "../../../shared/constants/dialog-constants";

@Component({
  selector: 'app-page-about',
  templateUrl: './page-about.component.html',
  styleUrls: ['./page-about.component.scss']
})
export class PageAboutComponent implements OnInit {

  public aboutDialogMode = INFO_DIALOG_MODE;
  public aboutDialogTitle = 'À propos';
  public appName: string = APP_NAME;
  public appVersion: string = packageJson.version;
  public appAuthor: string = packageJson.author;

  public properties: any[] = [];

  constructor(private dialog: MatDialog) {
    this.properties.push({name: 'Date de sortie', value: packageJson.releaseDate});
    this.properties.push({name: 'Licence', value: packageJson.license});
    this.properties.push({name: 'NodeJS', value: packageJson.nodeJS});
    this.properties.push({name: 'Angular', value: packageJson.devDependencies["@angular/cli"].replace('~', '')});
    this.properties.push({name: 'TypeScript', value: packageJson.devDependencies["typescript"].replace('~', '')});
    this.properties.push({name: 'Karma', value: packageJson.devDependencies["karma"].replace('~', '')});
    this.properties.push({name: 'Jasmine', value: packageJson.devDependencies["jasmine-core"].replace('~', '')});
    this.properties.push({name: 'RxJS', value: packageJson.dependencies["rxjs"].replace('~', '')});
    this.properties.push({name: 'NGx Toastr', value: packageJson.dependencies["ngx-toastr"].replace('^', '')});
    this.properties.push({name: 'Flag Icons', value: packageJson.dependencies["flag-icons"].replace('^', '')});
  }

  ngOnInit(): void {
    // This class will never be initialized
  }

}
