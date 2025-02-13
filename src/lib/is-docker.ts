const fs = require("fs");

export function isDocker(): boolean {
  return hasDockerEnv() || hasDockerCGroup();
}
function hasDockerEnv() {
  try {
    fs.statSync("/.dockerenv");
    return true;
  } catch (_) {
    return false;
  }
}

function hasDockerCGroup() {
  try {
    return fs.readFileSync("/proc/self/cgroup", "utf8").includes("docker");
  } catch (_) {
    return false;
  }
}
