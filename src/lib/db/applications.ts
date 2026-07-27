import type { ApplicationRecord } from "./schema";

const globalApplications = globalThis as typeof globalThis & {
  nflOwnerApplications?: ApplicationRecord[];
};

export function saveOwnerApplication(application: ApplicationRecord) {
  if (!globalApplications.nflOwnerApplications) {
    globalApplications.nflOwnerApplications = [];
  }

  globalApplications.nflOwnerApplications.unshift(application);
  return application;
}

export function listRuntimeApplications() {
  return globalApplications.nflOwnerApplications ?? [];
}
