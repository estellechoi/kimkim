import useWebSocket from "react-use-websocket";
import { BinanceKlineWebSocketData, HtxKlineWebSocketData, UpbitTickerWebSocketData } from "./types";
import queryClient from "../queryClient";
import { useEffect, useState } from "react";
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
    const streams = symbols.map(symbol => `market.${symbol}USDT.kline.1min`.toLowerCase()); // 1m interval candle stick
    const queryKey = ['useWebSocketHtxPrice', streams.join('/')];

    const { lastMessage, readyState, sendJsonMessage } = useWebSocket<any>('wss://api.huobi.pro/ws', { 
        shouldReconnect: () =>  true,
        onOpen: () => {
            console.log('Htx WebSocket connected');
            const messages = streams.map(stream => ({ sub: stream, id: stream }));
            sendJsonMessage(messages);
        },
        onError: (event) => {
            queryClient.setQueryData(queryKey, new Error(event.eventPhase.toString()));
        },
    }, connect);

    useEffect(() => {
        console.log('Htx WebSocket message:', lastMessage);

        if (readyState !== 1 || !lastMessage?.data) return;

        new Response(lastMessage.data as Blob).blob().then((decompressedWsData) => {
            console.log('decompressedWsData', decompressedWsData);

            new Response(decompressedWsData).json().then((wsData) => {
                console.log('wsData', wsData);
                
                // ping pong to prevent disconnection
                wsData?.ping && sendJsonMessage({ pong: wsData.ping });

                // update data
                queryClient.setQueryData<UpbitTickerWebSocketData | undefined>(queryKey, wsData);
            });
        });
    }, [lastMessage, readyState]);

    return useQuery<any | undefined>({
        queryKey,
        enabled: connect,
    });
};