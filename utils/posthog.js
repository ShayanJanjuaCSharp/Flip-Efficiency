import posthog from 'posthog-js';

const POSTHOG_API_HOST = 'https://app.posthog.com'; // Or your PostHog instance URL if self-hosted

export const initializePostHog = () => {
  if (typeof window !== 'undefined') {
    posthog.init(process.env.POSTHOG_API_KEY, { api_host: POSTHOG_API_HOST });
  }
};

export const trackEvent = (name, properties) => {
  if (typeof window !== 'undefined') {
    posthog.capture(name, properties);
  }
};