import useWebSocket from 'react-use-websocket';
import {
  BinanceTickerWebSocketData,
  BithumbTransactionWebSocketData,
  HtxTickerWebSocketData,
  UpbitTickerWebSocketData,
  isBithumbTransactionWebSocketData,
} from '@/data/hooks/types';
import queryClient from '@/data/queryClient';
import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { inflate } from 'pako';

export const useWebSocketUpbitPrice = (connect: boolean, symbols: readonly string[]) => {
  const mappedSymbols = symbols.map((symbol) => `KRW-${symbol}`);
  const queryKey = ['useWebSocketUpbitPrice', mappedSymbols.join(',')];

  const requestMessage = [
    { ticket: 'upbit_price' },
    {
      type: 'ticker',
      codes: mappedSymbols,
    },
  ];

  const { lastMessage, readyState, sendJsonMessage } = useWebSocket<UpbitTickerWebSocketData>(
    'wss://api.upbit.com/websocket/v1',
    {
      heartbeat: {
        message: 'PING',
        interval: 110000, // ping in every 120s
      },
      shouldReconnect: () => true,
      onOpen: () => sendJsonMessage(requestMessage),
      onError: (event) => {
        queryClient.setQueryData(queryKey, new Error(event.eventPhase.toString()));
      },
    },
    connect,
  );

  useEffect(() => {
    if (readyState !== 1 || !lastMessage?.data) return;

    new Response(lastMessage.data as Blob).json().then((wsData) => {
      if (wsData.status === 'UP') return; // ignore ping pong message
      queryClient.setQueryData<UpbitTickerWebSocketData | undefined>(queryKey, wsData);
    });
  }, [lastMessage, readyState]);

  return useQuery<UpbitTickerWebSocketData | undefined>({
    queryKey,
    enabled: connect,
  });
};

export const useWebSocketBithumbPrice = (connect: boolean, symbols: readonly string[]) => {
  const mappedSymbols = symbols.map((symbol) => `${symbol}_KRW`);
  const queryKey = ['useWebSocketBithumbPrice', mappedSymbols.join(',')];

  const requestMessage = {
    type: 'transaction',
    symbols: mappedSymbols,
  };

  const { lastMessage, readyState, sendJsonMessage } = useWebSocket<BithumbTransactionWebSocketData>(
    'wss://pubwss.bithumb.com/pub/ws',
    {
      shouldReconnect: () => true,
      onOpen: () => sendJsonMessage(requestMessage),
      onError: (event) => {
        queryClient.setQueryData(queryKey, new Error(event.eventPhase.toString()));
      },
    },
    connect,
  );

  useEffect(() => {
    if (readyState !== 1 || !lastMessage?.data) return;

    const parsedData: BithumbTransactionWebSocketData | undefined =
      typeof lastMessage.data === 'string' ? JSON.parse(lastMessage.data) : undefined;

    if (isBithumbTransactionWebSocketData(parsedData)) {
      queryClient.setQueryData<BithumbTransactionWebSocketData | undefined>(queryKey, parsedData);
    }
  }, [lastMessage, readyState]);

  return useQuery<BithumbTransactionWebSocketData | undefined>({
    queryKey,
    enabled: connect,
  });
};

export const useWebSocketBinancePrice = (connect: boolean, symbols: readonly string[]) => {
  const streamsJoint = symbols
    .map((symbol) => `${symbol}USDT@ticker`)
    .join('/')
    .toLowerCase();
  const queryKey = ['useWebSocketBinancePrice', streamsJoint];

  const { lastMessage, readyState } = useWebSocket<any>(
    'wss://stream.binance.com:9443/stream',
    {
      queryParams: { streams: streamsJoint },
      shouldReconnect: () => true,
      onOpen: () => console.log('Binance WebSocket connected'),
      onError: (event) => {
        console.log('Htx WebSocket error', event);
      },
    },
    connect,
  );

  useEffect(() => {
    if (readyState !== 1 || !lastMessage?.data) return;

    const parsedData = JSON.parse(lastMessage.data as string) as BinanceTickerWebSocketData;

    queryClient.setQueryData<BinanceTickerWebSocketData | undefined>(queryKey, parsedData);
  }, [lastMessage, readyState]);

  return useQuery<BinanceTickerWebSocketData | undefined>({
    queryKey,
    enabled: connect,
  });
};

export const useWebSocketHtxPrice = (connect: boolean, symbols: readonly string[]) => {
  const subs = symbols.map((symbol) => `market.${symbol}USDT.ticker`.toLowerCase()); // 1m interval candle stick
  const queryKey = ['useWebSocketHtxPrice', subs.join('/')];

  const { lastMessage, readyState, sendJsonMessage } = useWebSocket<any>(
    'wss://api.huobi.pro/ws',
    {
      shouldReconnect: () => true,
      onOpen: () => {
        subs.forEach((sub) => {
          sendJsonMessage({ sub });
        });
      },
      onError: (event) => {
        console.log('Htx WebSocket error', event);
      },
    },
    connect,
  );

  useEffect(() => {
    if (readyState !== 1 || !lastMessage?.data) return;

    // gzip decompression
    (lastMessage.data as Blob).arrayBuffer().then((arrayBuffer) => {
      const decompressedData = inflate(new Uint8Array(arrayBuffer), { to: 'string' });
      const parsedData = JSON.parse(decompressedData);

      // ping pong to prevent disconnection
      parsedData?.ping && sendJsonMessage({ pong: parsedData.ping });

      // update data
      parsedData?.ch &&
        queryClient.setQueryData<HtxTickerWebSocketData | undefined>(queryKey, parsedData as HtxTickerWebSocketData);
    });
  }, [lastMessage, readyState]);

  return useQuery<HtxTickerWebSocketData | undefined>({
    queryKey,
    enabled: connect,
  });
};
