import { useEffect } from 'react';
import { initializePostHog } from '@/utils/posthog';

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    initializePostHog();
  }, []);

  return <Component {...pageProps} />;
}

export default MyApp;