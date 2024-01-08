import { getSum } from '@qbhub/utils';
import { useMemo } from 'react';

type Proportion = {
  proportion: number;
};

export function makeProportion(proportion: number): Proportion {
  return { proportion };
}

export type TableColumn<T> = {
  cell: (item: T) => React.ReactNode;
  id: string;
  label: React.ReactNode;
  width: Proportion;
};

export type TableColumns<T> = TableColumn<T>[];

export type UseTableProps<T> = {
  columns: TableColumns<T>;
  data: T[];
};

export default function useTable<T>({ columns, data }: UseTableProps<T>) {
  const totalProportion = getSum(columns.map(({ width }) => width.proportion));

  const headers = useMemo(
    () =>
      columns.map(({ id, label, width }) => ({
        element: label,
        id,
        widthPercentage: (width.proportion / totalProportion) * 100,
      })),
    [columns, totalProportion],
  );

  const rows = useMemo(
    () =>
      data.map((datum) =>
        columns.map(({ cell, id, width }) => ({
          columnID: id,
          element: cell(datum),
          widthPercentage: (width.proportion / totalProportion) * 100,
        })),
      ),
    [columns, data, totalProportion],
  );

  return useMemo(
    () => ({
      headers,
      rows,
    }),
    [headers, rows],
  );
}
