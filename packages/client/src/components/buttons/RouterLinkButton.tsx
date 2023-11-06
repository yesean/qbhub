import { Link as ReactRouterLink } from 'react-router-dom';
import { LinkButton, Props as LinkButtonProps } from './LinkButton';

const RouterLinkButton: React.FC<LinkButtonProps> = ({ to, ...rest }) => (
  <LinkButton
    as={ReactRouterLink}
    to={to}
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...rest}
  />
);

export default RouterLinkButton;
