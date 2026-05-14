import { FC, useEffect } from 'react';
import { ProfileOrdersUI } from '@ui-pages';
import { useDispatch, useSelector } from '../../services/store';
import {
  fetchUserOrders,
  setUserOrdersFromSocket
} from '../../services/slices/userOrdersSlice';
import { Preloader } from '../../components/ui';
import { getCookie } from '../../utils/cookie';
import { getUserOrdersWsUrl } from '../../utils/orders-ws-url';
import { TOrder } from '@utils-types';

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();
  const { orders, isLoading } = useSelector((state) => state.userOrders);
  const user = useSelector((state) => state.user.user);

  useEffect(() => {
    dispatch(fetchUserOrders());
  }, [dispatch]);

  useEffect(() => {
    const token = getCookie('accessToken');
    if (!token || !user) {
      return undefined;
    }

    let socket: WebSocket;
    try {
      socket = new WebSocket(getUserOrdersWsUrl(token));
    } catch {
      return undefined;
    }
    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data as string) as {
          orders?: TOrder[];
          success?: boolean;
        };
        if (!Array.isArray(data.orders)) {
          return;
        }
        dispatch(setUserOrdersFromSocket(data.orders));
      } catch {
        // ignore malformed payloads
      }
    };
    return () => {
      socket.close();
    };
  }, [dispatch, user]);

  if (isLoading && !orders.length) {
    return <Preloader />;
  }

  return <ProfileOrdersUI orders={orders} />;
};
