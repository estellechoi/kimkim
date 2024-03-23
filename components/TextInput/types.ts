import type { HTMLInputTypeAttribute } from 'react';

export type TextInputType = Extract<HTMLInputTypeAttribute, 'text' | 'email' | 'search' | 'number'>;
