export enum FeatureFlags {
  /**
   * @owner @oscarwroche
   * @feature https://linear.app/onlydust/issue/B-358/fix-unwanted-component-reloads
   * @expiration 2023-02-21
   */
  FIX_TOKEN_RELOAD = "FIX_TOKEN_RELOAD",
  /**
   * @owner @oscarwroche
   * @feature https://linear.app/onlydust/issue/B-384/aaproject-lead-i-dont-see-a-my-projects-tab-anymore
   * @expiration 2023-02-21
   */
  MERGE_MY_PROJECTS = "MERGE_MY_PROJECTS",
}

type FeatureFlagsConfig = Record<FeatureFlags, boolean>;

const featureFlags: FeatureFlagsConfig = {
  FIX_TOKEN_RELOAD: import.meta.env.VITE_FF_FIX_TOKEN_RELOAD === "true",
  MERGE_MY_PROJECTS: import.meta.env.VITE_FF_MERGE_MY_PROJECTS === "true",
};

export const isFeatureEnabled = (feature: keyof FeatureFlagsConfig) => {
  return featureFlags[feature];
};