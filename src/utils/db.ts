import { Client } from 'pg';

const client = new Client({
  user: 'sean',
  host: 'localhost',
  database: 'quizbowl',
  port: 5432,
});
client.connect();

export const queryTossups = async (
  categories: number[],
  difficulties: number[]
) => {
  const categoriesQueryString =
    categories.length > 0
      ? `tossups.category_id in (${categories.join(', ')})`
      : true;
  const difficultiesQueryString =
    difficulties.length > 0
      ? `tournaments.difficulty in (${difficulties.join(', ')})`
      : true;

  const query = `
    select tournaments.name as tournament_name, tournaments.difficulty as tournament_difficulty, text, answer, formatted_text, formatted_answer from tossups
    inner join tournaments on tossups.tournament_id = tournaments.id
    where ${categoriesQueryString} and ${difficultiesQueryString}
    order by random()
    limit 10;
  `;

  return client.query(query);
};
