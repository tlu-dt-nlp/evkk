import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import ReactGA from 'react-ga4';
import { AnalyticsBanner, getAnalyticsConsent, resetAnalyticsConsent } from './elle/components/AnalyticsBanner';

const MEASUREMENT_ID = import.meta.env.VITE_GA_KEY;

const AnalyticsContext = createContext(null);

export function AnalyticsProvider({ children }) {
  const [consent, setConsent] = useState(getAnalyticsConsent);
  const [bannerOpen, setBannerOpen] = useState(() => consent === null);
  const isGranted = MEASUREMENT_ID && consent === 'granted';

  useEffect(() => {
    if (isGranted) {
      ReactGA.initialize(MEASUREMENT_ID);
    }
  }, [isGranted]);

  const location = useLocation();

  useEffect(() => {
    if (isGranted) {
      ReactGA.send({ hitType: 'pageview', page: location.pathname + location.search });
    }
  }, [location, isGranted]);

  const handleConsent = useCallback((value) => {
    setConsent(value);
    setBannerOpen(false);
  }, []);

  const openConsentBanner = useCallback(() => {
    resetAnalyticsConsent();
    setConsent(null);
    setBannerOpen(true);
  }, []);

  // noinspection JSUnusedGlobalSymbols
  const analytics = useMemo(() => ({
    trackEvent: (category, action, label) => {
      if (isGranted) {
        ReactGA.event({ category, action, label });
      }
    },
    trackToolAnalyze: (tool) => {
      if (isGranted) {
        ReactGA.event({ category: 'Tool', action: 'analyze', label: tool });
      }
    },
    trackTextSubmit: () => {
      if (isGranted) {
        ReactGA.event({ category: 'Text', action: 'submit', label: 'publish-text' });
      }
    },
    openConsentBanner
  }), [isGranted, openConsentBanner]);

  return (
    <AnalyticsContext.Provider value={analytics}>
      {children}
      <AnalyticsBanner onConsent={handleConsent} open={bannerOpen} />
    </AnalyticsContext.Provider>
  );
}

export function useAnalytics() {
  return useContext(AnalyticsContext);
}
