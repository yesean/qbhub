import { InfoOutlineIcon } from '@chakra-ui/icons';
import { Flex, Heading, Icon, IconButton, Link } from '@chakra-ui/react';
import { AiFillGithub } from 'react-icons/ai';
import { useAppDispatch } from '../../app/hooks';
import { open } from '../InfoModal/infoModalSlice';
import { ReactComponent as Donate } from '../../static/donate.svg';

const Footer: React.FC<React.PropsWithChildren<unknown>> = () => {
  const dispatch = useAppDispatch();

  const openModal = () => dispatch(open());

  return (
    <>
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
            <Link
              href="https://github.com/seanye24/qbhub-client"
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
          onClick={openModal}
          icon={<InfoOutlineIcon />}
        />
      </Flex>
    </>
  );
};

export default Footer;
