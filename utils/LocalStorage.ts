export const LOCAL_STORAGE_KEYS = {
  watchlistSymbols: 'watchlist_symbols',
};

class LocalStorage {
  private setStorage(key: string, value: string | null) {
    value ? localStorage.setItem(key, value) : localStorage.removeItem(key);
  }

  private getStorage(key: string): string | null {
    return localStorage.getItem(key) ?? null;
  }

  /**
   *
   * @description public methods to set and get values from local storage
   */
  public setWatchListSymbols(value: Set<string> | null) {
    this.setStorage(LOCAL_STORAGE_KEYS.watchlistSymbols, value ? Array.from(value).join('/') : null);
  }

  public getWatchListSymbols(): Set<string> {
    const value = this.getStorage(LOCAL_STORAGE_KEYS.watchlistSymbols);
    const storedSymbols = value?.split('/') ?? [];
    return new Set(storedSymbols);
  }
}

export default new LocalStorage();
