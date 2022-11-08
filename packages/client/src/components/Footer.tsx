import { InfoOutlineIcon, QuestionOutlineIcon } from '@chakra-ui/icons';
import { Flex, Heading, Icon, IconButton, Link } from '@chakra-ui/react';
import { AiFillGithub } from 'react-icons/ai';
import { useAppDispatch } from '../redux/hooks';
import { ReactComponent as Donate } from '../static/donate.svg';
import { open as openInfoModalAction } from './InfoModal/infoModalSlice';
import { open as openUpdatesModalAction } from './UpdatesModal/updatesModalSlice';

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
        <Link href="https://seanye.me" color="cyan.600" isExternal>
          Sean Ye
        </Link>
      </Heading>
      <IconButton
        aria-label="github link"
        bg="white"
        icon={
          <Link href="https://github.com/yesean/qbhub" isExternal w={6} h={6}>
            <Icon w="100%" h="100%" as={AiFillGithub} />{' '}
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
