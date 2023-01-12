import { PathLike } from 'fs';
import { Log } from 'sarif';

export type Language = 'javascript' | 'java' | 'c';

export type AnalysisResult = {
  report: Log;
  dataToCleanup: Record<string, PathLike> | null;
};
