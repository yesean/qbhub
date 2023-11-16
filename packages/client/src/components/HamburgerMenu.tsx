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
  { name: 'Tossup Reader', getURL: getTossupReaderURL },
  { name: 'Bonus Reader', getURL: getBonusReaderURL },
  { name: 'Frequency List', getURL: getFrequencyListURL },
  { name: 'Clues Generator', getURL: getClueSearchURL },
  { name: 'About', getURL: getAboutURL },
];

type HamburgerMenuProps = {
  isOpen: boolean;
  closeModal: () => void;
};

const HamburgerMenu: React.FC<React.PropsWithChildren<HamburgerMenuProps>> = ({
  isOpen,
  closeModal,
}) => {
  const [params] = useGlobalQueryParams();

  return (
    <Drawer isOpen={isOpen} onClose={closeModal} placement="right">
      <DrawerOverlay />
      <DrawerContent>
        <Flex direction="column" align="center" p={4}>
          <CloseButton size="lg" onClick={closeModal} mb={4} />
          {links.map(({ name, getURL }) => (
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
