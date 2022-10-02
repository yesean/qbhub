import { SearchIcon } from '@chakra-ui/icons';
import {
  RouterLinkIconButton,
  RouterLinkIconButtonProps,
} from '../components/buttons';

export default ({ to, ...rest }: Omit<RouterLinkIconButtonProps, 'icon'>) => (
  // eslint-disable-next-line react/jsx-props-no-spreading
  <RouterLinkIconButton {...rest} to={to} icon={<SearchIcon w={6} h={6} />} />
);
