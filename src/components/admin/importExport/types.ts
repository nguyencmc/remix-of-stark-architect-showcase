export interface RawQuestionInput {
  question_text?: string;
  question?: string;
  text?: string;
  option_a?: string;
  optionA?: string;
  a?: string;
  option_b?: string;
  optionB?: string;
  b?: string;
  option_c?: string;
  optionC?: string;
  c?: string;
  option_d?: string;
  optionD?: string;
  d?: string;
  option_e?: string;
  optionE?: string;
  e?: string;
  option_f?: string;
  optionF?: string;
  f?: string;
  option_g?: string;
  optionG?: string;
  g?: string;
  option_h?: string;
  optionH?: string;
  h?: string;
  options?: string[];
  correct_answer?: string;
  correctAnswer?: string;
  answer?: string;
  explanation?: string;
  [key: string]: unknown;
}

export interface Question {
  id?: string;
  question_text: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  option_e: string;
  option_f: string;
  option_g: string;
  option_h: string;
  correct_answer: string;
  explanation: string;
  question_order: number;
}

export interface ImportExportQuestionsProps {
  questions: Question[];
  onImport: (questions: Question[]) => void;
}
