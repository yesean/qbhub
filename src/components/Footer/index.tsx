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
      <Flex align="center" justify="center" mt={2} pt={1} pb={1}>
        <Text textAlign="center" fontWeight="bold" mr={4}>
          Created by{' '}
          <Link href="https://seanye.me" color="cyan.600" isExternal>
            Sean Ye
          </Link>
        </Text>
        <IconButton
          aria-label="github link"
          bg="white"
          icon={
            <Link href="https://github.com/seanye24/qbhub-frontend" isExternal>
              <Icon w={6} h={6} as={AiFillGithub} />{' '}
            </Link>
          }
        />
        <IconButton
          position="absolute"
          right={4}
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
