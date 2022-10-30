export type FORMATS = 'sarif' | 'original';

export type LANGUAGES = 'javascript' | 'java';

export type AnalysisResult = {
  report: string;
  dataToCleanup?: Record<string, string>;
};
