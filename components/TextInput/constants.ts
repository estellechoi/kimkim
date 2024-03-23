import { TextInputType } from './types';

export const PATTERN_DICT: Record<TextInputType, string | undefined> = {
  text: undefined,
  email: '[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$',
  search: undefined,
  number: '^\d+(\.\d+)?$',
};
