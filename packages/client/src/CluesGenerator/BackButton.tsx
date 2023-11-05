import { ArrowBackIcon } from '@chakra-ui/icons';
import {
  RouterLinkIconButton,
  RouterLinkIconButtonProps,
} from '../components/buttons';

export default ({ to, ...rest }: Omit<RouterLinkIconButtonProps, 'icon'>) => (
  <RouterLinkIconButton
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...rest}
    to={to}
    icon={<ArrowBackIcon w={4} h={4} mr={1} />}
  />
);
