import {
  CloseButton,
  Drawer,
  DrawerContent,
  DrawerOverlay,
  Flex,
  Heading,
  Link,
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import {
  getAboutURL,
  getBonusReaderURL,
  getClueSearchURL,
  getFrequencyListURL,
  getTossupReaderURL,
  useGlobalQueryParams,
} from '../utils/routes';

const links = [
  { getURL: getTossupReaderURL, name: 'Tossup Reader' },
  { getURL: getBonusReaderURL, name: 'Bonus Reader' },
  { getURL: getFrequencyListURL, name: 'Frequency List' },
  { getURL: getClueSearchURL, name: 'Clues Generator' },
  { getURL: getAboutURL, name: 'About' },
];

type HamburgerMenuProps = {
  closeModal: () => void;
  isOpen: boolean;
};

const HamburgerMenu: React.FC<React.PropsWithChildren<HamburgerMenuProps>> = ({
  closeModal,
  isOpen,
}) => {
  const [params] = useGlobalQueryParams();

  return (
    <Drawer isOpen={isOpen} onClose={closeModal} placement="right">
      <DrawerOverlay />
      <DrawerContent>
        <Flex align="center" direction="column" p={4}>
          <CloseButton mb={4} onClick={closeModal} size="lg" />
          {links.map(({ getURL, name }) => (
            <Link
              key={name}
              _hover={{ bg: 'cyan.100' }}
              as={RouterLink}
              p={4}
              textAlign="center"
              to={getURL(params)}
              w="100%"
            >
              <Heading size="md">{name}</Heading>
            </Link>
          ))}
        </Flex>
      </DrawerContent>
    </Drawer>
  );
};

export default HamburgerMenu;
