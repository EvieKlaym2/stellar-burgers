import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { orderBurgerApi, getOrderByNumberApi } from '@api';
import { TOrder } from '@utils-types';

export const createOrder = createAsyncThunk('order/create', orderBurgerApi);

export const fetchOrderByNumber = createAsyncThunk(
  'order/fetchByNumber',
  async (number: number) => {
    const response = await getOrderByNumberApi(number);
    const order = response.orders?.[0];
    if (!order) {
      return Promise.reject(new Error('Заказ не найден'));
    }
    return order;
  }
);

interface OrderState {
  currentOrder: TOrder | null;
  orderModalData: TOrder | null;
  orderRequest: boolean;
  isLoading: boolean;
  error: string | null;
}

export const initialState: OrderState = {
  currentOrder: null,
  orderModalData: null,
  orderRequest: false,
  isLoading: false,
  error: null
};

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    closeOrderModal: (state) => {
      state.orderModalData = null;
      state.orderRequest = false;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.orderRequest = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.orderModalData = {
          ...action.payload.order,
          ingredients: action.meta.arg
        };
        state.currentOrder = state.orderModalData;
        state.orderRequest = false;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.orderRequest = false;
        state.error = action.error.message || 'Ошибка оформления заказа';
      })
      .addCase(fetchOrderByNumber.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchOrderByNumber.fulfilled, (state, action) => {
        state.currentOrder = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchOrderByNumber.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Ошибка загрузки заказа';
      });
  }
});

export const { closeOrderModal } = orderSlice.actions;
export const orderReducer = orderSlice.reducer;
