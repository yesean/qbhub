import { Client } from 'pg';

export const client = new Client({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  port: Number(process.env.PGPORT),
});
client.connect();

export class QueryBuilder {
  static start() {
    return new QueryBuilder('');
  }

  s: string;

  constructor(s: string) {
    this.s = s;
  }

  build() {
    this.s = this.s.trim();
    return this.s;
  }

  _append(cmd: string) {
    this.s = `${this.s}  ${cmd}`;
    return this;
  }

  select(columns: { column: string; alias: string }[]) {
    const colsCmd = columns.map((c) => `${c.column} as ${c.alias}`).join(',');
    return this._append(`select ${colsCmd}`);
  }

  from(table: string) {
    return this._append(`from ${table}`);
  }

  innerJoin(table: string, condition: string) {
    return this._append(`inner join ${table} on ${condition}`);
  }

  where(condition: string) {
    return this._append(`where ${condition}`);
  }

  groupBy(column: string) {
    return this._append(`group by ${column}`);
  }

  orderBy(values: { column: string; direction: 'asc' | 'desc' }[]) {
    const cmd = values.map((v) => `${v.column} ${v.direction}`).join(',');
    return this._append(`order by ${cmd}`);
  }

  random() {
    return this._append('order by random()');
  }

  limit(n: number | null) {
    return this._append(`limit ${n}`);
  }

  offset(n: number) {
    return this._append(`offset ${n}`);
  }
}
