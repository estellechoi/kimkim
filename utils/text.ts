export const shortenText = (string: string, over: number): string =>
  string.length > over ? `${string.slice(0, over - 3)}・・・${string.slice(-3)}` : string;

export const shortenAddress = (address: string, charsStart = 4, charsEnd?: number): string => {
  return `${address.substring(0, charsStart + 2)}...${address.substring(address.length - (charsEnd || charsStart))}`;
};

export const decodeBase64 = (msg: string) => {
  try {
    return JSON.parse(atob(msg));
  } catch (err) {
    return null;
  }
};

export const safeJsonParse = (msg: string) => {
  try {
    return JSON.parse(msg);
  } catch (err) {
    return null;
  }
};
