import { InfoOutlineIcon } from '@chakra-ui/icons';
import { Flex, Icon, IconButton, Link, Text } from '@chakra-ui/react';
import { useState } from 'react';
import { AiFillGithub } from 'react-icons/ai';
import KeyboardShortcutsModal from '../KeyboardShortcutsModal';

const Footer: React.FC = () => {
  const [isKeyboardShortcutsModalOpen, setIsKeyboardShortcutsModalOpen] =
    useState(false);

  return (
    <>
      <Flex align="center" justify="center" mt={2} p={3}>
        <Text textAlign="center" fontWeight="bold" mr={2}>
          Created by{' '}
          <Link href="https://seanye.me" color="cyan.600" isExternal>
            Sean Ye
          </Link>
        </Text>
        <IconButton
          aria-label="github link"
          bg="white"
          icon={
            <Link
              href="https://github.com/seanye24/qbhub-frontend"
              isExternal
              w={6}
              h={6}
            >
              <Icon w="100%" h="100%" as={AiFillGithub} />{' '}
            </Link>
          }
        />
        <IconButton
          position="absolute"
          right={3}
          aria-label="keyboard shortcuts"
          onClick={() => setIsKeyboardShortcutsModalOpen(true)}
          icon={<InfoOutlineIcon />}
        />
      </Flex>
      <KeyboardShortcutsModal
        isOpen={isKeyboardShortcutsModalOpen}
        onClose={() => setIsKeyboardShortcutsModalOpen(false)}
      />
    </>
  );
};

export default Footer;
