import { combineReducers, UnknownAction } from '@reduxjs/toolkit';
import { rootReducer } from './store';

const combinedReducer = combineReducers(rootReducer);

describe('rootReducer', () => {
  it('возвращает начальное состояние при неизвестном экшене', () => {
    const initialState = combinedReducer(undefined, {
      type: '@@INIT'
    } as UnknownAction);
    const nextState = combinedReducer(undefined, {
      type: 'UNKNOWN_ACTION'
    } as UnknownAction);

    expect(nextState).toEqual(initialState);
  });
});
