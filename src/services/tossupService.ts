import axios from 'axios';
import { blankTossup } from '../constants';
import { Category, Difficulty, Subcategory, Tossup } from '../types';

const TOSSUP_ENDPOINT = `/api/tossups`;

export const fetchTossup = async (
  categories: Category[],
  subcategories: Subcategory[],
  difficulties: Difficulty[]
): Promise<Tossup> => {
  const categoriesQueryString = categories
    .map((c) => `categories[]=${c}`)
    .join('&');
  const subcategoriesQueryString = subcategories
    .map((c) => `subcategories[]=${c}`)
    .join('&');
  const difficultiesQueryString = difficulties
    .map((c) => `difficulties[]=${c}`)
    .join('&');
  const limitQueryString = 'limit=1';

  try {
    const url = `${TOSSUP_ENDPOINT}?${categoriesQueryString}&${subcategoriesQueryString}&${difficultiesQueryString}&${limitQueryString}`;
    const response = await axios.get(url);
    const { data: tossups } = response;
    const tossup = tossups[0];
    return {
      text: tossup.text,
      answer: tossup.answer,
      formattedText: tossup.formatted_text,
      formattedAnswer: tossup.formatted_answer,
      category: tossup.category,
      subcategory: tossup.subcategory,
      difficulty: tossup.difficulty,
      tournament: tossup.tournament,
    };
  } catch (e) {
    return blankTossup;
  }
};
