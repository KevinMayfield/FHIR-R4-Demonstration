import { Component, OnInit } from '@angular/core';
import {TestingService} from '../services/testing.service';
import {ActivatedRoute, Router} from '@angular/router';
import {IMenuItem, IMenuTrigger, ITdDynamicMenuLinkClickEvent} from "@covalent/core/dynamic-menu";
import {EprService} from "../services/epr.service";
import {FhirService} from "../services/fhir.service";
import {environment} from "../../environments/environment";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
  selected = 'https://raw.githubusercontent.com/NHSDigital/IOPS-FHIR-Testing/main/oas/fhirrest.json';
  public patientId : string | undefined;
  triggerPatient: IMenuTrigger = {
    id: 'triggerPatient',
    icon: 'account_circle',
    text: 'Patient',
  };

  private themeWrapper = document.querySelector('body');

  triggerApps: IMenuTrigger = {
    id: 'triggerApps',
    icon: 'apps',
    text: 'Apps',
  };

  triggerSmartApps: IMenuTrigger = {
    id: 'triggerSmartApps',
    icon: 'apps',
    text: 'SMART Apps (Mock)',
  };


  triggerCare: IMenuTrigger = {
    id: 'triggerbutton',
    icon: 'list',
    text: 'Care Records',
  };

  triggerAccount: IMenuTrigger = {
    id: 'triggerutility',
    icon: 'manage_accounts',
    text: 'Account',
  };

  itemsAccount: IMenuItem[] = [
    {
      // Grouping label
      id: 'acc_menu',
      text: 'Simulated Role',
    },
    {
      // Submenu trigger
      id: 'roles',
      text: 'Role Picker',
      icon: 'perm_identity',
      action: 'roles',
      newTab: false,
    },
      {
      // Grouping label
      id: 'devices',
      text: 'Personal Health Device',
    },
    {
      // Submenu trigger
      id: 'phrapps',
      text: 'Connected PHR Applications',
      icon: 'app_shortcut',
      action: 'device',
      newTab: false,
    }
    ];

  itemsPatient: IMenuItem[] = [
    {
      // Grouping label
      id: 'platform',
      text: 'Patient',
    },
    {
      // Submenu trigger
      id: 'patientfind',
      text: 'Patient Find',
      icon: 'find_in_page',
      action: 'search'
    }
    ];

  itemsSmartApps: IMenuItem[] = [
    {
      // Grouping label
      id: 'bmi',
      text: 'BMI Smart On FHIR Demo',
      action: 'bmi',
    },
    {
      // Grouping label
      id: 'sdc-viewer',
      text: 'SDC Questionnaire App (US NLM)',
      action: 'sdc-viewer',
    },
    {
      // Grouping label
      id: 'smart-forms',
      text: 'Smart Forms',
      action: 'smart-forms'
    }

      ];

  itemsApps: IMenuItem[] = [
    {
      // Grouping label
      id: 'platform',
      text: 'Structure Data Capture',
    },
    {
      id: 'quickstartlink',
      text: 'Form Definitions',
      action: 'formdefinition'
    },
    {
      id: 'quickstartlink',
      text: 'NLM Form Builder',
      action: 'formbuilder'
    },
    {
      // Grouping label
      id: 'ontology',
      text: 'Clinical Coding',
    },
    {
      id: 'ontoBrowser',
      text: 'SNOMED and dm+d',
      icon: 'view_cozy',
      action: 'ontology'
    },
    {
      // Grouping label
      id: 'management',
      text: 'Care Management',
    },
    {
      id: 'activityDefinition',
      text: 'Pathways',
      icon: 'view_cozy',
      action: 'pathways'
    },
  ];
  itemsCare: IMenuItem[] = [
    {
      // Grouping label
      id: 'patientcare',
      text: 'Patient Care Records',
    },
    {
      id: 'summary',
      text: 'Summary Record',
      icon: 'view_cozy',
      action: 'summary'
    },
    {
      id: 'docs',
      text: 'Document',
      icon: 'view_timeline',
      action: 'documents'
    },
    {
      // Grouping label
      id: 'patientobservations',
      text: 'Observations',
    },
    {
      id: 'obs',
      text: 'Diagnostic Reports and Observations',
      icon: 'view_kanban',
      action: 'observations',
    },
    {
      // Grouping label
      id: 'coordination',
      text: 'Patient Care Coordination',
    },
    {
      id: 'workflow',
      text: 'Referrals, Tasks and Interventions',
      icon: 'assignment',
      action: 'workflow'
    }
  ];

  /*
  removed for demo
,
    {
      id: 'vitals',
      text: 'Vital Signs',
      icon: 'local_hospital',
      action: 'vitals',
    },
  ,{
      id: 'forms',
      text: 'Forms',
      icon: 'dataset',
      action: 'forms'
    },
    {
      id: 'coordination',
      text: 'Plans and Goals',
      icon: 'map',
      action: 'coordination'
    },
    {
      id: 'communication',
      text: 'Communication',
      icon: 'question_answer',
      action: 'communication'
    },

   {
      id: 'physical',
      text: 'Physical Activity',
      icon: 'directions_walk',
      action: 'physical',
    },
   */

  constructor( private testingService: TestingService,
               private route: ActivatedRoute,
               private epr: EprService,
               private fhirService: FhirService,
               private router: Router,private _snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.epr.patientChangeEvent.subscribe(patient => {
      if (patient!==undefined) {
        this.patientId = patient.id;
        console.log('Patient record active')
      } else {
        this.patientId = undefined;
      }
    })
    this.fhirService.getTIE('/Questionnaire?_count=50').subscribe(bundle => {
      this.fhirService.setQuestionnaires(bundle);
    })
  }
  goToLink(url: string): void {
    window.open(url, '_blank');
  }

  reportClick(event: ITdDynamicMenuLinkClickEvent): void {

    //console.log(event)
    if (event.action !== undefined) {
    switch (event.action) {
      case 'pathways': {
        this.router.navigateByUrl('/pathways');
        break;
      }
      case 'ontology': {
        this.router.navigateByUrl('/ontology');
        break;
      }
      case 'formbuilder': {
        this.router.navigateByUrl('/formbuilder');
        break;
      }
      case 'formdefinition': {
        this.router.navigateByUrl('/form');
        break;
      }
    }
    if (this.patientId !== undefined) {
      switch (event.action) {
        case 'sdc-viewer': {
          window.open('https://lhcforms.nlm.nih.gov/lforms-fhir-app/?server=' + environment.tieServer, '_blank');
          break;
        }
        case 'smart-forms': {
          window.open('https://www.smartforms.io/', '_blank');
          //window.open('https://launch.smarthealthit.org/?iss=' + environment.tieServer + '&launch_url=https://www.smartforms.io/launch/' + '&patient='+this.patientId, '_blank');
          break;
        }
        case 'bmi': {
          window.open('https://nhsdigital.github.io/IOPS-SMART-Demo-BMI/?iss=' + environment.tieServer + '&patient='+this.patientId, '_blank');
          break;
        }
        case 'observations': {
          this.router.navigateByUrl('/patient/'+this.patientId+'/observations');
          break;
        }
        case 'summary': {
          this.router.navigateByUrl('/patient/'+this.patientId+'/summary');
          break;
        }
        case 'documents': {
          this.router.navigateByUrl('/patient/'+this.patientId+'/documents');
          break;
        }
        case 'forms': {
          this.router.navigateByUrl('/patient/'+this.patientId+'/forms');
          break;
        }
        case 'workflow': {
          this.router.navigateByUrl('/patient/'+this.patientId+'/workflow');
          break;
        }
        case 'communication': {
          this.router.navigateByUrl('/patient/'+this.patientId+'/communication');
          break;
        }
        case 'coordination': {
          this.router.navigateByUrl('/patient/'+this.patientId+'/coordination');
          break;
        }
        case 'physical': {
          this.router.navigateByUrl('/patient/'+this.patientId+'/physical');
          break;
        }
        case 'vitals': {
          this.router.navigateByUrl('/patient/'+this.patientId+'/vitals');
          break;
        }
        case 'device': {
          this.router.navigateByUrl('/device');
          break;
        }
        case 'roles': {
          // @ts-ignore
          this.themeWrapper.style.setProperty('$primary', define-palette(mat.$red-palette, 700));
          break;
        }
      }
    }
    // These don't require an active patient
    switch (event.action) {
        case 'search': {
          this.router.navigateByUrl('/search');
          break;
        }
      }
    }

   /* this._snackBar.open(
        `Item "${event.text}:${event.action}" clicked`,
        undefined,
        { duration: 2000 }
    );

    */
  }

/*
    runTestPackage() {
      this.router.navigateByUrl('/runtest');
    }

 */
}
