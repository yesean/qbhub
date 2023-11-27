import { useContext } from 'react';
import { QuestionReaderContext } from './QuestionReaderContext';

export default function useQuestionReaderContext() {
  return useContext(QuestionReaderContext);
}
