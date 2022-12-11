import { SonarQubeIssueTypes } from '../types/types';
import { Result } from 'sarif';

export const SONAR_URLS = {
  login: 'api/authentication/login',
  validate: 'api/authentication/validate',
  project: {
    create: 'api/projects/create',
    delete: 'api/projects/delete',
  },
  issues: {
    search: 'api/issues/search',
  },
  activity: {
    status: 'api/ce/activity_status',
  },
};

export const TYPE_LEVEL_MAP: Record<SonarQubeIssueTypes, Result.level> = {
  BUG: 'error',
  VULNERABILITY: 'error',
  CODE_SMELL: 'warning',
};
