import {
  CloseButton,
  Drawer,
  DrawerContent,
  DrawerOverlay,
  Flex,
  Heading,
  Link,
} from '@chakra-ui/react';
import { useSelector } from 'react-redux';
import { Link as RouterLink } from 'react-router-dom';
import { useAppDispatch } from '../../redux/hooks';
import { ROUTES } from '../../utils/routes';
import { close, selectHamburgerMenu } from './hamburgerMenuSlice';

const links = [
  { name: 'Tossup Reader', href: ROUTES.tossupReader },
  { name: 'Bonus Reader', href: ROUTES.bonusReader },
  { name: 'Frequency List', href: ROUTES.frequencyList },
  { name: 'Clues Generator', href: ROUTES.clue.search },
  { name: 'About', href: ROUTES.about },
];

const HamburgerMenu: React.FC<React.PropsWithChildren<unknown>> = () => {
  const dispatch = useAppDispatch();
  const { isOpen } = useSelector(selectHamburgerMenu);

  const closeMenu = () => dispatch(close());

  return (
    <Drawer isOpen={isOpen} onClose={closeMenu} placement="right">
      <DrawerOverlay />
      <DrawerContent>
        <Flex direction="column" align="center" p={4}>
          <CloseButton size="lg" onClick={closeMenu} mb={4} />
          {links.map(({ name, href }) => (
            <Link
              key={name}
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
