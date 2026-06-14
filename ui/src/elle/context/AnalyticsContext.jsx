import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import ReactGA from 'react-ga4';
import { AnalyticsBanner } from '../components/AnalyticsBanner';
import { ANALYTICS_CONSENT_KEY } from '../const/Constants';

const MEASUREMENT_ID = import.meta.env.GA_MEASUREMENT_ID;

const AnalyticsContext = createContext(null);

const getPagePath = (location) => `${location.pathname}${location.search ?? ''}`;

const getAnalyticsConsent = () => {
  const value = localStorage.getItem(ANALYTICS_CONSENT_KEY);
  return JSON.parse(value);
};
const resetAnalyticsConsent = () => localStorage.removeItem(ANALYTICS_CONSENT_KEY);

export function AnalyticsProvider({ children, router }) {
  const [consent, setConsent] = useState(getAnalyticsConsent);
  const [bannerOpen, setBannerOpen] = useState(() => consent === null);
  const isGranted = MEASUREMENT_ID && consent === true;

  useEffect(() => {
    if (isGranted) {
      ReactGA.initialize(MEASUREMENT_ID);
    }
  }, [isGranted]);

  useEffect(() => {
    if (!isGranted || !router) {
      return undefined;
    }

    const sendPageView = () => {
      const currentLocation = router.state.location ?? globalThis.location;
      ReactGA.send({ hitType: 'pageview', page: getPagePath(currentLocation) });
    };

    sendPageView();
    return router.subscribe(sendPageView);
  }, [isGranted, router]);

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

