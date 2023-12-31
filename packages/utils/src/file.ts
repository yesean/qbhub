export function getCSVURL(rows: unknown[][]) {
  const csvString = rows.map((row) => row.join(',')).join('\n');
  const blob = new Blob([csvString], { type: 'text/csv' });
  return URL.createObjectURL(blob);
}

export function getJSONURL(json: object) {
  const jsonString = JSON.stringify(json, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  return URL.createObjectURL(blob);
}
