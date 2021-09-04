import { Flex, Icon, IconButton, Link, Spacer, Text } from '@chakra-ui/react';
import { AiFillGithub } from 'react-icons/ai';

const Footer: React.FC = () => {
  return (
    <Flex align="center" justify="center" mt={1} mb={1}>
      <Text textAlign="center" fontWeight="bold" mr={4}>
        Created by{' '}
        <Link href="https://seancye.com" color="cyan.600" isExternal>
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
    </Flex>
  );
};

export default Footer;
