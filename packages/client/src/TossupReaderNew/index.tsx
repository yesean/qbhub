import {
  Category,
  Difficulty,
  Subcategory,
  Tossup,
  Tournament,
} from '@qbhub/types';
import QuestionReader from '../components/QuestionReader';
import { cleanTossupText } from '../utils/string';

const mockQuestion: Tossup = {
  id: 91388,
  year: 2013,
  text: 'The dependent form of these entities can depend on values and are implemented in the language Coq. For a function, this entity is contravariant in its value for the input. Proving one of these is inhabited is equivalent to proving a tautology, since they correspond to theorems in intuitionistic logic by the (*) Curry-Howard correspondence. Allowing a function to have different behaviors based on the value of this entity for its argument is called polymorphism. Depending on whether they are checked at compile-time or runtime, a language can be classified as static or dynamic. These entities can be explicitly changed through coercion or their namesake casting. For 10 points, name these classifications of programming constructs such as int and string.',
  answer: 'data types',
  tournament: Tournament['2013 Western Invitational Tournament'],
  difficulty: Difficulty['Regular College'],
  category: Category.Science,
  subcategory: Subcategory['Science Computer Science'],
  formattedText: cleanTossupText(
    '<b>The dependent form of these entities can depend on values and are implemented in the language Coq. For a function, this entity is contravariant in its value for the input. Proving one of these is inhabited is equivalent to proving a tautology, since they correspond to theorems in intuitionistic logic by the (*)</b>) Curry-Howard correspondence. Allowing a function to have different behaviors based on the value of this entity for its argument is called polymorphism. Depending on whether they are checked at compile-time or runtime, a language can be classified as static or dynamic. These entities can be explicitly changed through coercion or their namesake casting. For 10 points, name these classifications of programming constructs such as int and string.',
  ),
  formattedAnswer: 'data types',
  normalizedAnswer: 'data types',
};

export default () => {
  return <QuestionReader question={mockQuestion} />;
};
