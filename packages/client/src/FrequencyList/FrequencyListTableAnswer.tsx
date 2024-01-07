import { Text } from '@chakra-ui/react';
import { RouterLink } from '../components/RouterLink';
import { useGetURL } from '../utils/routes';

type FrequencyListTableAnswerProps = {
  answer: string;
};

export default function FrequencyListTableAnswer({
  answer,
}: FrequencyListTableAnswerProps) {
  const { getClueDisplayURL } = useGetURL();

  return (
    <RouterLink to={getClueDisplayURL({ answer })}>
      <Text whiteSpace="normal">{answer}</Text>
    </RouterLink>
  );
}
