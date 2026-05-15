import { ingredientsReducer, fetchIngredients } from './ingredientsSlice';
import { TIngredient } from '@utils-types';

const sampleItems: TIngredient[] = [
  {
    _id: '1',
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
  }
];

describe('ingredientsSlice reducer', () => {
  it('выставляет isLoading в true при pending', () => {
    const state = ingredientsReducer(
      undefined,
      fetchIngredients.pending('', undefined)
    );

    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('сохраняет ингредиенты и сбрасывает isLoading при fulfilled', () => {
    const state = ingredientsReducer(
      undefined,
      fetchIngredients.fulfilled(sampleItems, '', undefined)
    );

    expect(state.isLoading).toBe(false);
    expect(state.items).toEqual(sampleItems);
  });

  it('записывает ошибку и сбрасывает isLoading при rejected', () => {
    const state = ingredientsReducer(
      undefined,
      fetchIngredients.rejected(new Error('Сервер недоступен'), '', undefined)
    );

    expect(state.isLoading).toBe(false);
    expect(state.error).toBe('Сервер недоступен');
  });
});
