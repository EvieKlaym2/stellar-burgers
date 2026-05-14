import { FC, useEffect } from 'react';
import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { useDispatch, useSelector } from '../../services/store';
import { fetchFeeds, setFeedFromSocket } from '../../services/slices/feedSlice';
import { getFeedOrdersWsUrl } from '../../utils/orders-ws-url';
import { TOrdersData } from '@utils-types';

export const Feed: FC = () => {
  const dispatch = useDispatch();
  const { orders, isLoading } = useSelector((state) => state.feed);

  useEffect(() => {
    if (!orders.length) {
      dispatch(fetchFeeds());
    }
  }, [dispatch, orders.length]);

  useEffect(() => {
    let socket: WebSocket;
    try {
      socket = new WebSocket(getFeedOrdersWsUrl());
    } catch {
      return undefined;
    }
    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data as string) as TOrdersData & {
          success?: boolean;
        };
        if (!Array.isArray(data.orders)) {
          return;
        }
        dispatch(
          setFeedFromSocket({
            orders: data.orders,
            total: data.total ?? 0,
            totalToday: data.totalToday ?? 0
          })
        );
      } catch {
        // ignore malformed payloads
      }
    };
    return () => {
      socket.close();
    };
  }, [dispatch]);

  if (isLoading && !orders.length) {
    return <Preloader />;
  }

  if (!orders.length) {
    return <Preloader />;
  }

  return (
    <FeedUI orders={orders} handleGetFeeds={() => dispatch(fetchFeeds())} />
  );
};
