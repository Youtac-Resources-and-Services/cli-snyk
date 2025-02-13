import { IacProjectType } from "../../../iac/constants";
import { State } from "../../../iac/test/v2/scan/policy-engine";
import { AnnotatedIacIssue } from "../../../snyk-test/iac-test-result";
import { SEVERITY } from "../../../snyk-test/legacy";
import { IacOutputMeta } from "../../../types";

export interface IacTestData {
  resultsBySeverity: FormattedOutputResultsBySeverity;
  metadata: IacOutputMeta | undefined;
  counts: IacTestCounts;
}

export type FormattedOutputResultsBySeverity = {
  [severity in SEVERITY]?: FormattedOutputResult[];
};

export type FormattedOutputResult = {
  issue: Issue;
  projectType: IacProjectType | State.InputTypeEnum;
  targetFile?: string;
};

export interface IacTestCounts {
  ignores: number;
  filesWithIssues: number;
  filesWithoutIssues: number;
  issues: number;
  issuesBySeverity: { [severity in SEVERITY]: number };
  contextSuppressedIssues?: number;
}

export type IaCTestFailure = {
  filePath: string;
  failureReason: string | undefined;
};

export type IaCTestWarning = {
  filePath: string;
  warningReason: string | undefined;
  term: string | undefined;
  modules: string[] | undefined;
  module: string | undefined;
  expressions: string[] | undefined;
};

export type Issue = Pick<
  AnnotatedIacIssue,
  | "id"
  | "title"
  | "severity"
  | "issue"
  | "impact"
  | "resolve"
  | "remediation"
  | "lineNumber"
  | "isGeneratedByCustomRule"
  | "documentation"
  | "cloudConfigPath"
>;
