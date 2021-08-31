import axios from 'axios';
import { Category, Difficulty, Subcategory, Tossup } from '../types';

const TOSSUP_ENDPOINT = `/api/tossups`;

export const fetchTossup = async (
  categories: Category[],
  subcategories: Subcategory[],
  difficulties: Difficulty[],
  limit: number
): Promise<Tossup[]> => {
  const categoriesQueryString = categories
    .map((c) => `categories[]=${c}`)
    .join('&');
  const subcategoriesQueryString = subcategories
    .map((c) => `subcategories[]=${c}`)
    .join('&');
  const difficultiesQueryString = difficulties
    .map((c) => `difficulties[]=${c}`)
    .join('&');
  const limitQueryString = `limit=${limit}`;

  try {
    const url = `${TOSSUP_ENDPOINT}?${categoriesQueryString}&${subcategoriesQueryString}&${difficultiesQueryString}&${limitQueryString}`;
    const response = await axios.get(url);
    const { data: tossups } = response;
    return tossups.map((tu: any) => ({
      text: tu.text,
      answer: tu.answer,
      formattedText: tu.formatted_text,
      formattedAnswer: tu.formatted_answer,
      category: tu.category,
      subcategory: tu.subcategory,
      difficulty: tu.difficulty,
      tournament: tu.tournament,
    }));
  } catch (e) {
    return [];
  }
};
