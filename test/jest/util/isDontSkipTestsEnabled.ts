export const isDontSkipTestsEnabled = (): boolean => {
  const dontSkip = process.env.TEST_SNYK_DONT_SKIP_ANYTHING == "1";
  return dontSkip;
};
