import { Link } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { TwoColumnTable } from '../components/Table';
import { Answer } from '../types/tossups';

const answersFields = [
  { label: 'Answer', key: 'answer' },
  { label: 'Frequency', key: 'frequency' },
] as const;

type AnswersProps = {
  answers: Answer[];
};
const Answers: React.FC<AnswersProps> = ({ answers }) => {
  const createLink = (answer: string) => (
    <Link
      as={RouterLink}
      to={(location: any) => `${location.pathname}/${answer}`}
    >
      {answer}
    </Link>
  );
  return (
    <TwoColumnTable
      data={answers.map((answer) => ({
        ...answer,
        answer: createLink(answer.answer),
      }))}
      fields={answersFields}
      width={600}
      height={700}
    />
  );
};

export default Answers;
