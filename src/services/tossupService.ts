import axios from 'axios';
import { Category, Difficulty } from '../types';

const TOSSUP_ENDPOINT = `/api/tossups`;

export const fetchTossup = async (
  categories: Category[],
  difficulties: Difficulty[]
) => {
  const categoriesQueryString = categories
    .map((c) => `categories[]=${c}`)
    .join('&');
  const difficultiesQueryString = difficulties
    .map((c) => `difficulties[]=${c}`)
    .join('&');

  try {
    const url = `${TOSSUP_ENDPOINT}?${categoriesQueryString}&${difficultiesQueryString}`;
    const response = await axios.get(url);
    return response.data;
  } catch (e) {
    console.error(e);
    return null;
  }
};
