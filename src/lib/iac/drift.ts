import * as fs from "fs";
import {
  DescribeOptions,
  DriftAnalysis,
  DriftctlExecutionResult,
  GenDriftIgnoreOptions
} from "./types";
import { Policy } from "../policy/find-and-load-policy";
import snykLogoSVG from "./assets/snyk-logo";
import snykFaviconBase64 from "./assets/snyk-favicon";
import { getHumanReadableAnalysis } from "./drift/output";
import { runDriftCTL } from "./drift/driftctl";

export const parseDriftAnalysisResults = (input: string): DriftAnalysis => {
  return JSON.parse(input) as DriftAnalysis;
};

export function driftignoreFromPolicy(policy: Policy | undefined): string[] {
  const excludeSection = "iac-drift";
  if (!policy || !policy.exclude || !(excludeSection in policy.exclude)) {
    return [];
  }
  return policy.exclude[excludeSection];
}

export const updateExcludeInPolicy = (
  policy: Policy,
  analysis: DriftAnalysis,
  options: GenDriftIgnoreOptions
): void => {
  const excludedResources = driftignoreFromPolicy(policy);
  const addResource = res => excludedResources.push(`${res.type}.${res.id}`);

  if (!options["exclude-missing"] && analysis.summary.total_missing > 0) {
    analysis.missing?.forEach(res => addResource(res));
  }

  if (!options["exclude-unmanaged"] && analysis.summary.total_unmanaged > 0) {
    analysis.unmanaged?.forEach(res => addResource(res));
  }

  if (!policy.exclude) {
    policy.exclude = {};
  }

  policy.exclude["iac-drift"] = excludedResources;
};

export async function processAnalysis(
  options: DescribeOptions,
  describe: DriftctlExecutionResult
): Promise<string> {
  if (options.html || options["html-file-output"]) {
    // we use fmt for html output
    const fmtResult = await runDriftCTL({
      options: { ...options, kind: "fmt" },
      input: describe.stdout
    });
    const output = processHTMLOutput(options, fmtResult.stdout);

    if (options.html) {
      // html on stdout
      return output;
    }
    // should return an empty string if we use the html-file-output flag
    return "";
  }

  if (options.json) {
    // json on stdout
    return describe.stdout;
  }

  const analysis = parseDriftAnalysisResults(describe.stdout);
  return getHumanReadableAnalysis(options, analysis);
}

export function processHTMLOutput(
  options: DescribeOptions,
  stdout: string
): string {
  if (options.html) {
    stdout = rebrandHTMLOutput(stdout);
  }

  if (options["html-file-output"]) {
    const data = fs.readFileSync(options["html-file-output"], {
      encoding: "utf8"
    });
    fs.writeFileSync(options["html-file-output"], rebrandHTMLOutput(data));
  }

  return stdout;
}

function rebrandHTMLOutput(data: string): string {
  // Replace favicon
  const faviconReplaceRegex = new RegExp(
    '(<link rel="shortcut icon")(.*)(\\/>)',
    "g"
  );
  data = data.replace(
    faviconReplaceRegex,
    `<link rel="shortcut icon" type="image/x-icon" href="${snykFaviconBase64}" />`
  );

  // Replace HTML title
  const titleReplaceRegex = new RegExp("(<title>)(.*)(<\\/title>)", "g");
  data = data.replace(
    titleReplaceRegex,
    `<title>Snyk IaC drift report</title>`
  );

  // Replace header brand logo
  const logoReplaceRegex = new RegExp(
    '(<div id="brand_logo">)((.|\\r|\\n)*?)(<\\/div>)',
    "g"
  );
  data = data.replace(
    logoReplaceRegex,
    `<div id="brand_logo">${snykLogoSVG}</div>`
  );

  return data;
}
