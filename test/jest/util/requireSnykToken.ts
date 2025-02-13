const requireSnykToken = (): string => {
  const result =
    process.env.SNYK_TOKEN || // default
    process.env.SNYK_API_TOKEN || // smoke tests
    process.env.TEST_SNYK_TOKEN; // circle ci

  if (!result) {
    throw new Error("No Snyk Token found in test environment.");
  }

  return result;
};

export { requireSnykToken };
