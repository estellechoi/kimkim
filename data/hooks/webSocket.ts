import useWebSocket from "react-use-websocket";
import { BinanceKlineWebSocketData, HtxKlineWebSocketData, UpbitTickerWebSocketData } from "@/data/hooks/types";
import queryClient from "@/data/queryClient";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { inflate } from 'pako';
import { uuid } from "uuidv4";

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

    const { lastMessage, readyState } = useWebSocket<any>('wss://stream.binance.com:9443/stream', { 
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

export const useWebSocketHtxPrice = (connect: boolean, symbols: readonly string[]) => {
    const subs = symbols.map(symbol => `market.${symbol}USDT.kline.1min`.toLowerCase()); // 1m interval candle stick
    const queryKey = ['useWebSocketHtxPrice', subs.join('/')];

    const { lastMessage, readyState, sendJsonMessage } = useWebSocket<any>('wss://api.huobi.pro/ws', { 
        shouldReconnect: () =>  true,
        onOpen: () => {
            console.log('Htx WebSocket connected');

            subs.forEach(sub => {
                const message = { sub, id: `${sub}.${uuid()}` };
                sendJsonMessage(message);
            });
        },
        onError: (event) => {
            queryClient.setQueryData(queryKey, new Error(event.eventPhase.toString()));
        },
    }, connect);

    useEffect(() => {
        if (readyState !== 1 || !lastMessage?.data) return;

        // gzip decompression
        (lastMessage.data as Blob).arrayBuffer().then((arrayBuffer) => {
            const decompressedData = inflate(new Uint8Array(arrayBuffer), { to: 'string' });

            const parsedData = JSON.parse(decompressedData);
                
            // ping pong to prevent disconnection
            parsedData?.ping && sendJsonMessage({ pong: parsedData.ping });

            // update data
            parsedData?.ch && queryClient.setQueryData<HtxKlineWebSocketData | undefined>(queryKey, parsedData as HtxKlineWebSocketData);
        });
    }, [lastMessage, readyState]);

    return useQuery<HtxKlineWebSocketData | undefined>({
        queryKey,
        enabled: connect,
    });
};