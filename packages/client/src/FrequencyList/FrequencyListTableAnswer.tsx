import { Text } from '@chakra-ui/react';

import { RouterLink } from '../components/routing/RouterLink';
import { ROUTES } from '../routes';

type FrequencyListTableAnswerProps = {
  answer: string;
};

export default function FrequencyListTableAnswer({
  answer,
}: FrequencyListTableAnswerProps) {
  const { getURL: getClueDisplayURL } = ROUTES.clueDisplay.useRouteContext();

  return (
    <RouterLink to={getClueDisplayURL({ answer })}>
      <Text whiteSpace="normal">{answer}</Text>
    </RouterLink>
  );
}
