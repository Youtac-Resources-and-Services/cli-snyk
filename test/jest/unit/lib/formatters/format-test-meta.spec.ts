import stripAnsi = require("strip-ansi");

import { formatTestMeta } from "../../../../../src/lib/formatters/format-test-meta";
import { TestResult } from "../../../../../src/lib/snyk-test/legacy";
import { ShowVulnPaths } from "../../../../../src/lib/types";

describe("formatTestMeta", () => {
  it("with TargetFile", () => {
    const testResult: TestResult = {
      targetFile: "package.json",
      packageManager: "npm",
      vulnerabilities: [],
      dependencyCount: 8,
      policy: "",
      licensesPolicy: null,
      ignoreSettings: null,
      ok: true,
      org: "my-org",
      isPrivate: false,
      summary: "No known vulnerabilities"
    };
    const options = {
      path: "/path/to/test",
      showVulnPaths: "all" as ShowVulnPaths
    };
    expect(stripAnsi(formatTestMeta(testResult, options))).toMatchSnapshot();
  });

  it("without TargetFile & with license Policy", () => {
    const testResult: TestResult = {
      packageManager: "pip",
      vulnerabilities: [],
      dependencyCount: 8,
      policy: "",
      licensesPolicy: {
        severities: {},
        orgLicenseRules: {
          "AGPL-1.0": {
            licenseType: "AGPL-1.0",
            severity: "high",
            instructions: ""
          }
        }
      },
      ignoreSettings: null,
      ok: true,
      org: "my-org",
      isPrivate: false,
      summary: "No known vulnerabilities"
    };
    const options = {
      path: "/path/to/test",
      showVulnPaths: "all" as ShowVulnPaths
    };
    expect(stripAnsi(formatTestMeta(testResult, options))).toMatchSnapshot();
  });
  it("Docker", () => {
    const testResult: TestResult = {
      vulnerabilities: [],
      dependencyCount: 8,
      packageManager: "deb" as any, // this is returned from the backend after test
      platform: "linux/amd64",
      policy: "",
      docker: {
        baseImage: "debian:latest"
      },
      licensesPolicy: null,
      ignoreSettings: null,
      ok: true,
      org: "my-org",
      isPrivate: false,
      summary: "No known vulnerabilities"
    };
    const options = {
      path: "my-image:latest",
      docker: true,
      showVulnPaths: "all" as ShowVulnPaths
    };
    expect(stripAnsi(formatTestMeta(testResult, options))).toMatchSnapshot();
  });
  it("with filesystem policy", () => {
    const testResult: TestResult = {
      packageManager: "pip",
      vulnerabilities: [],
      dependencyCount: 8,
      filesystemPolicy: true,
      policy:
        "# Snyk (https://snyk.io) policy file, patches or ignores known vulnerabilities.\nversion: v1.13.1\nignore: {}\n# patches apply the minimum changes required to fix a vulnerability\npatch:\n  'npm:qs:20170213':\n    - npm-package-with-git-url > qs:\n        patched: '2018-11-04T12:47:13.696Z'\n",
      licensesPolicy: {
        severities: {},
        orgLicenseRules: {
          "AGPL-1.0": {
            licenseType: "AGPL-1.0",
            severity: "high",
            instructions: ""
          }
        }
      },
      ignoreSettings: null,
      ok: true,
      org: "my-org",
      isPrivate: false,
      summary: "No known vulnerabilities"
    };
    const options = {
      path: "/path/to/test",
      showVulnPaths: "all" as ShowVulnPaths
    };
    expect(stripAnsi(formatTestMeta(testResult, options))).toMatchSnapshot();
  });
});
