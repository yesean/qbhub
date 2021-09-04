import { useContext, useEffect, useState } from 'react';
import {
  Modal,
  ModalContent,
  ModalOverlay,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
} from '@chakra-ui/react';

import { Tossup, TossupResult, TossupResultScore } from '../../types';
import { Mode, ModeContext } from '../../services/ModeContext';
import { TossupContext } from '../../services/TossupContext';
import { parseHTMLString } from '../../services/utils';
import { TossupResultContext } from '../../services/TossupResultContext';

type TossupHistoryModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

type Result = {
  tossup: Tossup;
  result: TossupResult;
};

const TossupHistoryModal: React.FC<TossupHistoryModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [results, setResults] = useState<Result[]>([]);
  const { mode } = useContext(ModeContext);
  const { tossup } = useContext(TossupContext);
  const { result } = useContext(TossupResultContext);

  useEffect(() => {
    if (mode === Mode.revealed && result !== null) {
      setResults((r) => [{ tossup, result }, ...r]);
    }
  }, [mode, tossup, result]);

  const powers = results.filter(
    (r) => r.result.score === TossupResultScore.power,
  ).length;

  const tens = results.filter(
    (r) => r.result.score === TossupResultScore.ten,
  ).length;

  const negs = results.filter(
    (r) => r.result.score === TossupResultScore.neg,
  ).length;

  const points = results.reduce((acc, r) => acc + r.result.score, 0);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="6xl"
      scrollBehavior="inside"
      isCentered
    >
      <ModalOverlay />
      <ModalContent m={4} maxH="max(75vh, 600px)">
        <ModalHeader>Tossup History</ModalHeader>
        <ModalBody pt={0} display="flex" flexDirection="column">
          <Table variant="simple" mb={4}>
            <Thead>
              <Tr>
                <Th>15</Th>
                <Th>10</Th>
                <Th>-5</Th>
                <Th>Points</Th>
              </Tr>
            </Thead>
            <Tbody>
              <Tr>
                <Td>{powers}</Td>
                <Td>{tens}</Td>
                <Td>{negs}</Td>
                <Td>{points}</Td>
              </Tr>
            </Tbody>
          </Table>
          <Table
            variant="simple"
            display="block"
            pos="relative"
            overflow="auto"
          >
            <Thead pos="sticky" top={0} bg="white">
              <Tr>
                <Th>Score</Th>
                <Th>Input</Th>
                <Th>Answer</Th>
                <Th>Question</Th>
                <Th>Tournament</Th>
              </Tr>
            </Thead>
            <Tbody zIndex={-1}>
              {results.map((r) => (
                <Tr
                  key={r.tossup.formattedAnswer}
                  backgroundColor={r.result.score > 0 ? 'green.200' : 'red.200'}
                >
                  <Td>{r.result.score}</Td>
                  <Td>{r.result.submittedAnswer}</Td>
                  <Td>{parseHTMLString(r.tossup.formattedAnswer)}</Td>
                  <Td>{r.result.buzz.textWithBuzz}</Td>
                  <Td>{r.tossup.tournament}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="cyan" color="gray.50" mr={3} onClick={onClose}>
            Done
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default TossupHistoryModal;
