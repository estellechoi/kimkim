export type SendTxResult<T> = {
    isSuccess: true;
    response: T;
} | {
    isSuccess: false;
    response: T | undefined;
}