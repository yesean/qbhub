import {
  CloseButton,
  Drawer,
  DrawerContent,
  DrawerOverlay,
  Flex,
  Heading,
  Link,
} from '@chakra-ui/react';
import { useMemo } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { ROUTES } from '../routes';

type HamburgerMenuProps = {
  closeModal: () => void;
  isOpen: boolean;
};

const HamburgerMenu: React.FC<React.PropsWithChildren<HamburgerMenuProps>> = ({
  closeModal,
  isOpen,
}) => {
  const { getURL: getTossupReaderURL } = ROUTES.tossupReader.useRouteContext();
  const { getURL: getBonusReaderURL } = ROUTES.bonusReader.useRouteContext();
  const { getURL: getFrequencyListURL } =
    ROUTES.frequencyList.useRouteContext();
  const { getURL: getClueSearchURL } = ROUTES.clueSearch.useRouteContext();
  const { getURL: getAboutURL } = ROUTES.about.useRouteContext();

  const links = useMemo(
    () => [
      { getURL: getTossupReaderURL, name: 'Tossup Reader' },
      { getURL: getBonusReaderURL, name: 'Bonus Reader' },
      { getURL: getFrequencyListURL, name: 'Frequency List' },
      { getURL: getClueSearchURL, name: 'Clues Generator' },
      { getURL: getAboutURL, name: 'About' },
    ],
    [
      getAboutURL,
      getBonusReaderURL,
      getClueSearchURL,
      getFrequencyListURL,
      getTossupReaderURL,
    ],
  );

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
              to={getURL({}).href}
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
