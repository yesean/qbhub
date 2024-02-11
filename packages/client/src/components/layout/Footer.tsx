/// <reference types="vite-plugin-svgr/client" />
import { InfoOutlineIcon, QuestionOutlineIcon } from '@chakra-ui/icons';
import { Flex, Heading, Icon, IconButton, Link } from '@chakra-ui/react';
import { useModalContext } from '../../providers/ModalContext';
import Discord from '../../static/discord.svg?react';
import Github from '../../static/github.svg?react';

const DISCORD_URL = 'https://discord.gg/wWXfWUDdWm';

const Footer: React.FC<React.PropsWithChildren<unknown>> = () => {
  const { openInfoModal, openUpdatesModal } = useModalContext();

  return (
    <Flex align="center" justify="center" p={3}>
      <IconButton
        aria-label="discord link"
        bg="white"
        icon={
          <Link h={5} href={DISCORD_URL} isExternal w={5}>
            <Icon as={Discord} color="#7289da" h="115%" w="115%" />
          </Link>
        }
      />
      <Heading fontWeight="bold" mx={2} size="sm" textAlign="center">
        Created by{' '}
        <Link color="cyan.600" href="https://sye.dev" isExternal>
          Sean Ye
        </Link>
      </Heading>
      <IconButton
        aria-label="github link"
        bg="white"
        icon={
          <Link h={5} href="https://github.com/yesean/qbhub" isExternal w={5}>
            <Icon as={Github} h="100%" w="100%" />
          </Link>
        }
      />
      <IconButton
        aria-label="keyboard shortcuts"
        icon={<InfoOutlineIcon />}
        left={4}
        onClick={openUpdatesModal}
        position="absolute"
      />
      <IconButton
        aria-label="keyboard shortcuts"
        icon={<QuestionOutlineIcon />}
        onClick={openInfoModal}
        position="absolute"
        right={4}
      />
    </Flex>
  );
};

export default Footer;
