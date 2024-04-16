import useWebSocket from "react-use-websocket";
import { BinanceKlineWebSocketData, UpbitTickerWebSocketData } from "./types";
import queryClient from "../queryClient";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";

export const useWebSocketUpbitPrice = (connect: boolean, symbols: readonly string[]) => {
    const mappedSymbols = symbols.map(symbol => `KRW-${symbol}`);
    const queryKey = ['useWebSocketUpbitPrice', mappedSymbols.join(',')];

    const requestMessage = [
        { ticket: 'upbit_price' },
        {
            type: 'ticker',
            codes: mappedSymbols,
        },
    ];

    const { lastMessage, readyState, sendJsonMessage } = useWebSocket<UpbitTickerWebSocketData>('wss://api.upbit.com/websocket/v1', { 
        shouldReconnect: () =>  true,
        onOpen: () => sendJsonMessage(requestMessage),
        onError: (event) => {
            queryClient.setQueryData(queryKey, new Error(event.eventPhase.toString()));
        },
    }, connect);

    useEffect(() => {
        if (readyState !== 1 || !lastMessage?.data) return;

        new Response(lastMessage.data as Blob).json().then((wsData) => {
            queryClient.setQueryData<UpbitTickerWebSocketData | undefined>(queryKey, wsData);
        });
    }, [lastMessage, readyState]);

    return useQuery<UpbitTickerWebSocketData | undefined>({
        queryKey,
        enabled: connect,
    });
};

export const useWebSocketBinancePrice = (connect: boolean, symbols: readonly string[]) => {
    const streamsJoint = symbols.map(symbol => `${symbol}USDT@kline_1s`).join('/').toLowerCase(); // 1s interval candle stick
    const queryKey = ['useWebSocketBinancePrice', streamsJoint];

    const { lastMessage, readyState, sendJsonMessage } = useWebSocket<any>('wss://stream.binance.com:9443/stream', { 
        queryParams: { streams: streamsJoint },
        shouldReconnect: () =>  true,
        onOpen: () => console.log('Binance WebSocket connected'),
        onError: (event) => {
            queryClient.setQueryData(queryKey, new Error(event.eventPhase.toString()));
        },
    }, connect);

    useEffect(() => {
        if (readyState !== 1 || !lastMessage?.data) return;

        const { data } = JSON.parse(lastMessage.data as string) as BinanceKlineWebSocketData;

        queryClient.setQueryData<BinanceKlineWebSocketData['data'] | undefined>(queryKey, data);
    }, [lastMessage, readyState]);

    return useQuery<BinanceKlineWebSocketData['data'] | undefined>({
        queryKey,
        enabled: connect,
    });
};