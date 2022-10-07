export interface IQuestion {
  q_uid: number;
  q_variable_ID: string;
  var_label: string;
  q_text: string;
  q_items: Array<string>;
  q_answers: Array<string>;
  sub_question: string;
  themes: Array<string>;
  free_topics: Array<string>;
  comment: string;
  a_name: string;
}

export class Question implements IQuestion {
  q_uid: number;
  q_variable_ID: string;
  var_label: string;
  q_text: string;
  q_items: Array<string>;
  q_answers: Array<string>;
  sub_question: string;
  themes: Array<string>;
  free_topics: Array<string>;
  comment: string;
  a_name: string;

  constructor(q_uid: number, q_variable_ID: string, var_label:string, q_text: string, q_items: Array<string>, q_answers: Array<string>,sub_question: string, themes: Array<string>, free_topics: Array<string>, comment:string,a_name: string) {
    this.q_uid = q_uid;
    this.q_text = q_text;
    this.q_items = q_items;
    this.q_answers = q_answers;
    this.q_variable_ID = q_variable_ID;
    this.var_label = var_label;
    this.sub_question = sub_question;
    this.themes = themes;
    this.free_topics = free_topics;
    this.comment = comment;
    this.a_name = a_name;

  }
  

  clone() {
    return new Question(this.q_uid,this.q_variable_ID, this.var_label,this.q_text, this.q_items, this.q_answers,this.sub_question,	this.themes,	this.free_topics,	this.comment,this.a_name);
  }

  static stringify(obj: Question, delimiter = ';'): string {
    
    const free_topics = Question.doubleSerialise(obj.free_topics, "&", "_");
    return obj.q_uid.toString() + delimiter +
    obj.q_variable_ID + delimiter +
    obj.var_label + delimiter +
      obj.q_text + delimiter +
      Question.serialise(obj.q_items) + delimiter +
      Question.serialise(obj.q_answers) + delimiter +
      obj.sub_question + delimiter +
      Question.serialise(obj.themes) + delimiter +
      free_topics + delimiter +
      obj.comment + delimiter +
      obj.a_name+'\n'
  }

  static serialise(ar, delimiter = '&') {
    let s = "";
    if (ar.length > 0) {
      for (let i = 0; i < ar.length - 1; i += 1) {
        s = s + ar[i] + delimiter;
      }
      s = s + ar[ar.length - 1];
    }
    return s
  }

  static doubleSerialise(arar, delimiter_outer = '&', delimiter_inner = '_') {
    let ss = '';
    if (arar.length > 0) {
      for (let i = 0; i < arar.length - 1; i += 1) {
        ss = ss + Question.serialise(arar[i], delimiter_inner) + delimiter_outer;
      }
      ss = ss + Question.serialise(arar[arar.length - 1], delimiter_inner);
    }
    return ss
  }

}


