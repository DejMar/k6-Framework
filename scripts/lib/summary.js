import { textSummary } from 'https://jslib.k6.io/k6-summary/0.0.4/index.js';
import { htmlReport } from 'https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js';

import { config } from './config.js';

export function buildSummary(data) {
  const outputs = {
    stdout: textSummary(data, { indent: ' ', enableColors: true }),
  };

  if (config.summary?.json) {
    outputs[config.summary.json] = JSON.stringify(data, null, 2);
  }

  if (config.summary?.html) {
    outputs[config.summary.html] = htmlReport(data);
  }

  return outputs;
}
