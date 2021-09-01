import { Client } from 'pg';
import { Category, Difficulty, Subcategory } from './types';

const client = new Client({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  port: Number(process.env.PGPORT),
});
client.connect();

export const queryTossups = async (
  categories: Category[],
  subcategories: Subcategory[],
  difficulties: Difficulty[],
  limit: number,
) => {
  const categoriesQueryString =
    categories.length > 0
      ? `tossups.category_id in (${categories.join(', ')})`
      : false;
  const subcategoriesQueryString =
    subcategories.length > 0
      ? `tossups.subcategory_id in (${subcategories.join(', ')})`
      : true;
  let combinedCategoryiesQueryString;
  if (categories.length === 0 && subcategories.length === 0)
    combinedCategoryiesQueryString = true;
  else if (subcategories.length > 0)
    combinedCategoryiesQueryString = subcategoriesQueryString;
  else if (categories.length > 0)
    combinedCategoryiesQueryString = categoriesQueryString;

  const difficultiesQueryString =
    difficulties.length > 0
      ? `tournaments.difficulty in (${difficulties.join(', ')})`
      : true;

  const columns = [
    { name: 'text', alias: 'text' },
    { name: 'answer', alias: 'answer' },
    { name: 'formatted_text', alias: 'formatted_text' },
    { name: 'formatted_answer', alias: 'formatted_answer' },
    { name: 'category_id', alias: 'category' },
    { name: 'subcategory_id', alias: 'subcategory' },
    { name: 'difficulty', alias: 'difficulty' },
    { name: 'name', alias: 'tournament' },
  ];
  const columnsCommand = columns
    .map((c) => `${c.name} as ${c.alias}`)
    .join(',');

  const query = `
    select ${columnsCommand} from tossups
    inner join tournaments on tossups.tournament_id = tournaments.id
    where (${combinedCategoryiesQueryString}) and ${difficultiesQueryString}
    order by random()
    limit ${limit};
  `;

  return client.query(query);
};
