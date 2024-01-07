import { useMemo } from 'react';

export type TableColumn<T> = {
  cell: (item: T) => React.ReactNode;
  id: string;
  label: React.ReactNode;
};

export type TableColumns<T> = TableColumn<T>[];

export type UseTableProps<T> = {
  columns: TableColumns<T>;
  data: T[];
};

export default function useTable<T>({ columns, data }: UseTableProps<T>) {
  const headers = useMemo(
    () =>
      columns.map(({ id, label }) => ({
        element: label,
        id,
      })),
    [columns],
  );

  const rows = useMemo(
    () =>
      data.map((datum) =>
        columns.map(({ cell, id }) => ({
          columnID: id,
          element: cell(datum),
        })),
      ),
    [columns, data],
  );

  return useMemo(
    () => ({
      headers,
      rows,
    }),
    [headers, rows],
  );
}
