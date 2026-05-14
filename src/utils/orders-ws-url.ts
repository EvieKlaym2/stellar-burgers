const getWsBase = (): string => {
  const apiUrl = process.env.BURGER_API_URL;
  if (!apiUrl) {
    throw new Error('BURGER_API_URL is not defined');
  }
  const url = new URL(apiUrl);
  const protocol = url.protocol === 'https:' ? 'wss:' : 'ws:';
  return `${protocol}//${url.host}`;
};

export const getFeedOrdersWsUrl = (): string => `${getWsBase()}/orders/all`;

export const getUserOrdersWsUrl = (accessToken: string): string => {
  const token = encodeURIComponent(accessToken);
  return `${getWsBase()}/orders?token=${token}`;
};
