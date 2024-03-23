export type PieChartKey = string | number;

export type PieChartEntry<T extends PieChartKey> = {
  type: T;
  label: string;
  value: number;
};
