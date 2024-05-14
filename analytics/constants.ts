export enum EventCategory {
  PAGE_VIEW = 'View page',
  ERROR_BOUNDARY = 'Error boundary',
  CHANGE_BASE_EXCHANGE = 'Change base exchange',
  CHANGE_QUOTE_EXCHANGE = 'Change quote exchange',
  OPEN_OVERLAY = 'Open overlay',
  OPEN_POPOVER = 'Open popover',
  CLICK_EXTERNAL_LINK = 'Click external link',
  COPY_TEXT = 'Copy text',
  CLICK_BUTTON = 'Click button',
  SEARCH = 'Search',
  SORT_TABLE = 'Sort table',
}

export const isDevMode = process.env.NODE_ENV === 'development';
