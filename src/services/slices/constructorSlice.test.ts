import {
  constructorReducer,
  addIngredient,
  removeIngredient,
  moveIngredient,
  setBun
} from './constructorSlice';
import { TIngredient, TConstructorIngredient } from '@utils-types';

const bunTemplate: TIngredient = {
  _id: 'bun-1',
  name: 'Булка',
  type: 'bun',
  proteins: 50,
  fat: 10,
  carbohydrates: 30,
  calories: 200,
  price: 1000,
  image: 'bun.png',
  image_mobile: 'bun-m.png',
  image_large: 'bun-l.png'
};

const fillingTemplate: TIngredient = {
  _id: 'main-1',
  name: 'Котлета',
  type: 'main',
  proteins: 100,
  fat: 50,
  carbohydrates: 10,
  calories: 500,
  price: 300,
  image: 'meat.png',
  image_mobile: 'meat-m.png',
  image_large: 'meat-l.png'
};

const emptyState = { bun: null, ingredients: [] };

describe('constructorSlice reducer', () => {
  it('добавляет булку через setBun', () => {
    const state = constructorReducer(emptyState, setBun(bunTemplate));

    expect(state.bun).toMatchObject({ ...bunTemplate, id: expect.any(String) });
    expect(state.ingredients).toHaveLength(0);
  });

  it('добавляет начинку через addIngredient', () => {
    const state = constructorReducer(
      emptyState,
      addIngredient(fillingTemplate)
    );

    expect(state.bun).toBeNull();
    expect(state.ingredients).toHaveLength(1);
    expect(state.ingredients[0]).toMatchObject({
      ...fillingTemplate,
      id: expect.any(String)
    });
  });

  it('удаляет начинку по id', () => {
    const item: TConstructorIngredient = { ...fillingTemplate, id: 'drop-me' };
    const withFilling = { bun: null, ingredients: [item] };

    const state = constructorReducer(withFilling, removeIngredient('drop-me'));

    expect(state.ingredients).toHaveLength(0);
  });

  it('меняет порядок начинок через moveIngredient', () => {
    const first: TConstructorIngredient = {
      ...fillingTemplate,
      _id: 'a',
      id: 'id-a'
    };
    const second: TConstructorIngredient = {
      ...fillingTemplate,
      _id: 'b',
      name: 'Соус',
      id: 'id-b'
    };
    const withTwo = { bun: null, ingredients: [first, second] };

    const state = constructorReducer(
      withTwo,
      moveIngredient({ fromIndex: 0, toIndex: 1 })
    );

    expect(state.ingredients[0].id).toBe('id-b');
    expect(state.ingredients[1].id).toBe('id-a');
  });
});
