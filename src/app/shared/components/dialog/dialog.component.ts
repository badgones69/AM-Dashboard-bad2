import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {CONFIRM_DIALOG_MODE} from "../../constants/dialog-constants";

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent implements OnInit {

  @Input() public dialogTitle!: string;
  @Input() public dialogMode!: string;
  @Output() public submitted = new EventEmitter();

  public isConfirmationDialog: boolean = false;

  constructor(private dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.isConfirmationDialog = this.dialogMode === CONFIRM_DIALOG_MODE;
  }

  closeDialog(): void {
    this.dialog.closeAll();
  }

  yes(): void {
    this.closeDialog();
    this.submitted.emit(true);
  }
}
