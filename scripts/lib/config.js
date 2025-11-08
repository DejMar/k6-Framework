const configData = JSON.parse(open('../../config/default.json'));

const frozenConfig = Object.freeze(configData);

export const config = frozenConfig;

export function getBaseUrl() {
  return __ENV.BASE_URL || config.baseUrl;
}

export function getSleepDuration() {
  const sleepOverride = Number(__ENV.SLEEP_INTERVAL);
  if (!Number.isNaN(sleepOverride) && sleepOverride > 0) {
    return sleepOverride;
  }

  return config.sleepBetweenIterations || 1;
}

export function buildOptions(overrides = {}) {
  return {
    ...config.options,
    ...overrides,
    thresholds: {
      ...config.options.thresholds,
      ...(overrides.thresholds || {}),
    },
  };
}
