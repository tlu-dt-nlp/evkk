import { useContext } from 'react';
import RootContext from '../../context/RootContext';

export default function Can({ role, requireAuth = false, children }) {
  const { user } = useContext(RootContext);

  const hasRole = () => user?.roleName === role;

  if (requireAuth && !user) {
    return null;
  } else if (role && !hasRole()) {
    return null;
  }

  return (
    <>{children}</>
  );
}
