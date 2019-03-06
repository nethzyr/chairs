import { Action } from '@ngrx/store';
import { Category, Chair } from './reducer';

export enum ActionTypes {
  ADD_ALL_CHAIRS = '[] add all chairs',
  LOAD_ALL_CHAIRS = '[] load all chairs',
  ADD_ALL_CATEGORIES = '[] add all categories',
  LOAD_ALL_CATEGORIES = '[] load all categories',
}

export class AddAllChairs implements Action {
  readonly type = ActionTypes.ADD_ALL_CHAIRS;

  constructor(public payload: Chair[]) {}
}

export class LoadAllChairs implements Action {
  readonly type = ActionTypes.LOAD_ALL_CHAIRS;
}

export class AddAllCategories implements Action {
  readonly type = ActionTypes.ADD_ALL_CATEGORIES;

  constructor(public payload: Category[]) {}
}

export class LoadAllCategories implements Action {
  readonly type = ActionTypes.LOAD_ALL_CATEGORIES;
}

export type ActionsUnion =
  | AddAllChairs
  | LoadAllChairs
  | AddAllCategories
  | LoadAllCategories;
