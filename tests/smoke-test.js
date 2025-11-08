import http from 'k6/http';
import { check, group, sleep } from 'k6';
import { Trend } from 'k6/metrics';

import { config, buildOptions, getBaseUrl, getSleepDuration } from '../scripts/lib/config.js';
import { buildSummary } from '../scripts/lib/summary.js';

export const options = buildOptions();

const landingDuration = new Trend('landing_page_duration', true);
const contactDuration = new Trend('contact_page_duration', true);

export function setup() {
  return {
    baseUrl: getBaseUrl(),
    sleepDuration: getSleepDuration(),
  };
}

export default function (data) {
  group('Landing page', () => {
    const response = http.get(`${data.baseUrl}${config.endpoints.landing}`);
    landingDuration.add(response.timings.duration);

    check(response, {
      'landing page status is 200': (res) => res.status === 200,
      'landing page has welcome text': (res) => res.body.includes('test.k6.io'),
    });
  });

  group('Contact page', () => {
    const response = http.get(`${data.baseUrl}${config.endpoints.contact}`);
    contactDuration.add(response.timings.duration);

    check(response, {
      'contact page status is 200': (res) => res.status === 200,
      'contact page shows form': (res) => res.body.includes('Contact us'),
    });
  });

  sleep(data.sleepDuration);
}

export function handleSummary(data) {
  return buildSummary(data);
}
