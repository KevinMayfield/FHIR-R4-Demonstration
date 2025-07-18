import {Component, Input, OnInit} from "@angular/core";
import {Immunization, Resource} from "fhir/r4";
import {FhirService} from "../../../services/fhir.service";
import {ResourceDialogComponent} from "../../../dialogs/resource-dialog/resource-dialog.component";
import {MatDialog, MatDialogConfig, MatDialogRef} from "@angular/material/dialog";
import {MatTableDataSource} from "@angular/material/table";

@Component({
  selector: 'app-immunisation',
  templateUrl: './immunisation.component.html',
  styleUrls: ['./immunisation.component.css']
})
export class ImmunisationComponent implements OnInit {

  @Input()
  immunisations: Immunization[] | undefined;

  @Input()
  patientId: string | undefined;

  // @ts-ignore
    dataSource : MatTableDataSource<Immunization>;


  displayedColumns = ['date','code','indication','status', 'procedure', 'resource'];

  constructor(
              public dialog: MatDialog,
              public fhirService: FhirService,
              ) { }

  ngOnInit() {
    if (this.patientId !== undefined) {
    //  this.dataSource = new ImmunizationDataSource(this.fhirService, this.patientId, []);
    } else {
      this.dataSource = new MatTableDataSource<Immunization>(this.immunisations);
    }
  }

  select(resource: Resource) {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      id: 1,
      resource: resource
    };
    const resourceDialog: MatDialogRef<ResourceDialogComponent> = this.dialog.open( ResourceDialogComponent, dialogConfig);
  }



}
