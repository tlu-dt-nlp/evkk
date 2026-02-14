import { useContext } from 'react';
import RootContext from '../context/RootContext';

const withGlobalLoading = (WrappedComponent) => (props) => {
  const { isLoading } = useContext(RootContext);

  return isLoading ? null : <WrappedComponent {...props} />;
};

export default withGlobalLoading;
