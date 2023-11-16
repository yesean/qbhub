import { InfoOutlineIcon, QuestionOutlineIcon } from '@chakra-ui/icons';
import { Flex, Heading, IconButton, Link } from '@chakra-ui/react';
import { open as openInfoModalAction } from '../InfoModal/infoModalSlice';
import { useAppDispatch } from '../redux/hooks';
import { ReactComponent as Donate } from '../static/coffee.svg';
import { ReactComponent as Github } from '../static/github.svg';
import { open as openUpdatesModalAction } from '../UpdatesModal/updatesModalSlice';

const Footer: React.FC<React.PropsWithChildren<unknown>> = () => {
  const dispatch = useAppDispatch();

  const openInfoModal = () => dispatch(openInfoModalAction());
  const openUpdatesModal = () => dispatch(openUpdatesModalAction());

  return (
    <Flex align="center" justify="center" p={3}>
      <IconButton
        aria-label="buymeacoffee link"
        bg="white"
        icon={
          <Link
            href="https://www.buymeacoffee.com/qbhub"
            isExternal
            w={5}
            h={5}
          >
            <Donate width="100%" height="100%" />
          </Link>
        }
      />
      <Heading textAlign="center" fontWeight="bold" size="sm" mx={2}>
        Created by{' '}
        <Link href="https://sye.dev" color="cyan.600" isExternal>
          Sean Ye
        </Link>
      </Heading>
      <IconButton
        aria-label="github link"
        bg="white"
        icon={
          <Link href="https://github.com/yesean/qbhub" isExternal w={5} h={5}>
            <Github width="100%" height="100%" />
          </Link>
        }
      />
      <IconButton
        position="absolute"
        left={4}
        aria-label="keyboard shortcuts"
        onClick={openUpdatesModal}
        icon={<InfoOutlineIcon />}
      />
      <IconButton
        position="absolute"
        right={4}
        aria-label="keyboard shortcuts"
        onClick={openInfoModal}
        icon={<QuestionOutlineIcon />}
      />
    </Flex>
  );
};

export default Footer;
