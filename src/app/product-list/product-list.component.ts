import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { select, Store } from '@ngrx/store';
import * as lunr from 'lunr';
import { combineLatest, Observable, of } from 'rxjs';
import { tap } from 'rxjs/internal/operators/tap';
import { debounceTime, filter, startWith, switchMap } from 'rxjs/operators';
import {
  AppState,
  selectVisibleProducts,
  selectVisibleProductsByIds,
} from '../store/reducer';
import { Product } from './product.model';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
})
export class ProductListComponent {
  products$: Observable<Product[]>;
  myForm: FormGroup;
  idx: any;

  constructor(private store: Store<AppState>, private fb: FormBuilder) {
    this.myForm = fb.group({
      search: ['', Validators.pattern('[0-9a-zA-Z_]*')],
    });

    this.products$ = combineLatest(
      store.pipe(
        select(selectVisibleProducts),
        tap(products => this.indexLunr(products)),
      ),
      this.myForm.valueChanges.pipe(
        startWith(this.myForm.getRawValue()),
        filter(() => !this.myForm.invalid),
        debounceTime(400),
      ),
    ).pipe(
      switchMap(([products, formValue]) =>
        formValue
          ? store.pipe(
              select(
                selectVisibleProductsByIds(this.idx.search(formValue.search)),
              ),
            )
          : of(products),
      ),
    );
  }

  private indexLunr(products: Product[]): void {
    this.idx = lunr(function() {
      this.field('title');
      this.field('category');
      this.field('description');

      products.forEach(function(product) {
        this.add(product);
      }, this);
    });
  }
}
