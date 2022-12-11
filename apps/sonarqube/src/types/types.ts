export type Issue = {
  key: string;
  rule: string;
  severity: SonarQubeSeverity;
  component: string;
  project: string;
  message: string;
  type: SonarQubeIssueTypes;
  textRange?: {
    startLine: number;
    endLine: number;
    startOffset: number;
    endOffset: number;
  };
};

export type SonarQubeSeverity = 'BLOCKER' | 'CRITICAL' | 'MAJOR' | 'MINOR' | 'INFO';

export type SonarQubeIssueTypes = 'BUG' | 'VULNERABILITY' | 'CODE_SMELL';
