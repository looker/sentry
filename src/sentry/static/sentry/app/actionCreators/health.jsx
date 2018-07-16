const BASE_URL = org => `/organizations/${org.slug}/health/`;

export const doHealthRequest = (
  tag,
  api,
  {organization, projects, environments, period, includePrevious}
) => {
  if (!api) return Promise.reject(new Error('API client not available'));

  return api.requestPromise(`${BASE_URL(organization)}`, {
    query: {
      tag,
      statsPeriod: period,
      project: projects,
    },
  });
};

/**
 * Fetches number of errors from all `projects` in "period"
 *
 *
 */
export function getErrorsByRelease(api, params = {}) {
  return doHealthRequest('releases/', api, params);
}
