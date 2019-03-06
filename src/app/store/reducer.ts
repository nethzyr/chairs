import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { Product } from '../product-list/product.model';
import { ActionsUnion, ActionTypes } from './actions';

export interface Chair {
  id: number;
  title: string;
  category: number;
  description: string;
  visible: boolean;
}

export interface Category {
  id: number;
  name: string;
}

const chairsAdapter = createEntityAdapter({
  selectId: (entity: Chair) => entity.id,
  sortComparer: (a: Chair, b: Chair) => a.id - b.id,
});

const categoriesAdapter = createEntityAdapter({
  selectId: (entity: Category) => entity.id,
  sortComparer: (a: Category, b: Category) => a.id - b.id,
});

export interface AppState {
  chairs: EntityState<Chair>;
  categories: EntityState<Category>;
}

const initialState: AppState = {
  chairs: chairsAdapter.getInitialState(),
  categories: categoriesAdapter.getInitialState(),
};

export function reducer(state = initialState, action: ActionsUnion) {
  switch (action.type) {
    case ActionTypes.ADD_ALL_CHAIRS: {
      return {
        ...state,
        chairs: chairsAdapter.upsertMany(action.payload, state.chairs),
      };
    }
    case ActionTypes.ADD_ALL_CATEGORIES: {
      return {
        ...state,
        categories: categoriesAdapter.upsertMany(
          action.payload,
          state.categories,
        ),
      };
    }
    default: {
      return state;
    }
  }
}

const stateSelector = createFeatureSelector('appState');

const selectChairs = createSelector(
  stateSelector,
  (state: AppState) => state.chairs,
);

const selectChairsEntities = createSelector(
  selectChairs,
  chairsAdapter.getSelectors().selectEntities,
);

const selectAllChairs = createSelector(
  selectChairs,
  chairsAdapter.getSelectors().selectAll,
);

const selectCategories = createSelector(
  stateSelector,
  (state: AppState) => state.categories,
);

const selectCategoriesEntities = createSelector(
  selectCategories,
  categoriesAdapter.getSelectors().selectEntities,
);

export const selectVisibleProducts = createSelector(
  selectAllChairs,
  selectCategoriesEntities,
  (chairs, categoryEntities): Product[] =>
    chairs.map(chair => ({
      ...chair,
      category: categoryEntities[chair.category].name,
    })),
);

// results are in order by their search scores, so not changing their order is important
export const selectVisibleProductsByIds = results =>
  createSelector(
    selectChairsEntities,
    selectCategoriesEntities,
    (chairEntities, categoryEntities): Product[] =>
      results.map(result => ({
        ...result,
        ...chairEntities[result.ref],
        category: categoryEntities[chairEntities[result.ref].category].name,
      })),
  );
