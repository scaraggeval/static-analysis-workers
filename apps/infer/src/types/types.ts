export type JsonTraceItem = {
  level: number;
  filename: string;
  line_number: number;
  column_number: number;
  description: string;
  node_tags: NodeTag[];
};

export type NodeTag = {
  tag: string;
  value: string;
};

export type loc = {
  file: string;
  lnum: number;
  cnum: number;
  enum: number;
};

export type JsonBug = {
  bug_class: string;
  kind: string;
  bug_type: string;
  doc_url?: string;
  qualifier: string;
  severity: string;
  visibility: string;
  line: number;
  column: number;
  procedure: string;
  procedure_id: string;
  procedure_start_line: number;
  file: string;
  bug_trace: JsonTraceItem[];
  key: string;
  node_key: string;
  hash: string;
  dotty?: string;
  infer_source_loc?: loc;
  bug_type_hum: string;
  linters_def_file?: string;
  traceview_id?: number;
  censored_reason: string;
  access?: string;
};

export type InferReport = JsonBug[];
