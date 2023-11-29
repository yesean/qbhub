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
        <Flex direction="column" align="center" p={4}>
          <CloseButton size="lg" onClick={closeModal} mb={4} />
          {links.map(({ getURL, name }) => (
            <Link
              key={name}
              as={RouterLink}
              to={getURL(params)}
              p={4}
              w="100%"
              textAlign="center"
              _hover={{ bg: 'cyan.100' }}
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
