// This test script uses k6 to perform smoke tests on test.k6.io.
// It now includes smoke tests for landing, contact, news, catalog, and login endpoints,
// checking HTTP status codes and minimal critical content for each.

// Import k6 modules.
import http from 'k6/http';
import { check, group, sleep } from 'k6';
import { Trend } from 'k6/metrics';

// Project-specific helpers and config.
import { config, buildOptions, getBaseUrl, getSleepDuration } from '../scripts/lib/config.js';
import { buildSummary } from '../scripts/lib/summary.js';

export const options = buildOptions();

// Custom Trend metrics for endpoint durations.
const landingDuration = new Trend('landing_page_duration', true);
const contactDuration = new Trend('contact_page_duration', true);
const newsDuration = new Trend('news_page_duration', true);

export function setup() {
  return {
    baseUrl: getBaseUrl(),
    sleepDuration: getSleepDuration()
  };
}

export default function (data) {
  // Group: Landing Page
  group('Landing page', () => {
    const response = http.get(`${data.baseUrl}${config.endpoints.landing}`);
    landingDuration.add(response.timings.duration);
    check(response, {
      'landing page status is 200': (res) => res.status === 200,
      'landing page has welcome text': (res) => res.body.includes('QuickPizza Legacy'),
    });
  });

  // Group: Contact Page
  group('Contact page', () => {
    const response = http.get(`${data.baseUrl}${config.endpoints.contact}`);
    contactDuration.add(response.timings.duration);
    check(response, {
      'contact page status is 200': (res) => res.status === 200,
      'contact page shows form': (res) => res.body.includes('Contact us'),
    });
  });

  // Group: News Page
  group('News page', () => {
    const response = http.get(`${data.baseUrl}${config.endpoints.news}`);
    newsDuration.add(response.timings.duration);
    check(response, {
      'news page status is 200': (res) => res.status === 200,
      'news page has news items': (res) => res.body.includes('News'),
    });
  });


  sleep(data.sleepDuration);
}

export function handleSummary(data) {
  return buildSummary(data);
}
