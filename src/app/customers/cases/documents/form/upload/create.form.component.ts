import {Component, OnDestroy} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {UploadPageFormData} from './upload-page.form.component';
import {UploadPageAction} from '../../../store/documents/document.actions';
import {CasesStore} from '../../../store/index';
import {ActivatedRoute, Router} from '@angular/router';
import {Subscription} from 'rxjs/Subscription';
import {CaseSelection} from '../../../store/model/case-selection.model';
import * as fromCases from '../../../store';
import {CustomerDocument} from '../../../../../services/customer/domain/customer-document.model';

@Component({
  templateUrl: './create.form.component.html'
})
export class CreateDocumentPageComponent implements OnDestroy {

  private actionsSubscription: Subscription;

  private currentSelection$: Observable<CaseSelection>;

  private document$: Observable<CustomerDocument>;

  constructor(private router: Router, private route: ActivatedRoute, private casesStore: CasesStore) {
    this.currentSelection$ = casesStore.select(fromCases.getCaseSelection);
    this.document$ = casesStore.select(fromCases.getSelectedCaseDocument);
  }

  ngOnDestroy(): void {
    if (this.actionsSubscription) {
      this.actionsSubscription.unsubscribe();
    }
  }

  onSave(formData: UploadPageFormData): void {
    this.actionsSubscription = Observable.combineLatest(
      this.currentSelection$,
      this.document$,
      (selection, document) => ({
        selection,
        document
      })
    ).map(result => new UploadPageAction({
        customerId: result.selection.customerId,
        documentId: result.document.identifier,
        page: formData.file,
        pageNumber: formData.pageNumber,
        activatedRoute: this.route
      })
    ).subscribe(this.casesStore);
  }

  onCancel(): void {
    this.router.navigate(['../'], { relativeTo: this.route });
  }

}
