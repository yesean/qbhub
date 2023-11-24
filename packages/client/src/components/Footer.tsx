/// <reference types="vite-plugin-svgr/client" />
import { InfoOutlineIcon, QuestionOutlineIcon } from '@chakra-ui/icons';
import { Flex, Heading, Icon, IconButton, Link } from '@chakra-ui/react';
import { useModalContext } from '../providers/ModalContext';
import { ReactComponent as Discord } from '../static/discord.svg';
import { ReactComponent as Github } from '../static/github.svg';

const discordURL = 'https://discord.gg/wWXfWUDdWm';

const Footer: React.FC<React.PropsWithChildren<unknown>> = () => {
  const { openUpdatesModal, openInfoModal } = useModalContext();

  return (
    <Flex align="center" justify="center" p={3}>
      <IconButton
        aria-label="discord link"
        bg="white"
        icon={
          <Link href={discordURL} isExternal w={5} h={5}>
            <Icon as={Discord} w="115%" h="115%" color="#7289da" />
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
