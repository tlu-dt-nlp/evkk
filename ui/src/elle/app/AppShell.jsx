import { Outlet, ScrollRestoration, useNavigate, useSearchParams } from 'react-router-dom';
import { useContext, useEffect } from 'react';
import RootContext from '../context/RootContext';
import { errorEmitter } from '../../App';
import ErrorSnackbar, { ErrorSnackbarEventType } from '../components/snackbar/ErrorSnackbar';
import ServerOffline from '../components/error/ServerOffline';
import SuccessSnackbar from '../components/snackbar/SuccessSnackbar';
import SessionExpirationModal from '../components/modal/SessionExpirationModal';
import LoadingSpinner from '../components/LoadingSpinner';
import PageTitle from '../components/PageTitle';
import Navbar from '../components/Navbar';
import DonateText from '../components/DonateText';
import FooterElement from '../components/FooterElement';
import withGlobalLoading from '../hoc/withGlobalLoading';

function AppWithStatus() {
  const navigate = useNavigate();
  const [urlParams] = useSearchParams();
  const { setContext, status } = useContext(RootContext);

  useEffect(() => {
    if (urlParams.get('loginFailed')) {
      errorEmitter.emit(ErrorSnackbarEventType.LOGIN_FAILED);
      navigate('', { replace: true });
    }

    if (urlParams.get('idCodeMissing')) {
      errorEmitter.emit(ErrorSnackbarEventType.ID_CODE_MISSING);
      navigate('', { replace: true });
    }
  }, [urlParams, navigate]);

  if (!status) {
    return <ServerOffline retry={setContext} />;
  }

  return (
    <div className="min-vh-100 d-flex flex-column justify-content-between">
      <div>
        <ErrorSnackbar />
        <SuccessSnackbar />
        <LoadingSpinner />
        <SessionExpirationModal />
        <PageTitle />
        <ScrollRestoration />
        <Navbar />
        <DonateText />
        <Outlet />
      </div>
      <FooterElement />
    </div>
  );
}

export const AppShell = withGlobalLoading(AppWithStatus);
