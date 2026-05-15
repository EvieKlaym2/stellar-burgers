import { combineReducers, UnknownAction } from '@reduxjs/toolkit';
import { rootReducer } from './store';
import { initialState as ingredientsInitialState } from './slices/ingredientsSlice';
import { initialState as constructorInitialState } from './slices/constructorSlice';
import { initialState as userInitialState } from './slices/userSlice';
import { initialState as feedInitialState } from './slices/feedSlice';
import { initialState as userOrdersInitialState } from './slices/userOrdersSlice';
import { initialState as orderInitialState } from './slices/orderSlice';

const combinedReducer = combineReducers(rootReducer);

const expectedInitialRootState = {
  ingredients: ingredientsInitialState,
  burgerConstructor: constructorInitialState,
  user: userInitialState,
  feed: feedInitialState,
  userOrders: userOrdersInitialState,
  order: orderInitialState
};

describe('rootReducer', () => {
  it('возвращает начальное состояние при неизвестном экшене', () => {
    const nextState = combinedReducer(undefined, {
      type: 'UNKNOWN_ACTION'
    } as UnknownAction);

    expect(nextState).toEqual(expectedInitialRootState);
  });
});
