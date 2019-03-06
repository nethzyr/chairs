import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { asyncScheduler, Observable } from 'rxjs';
import { of } from 'rxjs/internal/observable/of';
import { map, mergeMap } from 'rxjs/operators';
import {
  ActionTypes,
  AddAllCategories,
  AddAllChairs,
  LoadAllCategories,
  LoadAllChairs,
} from './actions';
import { Category, Chair } from './reducer';

@Injectable()
export class Effects {
  constructor(private actions$: Actions, private http: HttpClient) {}

  @Effect()
  init$: Observable<Action> = of(
    new LoadAllCategories(),
    new LoadAllChairs(),
    asyncScheduler,
  );

  @Effect()
  loadChairs$: Observable<Action> = this.actions$.pipe(
    ofType(ActionTypes.LOAD_ALL_CHAIRS),
    mergeMap(() =>
      this.http.get<{ error: any; data: Chair[] }>(
        Effects.getBaseUrl() + '/chairs.json',
      ),
    ),
    map(response => new AddAllChairs(response.data)),
  );

  @Effect()
  loadCategories$: Observable<Action> = this.actions$.pipe(
    ofType(ActionTypes.LOAD_ALL_CATEGORIES),
    mergeMap(() =>
      this.http.get<{ error: any; data: Category[] }>(
        Effects.getBaseUrl() + '/category.json',
      ),
    ),
    map(response => new AddAllCategories(response.data)),
  );

  private static getBaseUrl(): string {
    const lang = localStorage.getItem('lang');
    return lang ? './assets/data/' + lang : './assets/data/en';
  }
}
