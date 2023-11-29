/* eslint-disable react/no-array-index-key */
import {
  Box,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';
import { BonusScore } from '@qbhub/types';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { selectBonusReader } from '../BonusReader/bonusReaderSlice';
import TealButton from '../components/buttons/TealButton';
import BonusResults from './BonusResults';

const scoreHeaders = ['30', '20', '10', '0', 'Total', 'PPB'];

type BonusHistoryModalProps = {
  closeModal: () => void;
  isOpen: boolean;
};

const BonusHistoryModal: React.FC<
  React.PropsWithChildren<BonusHistoryModalProps>
> = ({ closeModal, isOpen }) => {
  const { results } = useSelector(selectBonusReader);

  const thirties = results.filter((r) => r.score === BonusScore.thirty).length;
  const twenties = results.filter((r) => r.score === BonusScore.twenty).length;
  const tens = results.filter((r) => r.score === BonusScore.ten).length;
  const zeros = results.filter((r) => r.score === BonusScore.zero).length;
  const points = results.reduce((acc, r) => acc + r.score, 0);
  const ppb = results.length > 0 ? points / results.length : 0;

  const scoreBody = [thirties, twenties, tens, zeros, points, ppb.toFixed(2)];

  const partResults = useMemo(
    () =>
      results.flatMap((res) =>
        res.parts.map((part) => ({
          ...part,
          bonus: res.bonus,
          part: res.bonus.parts[part.number - 1],
        })),
      ),
    [results],
  );

  return (
    <Modal
      isCentered
      isOpen={isOpen}
      onClose={closeModal}
      scrollBehavior="inside"
      size="6xl"
    >
      <ModalOverlay />
      <ModalContent h="max(75vh, 600px)" m={4} w="min(90vw, 1400px)">
        <ModalHeader>Bonus History</ModalHeader>
        <ModalBody display="flex" flexDirection="column" pt={0}>
          <Box overflowX="auto">
            <Table mb={4} variant="simple">
              <Thead>
                <Tr>
                  {scoreHeaders.map((header, i) => (
                    <Th key={i}>{header}</Th>
                  ))}
                </Tr>
              </Thead>
              <Tbody>
                <Tr>
                  {scoreBody.map((score, i) => (
                    <Td key={i}>{score}</Td>
                  ))}
                </Tr>
              </Tbody>
            </Table>
          </Box>
          <BonusResults results={partResults} />
        </ModalBody>
        <ModalFooter>
          <TealButton mr={3} onClick={closeModal}>
            Done
          </TealButton>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default BonusHistoryModal;
