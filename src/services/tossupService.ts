import axios from 'axios';
import { blankTossup } from '../constants';
import { Category, Difficulty, Tossup } from '../types';

const TOSSUP_ENDPOINT = `/api/tossups`;

export const fetchTossup = async (
  categories: Category[],
  difficulties: Difficulty[]
): Promise<Tossup> => {
  const categoriesQueryString = categories
    .map((c) => `categories[]=${c}`)
    .join('&');
  const difficultiesQueryString = difficulties
    .map((c) => `difficulties[]=${c}`)
    .join('&');
  const limitQueryString = 'limit=1';

  try {
    const url = `${TOSSUP_ENDPOINT}?${categoriesQueryString}&${difficultiesQueryString}&${limitQueryString}`;
    const response = await axios.get(url);
    const { data: tossups } = response;
    const tossup = tossups[0];
    return {
      text: tossup.text,
      formattedText: tossup.formatted_text,
      answer: tossup.answer,
      formattedAnswer: tossup.formatted_answer,
      category: tossup.category,
      difficulty: tossup.difficulty,
      tournament: tossup.tournament,
    };
  } catch (e) {
    return blankTossup;
  }
};
