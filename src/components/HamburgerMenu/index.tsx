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
import { ROUTES } from '../../utils/routes';

const links = [
  { name: 'Tossup Reader', href: ROUTES.tossupReader },
  { name: 'Frequency List', href: ROUTES.freq },
  { name: 'Clues Generator', href: ROUTES.cluesSearch },
];

type HamburgerMenuProps = {
  isOpen: boolean;
  onClose: () => void;
};
const HamburgerMenu: React.FC<HamburgerMenuProps> = ({ isOpen, onClose }) => {
  return (
    <Drawer isOpen={isOpen} onClose={onClose} placement="right">
      <DrawerOverlay />
      <DrawerContent>
        <Flex direction="column" align="center" p={4}>
          <CloseButton size="lg" onClick={onClose} mb={4} />
          {links.map(({ name, href }) => (
            <Link
              as={RouterLink}
              to={href}
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
