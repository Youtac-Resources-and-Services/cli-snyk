import { inspectors, Spec } from "./inspectors";
import { MissingTargetFileError } from "../../errors/missing-targetfile-error";
import gemfileLockToDependencies = require("./gemfile-lock-to-dependencies");
import * as get from "lodash.get";
import { MultiProjectResult } from "@snyk/cli-interface/legacy/plugin";
import * as types from "../types";

export async function inspect(
  root: string,
  targetFile: string,
  options: types.Options = {}
): Promise<MultiProjectResult> {
  if (!targetFile) {
    throw MissingTargetFileError(root);
  }
  const specs = await gatherSpecs(root, targetFile, options);

  return {
    plugin: {
      name: "bundled:rubygems",
      runtime: "unknown"
    },
    scannedProjects: [
      {
        depTree: {
          name: specs.packageName,
          targetFile: specs.targetFile,
          dependencies: getDependenciesFromSpecs(specs)
        }
      }
    ]
  };
}

function getDependenciesFromSpecs(specs) {
  const gemfileLockBase64 = get(specs, "files.gemfileLock.contents");
  const gemspecBase64 = get(specs, "files.gemspec.contents");
  const contents = Buffer.from(
    gemfileLockBase64 || gemspecBase64,
    "base64"
  ).toString();
  const dependencies = gemfileLockToDependencies(contents);
  return dependencies;
}

async function gatherSpecs(
  root: string,
  targetFile: string,
  options: types.Options
): Promise<Spec> {
  for (const inspector of inspectors) {
    if (inspector.canHandle(targetFile)) {
      return await inspector.gatherSpecs(root, targetFile, options);
    }
  }

  throw new Error(`Could not handle rubygems file: ${targetFile}`);
}
