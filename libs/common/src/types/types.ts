import { Log } from 'sarif';

export type Language = 'javascript' | 'java' | 'c';

export type AnalysisResult = {
  report: Log;
};
