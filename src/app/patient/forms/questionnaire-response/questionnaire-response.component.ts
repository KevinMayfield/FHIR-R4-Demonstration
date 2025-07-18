import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {Coding, QuestionnaireResponse} from 'fhir/r4';
import {ResourceDialogComponent} from '../../../dialogs/resource-dialog/resource-dialog.component';
import {FhirService} from '../../../services/fhir.service';
import {MatSort} from '@angular/material/sort';
import {Router} from "@angular/router";
import {DeleteComponent} from "../../../dialogs/delete/delete.component";
import {MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatDialogRef} from "@angular/material/dialog";
import {ConceptDialogComponent} from "../../../dialogs/concept-dialog/concept-dialog.component";
import {MatTableDataSource} from "@angular/material/table";
@Component({
  selector: 'app-questionnaire-response',
  templateUrl: './questionnaire-response.component.html',
  styleUrls: ['./questionnaire-response.component.css']
})
export class QuestionnaireResponseComponent implements OnInit {

    @Input() forms: QuestionnaireResponse[] | undefined;

    @Input() showDetail = false;

    @Input() patientId: string | undefined;

    @Output() form = new EventEmitter<any>();

    @Input() useBundle = false;

  // @ts-ignore
    dataSource: MatTableDataSource<QuestionnaireResponse>;
  @ViewChild(MatSort) sort: MatSort | undefined;

    displayedColumns = ['authored', 'questionnaire', 'status',  'source', 'author', 'resource'];

    constructor(
                public dialog: MatDialog,
                public fhirService: FhirService,
                private router: Router,
    ) { }

    ngOnInit(): void {

        if (this.patientId !== undefined) {
          //  this.dataSource = new QuestionnaireResponseDataSource(this.fhirService, this.patientId, []);
        } else {
          this.dataSource = new MatTableDataSource<QuestionnaireResponse>(this.forms);
        }

    }
  ngAfterViewInit(): void {
    if (this.sort !== undefined) {
      this.sort.sortChange.subscribe((event) => {
        console.log(event);
      });
      // @ts-ignore
        this.dataSource.sort = this.sort;
    } else {
      console.log('SORT UNDEFINED');
    }
      // @ts-ignore
      this.dataSource.sortingDataAccessor = (item, property) => {
          switch (property) {
              case 'authored': {
                  if (item.authored !== undefined) {

                      return item.authored
                  }
                  return undefined;
              }
              default: {
                  return undefined
              }
          };
      };
  }




    select(resource: any): void {
        const dialogConfig = new MatDialogConfig();

        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.data = {
            id: 1,
            resource
        };
        const resourceDialog: MatDialogRef<ResourceDialogComponent> = this.dialog.open( ResourceDialogComponent, dialogConfig);
    }

    viewForm(form : QuestionnaireResponse): void {
        this.router.navigate(['/patient', form.subject?.reference?.replace('Patient/',''), 'forms', form.id])
    }


  getName(url: string ): string {
      var questionnaire = this.fhirService.getQuestionnaire(url);

      if (questionnaire !== undefined) {
          if (questionnaire.title) return questionnaire.title
      }
      return 'Not found';
  }
    getCode(url: string ): Coding | undefined {
        var questionnaire = this.fhirService.getQuestionnaire(url);

        if (questionnaire !== undefined) {
            if (questionnaire.code && questionnaire.code.length >0) return questionnaire.code[0]
        }
        return undefined;
    }
    getCodeDisplay(url: string ): String | undefined {
        var questionnaire = this.fhirService.getQuestionnaire(url);

        if (questionnaire !== undefined) {
            if (questionnaire.code && questionnaire.code.length >0) {
                if (questionnaire.code[0].display !== undefined) return questionnaire.code[0].display

                return questionnaire.code[0].code
            }
        }
        return undefined;
    }
    delete(questionnaireResponse: QuestionnaireResponse) {
        let dialogRef = this.dialog.open(DeleteComponent, {
            width: '250px',
            data:  questionnaireResponse
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {

                this.fhirService.deleteTIE('/QuestionnaireResponse/'+questionnaireResponse.id).subscribe(result => {
                    if (this.forms !== undefined) {
                        this.forms.forEach((taskIt, index) => {
                            if (taskIt.id === questionnaireResponse.id) {
                                // @ts-ignore
                                this.forms.splice(index, 1);
                            }
                        })
                        this.dataSource = new MatTableDataSource<QuestionnaireResponse>(this.forms);
                    }
                })
            }
        });
    }
    selectConcept(url: string) {
        var concept = this.getCode(url)
        if (concept !== undefined && concept.system === 'http://snomed.info/sct') {
            const dialogConfig = new MatDialogConfig();

            dialogConfig.disableClose = true;
            dialogConfig.autoFocus = true;
            dialogConfig.data = {
                concept
            };
            const resourceDialog: MatDialogRef<ConceptDialogComponent> = this.dialog.open(ConceptDialogComponent, dialogConfig);
        }
    }
}
