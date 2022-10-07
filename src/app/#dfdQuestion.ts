export interface IQuestion {
  q_uid: number;
  q_id: string;
  q_text: string;
  q_text_token: Array<[string, number, number]>;
  q_items: string;
  q_items_token: Array<[string, number, number]>;
  q_answers: string;
  q_answers_token: Array<Array<string>>;
  q_variable_IDs: Array<string>;
  a_name: any;
  a_timestamp: any;
  a_annotime: any;
  a_certainty: number;
  l_attribute1: any;
  l_attribute2: any;
  l_attribute3: any;
  l_topic1: any;
  l_topic2: any;
  l_topic3: any;
  l_topic4: any;
  l_concept: any;
  l_focus: any;
  l_tempus: any;
  l_period: any;
  p_prediction: any;
  p_simIDs_sameC: Array<string>;
  p_simIDs_diffC: Array<string>;

}

export class Question implements IQuestion {
  q_uid: number;
  q_id: string;
  q_text: string;
  q_text_token: Array<[string, number, number]>;
  q_items: string;
  q_items_token: Array<[string, number, number]>;
  q_answers: string;
  q_answers_token: Array<Array<string>>;
  q_variable_IDs: Array<string>;
  a_name: any;
  a_timestamp: any;
  a_annotime: any;
  a_certainty: number;
  l_attribute1: any;
  l_attribute2: any;
  l_attribute3: any;
  l_topic1: any;
  l_topic2: any;
  l_topic3: any;
  l_topic4: any;
  l_concept: any;
  l_focus: any;
  l_tempus: any;
  l_period: any;
  p_prediction: any;
  p_simIDs_sameC: Array<string>;
  p_simIDs_diffC: Array<string>;

  constructor(q_uid: number, q_id: string, q_text: string, q_text_token: Array<[string, number, number]>, q_items: string, q_items_token: Array<[string, number, number]>, q_answers: string, q_answers_token: Array<Array<string>>, q_variable_IDs: Array<string>, a_name: any, a_timestamp: any, a_annotime: any, a_certainty: number, l_attribute1: any, l_attribute2: any, l_attribute3: any, l_topic1: any, l_topic2: any, l_topic3: any, l_topic4: any, l_concept: any, l_focus:any, l_tempus:any, l_period:any, p_prediction: any, p_simIDs_sameC: Array<string>, p_simIDs_diffC: Array<string>) {
    this.q_uid = q_uid;
    this.q_id = q_id;
    this.q_text = q_text;
    this.q_text_token = q_text_token;
    this.q_items = q_items;
    this.q_items_token = q_items_token;
    this.q_answers = q_answers;
    this.q_answers_token = q_answers_token;
    this.q_variable_IDs = q_variable_IDs;
    this.a_name = a_name;
    this.a_timestamp = a_timestamp;
    this.a_annotime = a_annotime;
    this.a_certainty = a_certainty;
    this.l_attribute1 = l_attribute1;
    this.l_attribute2 = l_attribute2;
    this.l_attribute3 = l_attribute3;
    this.l_topic1 = l_topic1;
    this.l_topic2 = l_topic2;
    this.l_topic3 = l_topic3;
    this.l_topic4 = l_topic4;
    this.l_concept = l_concept;
    this.l_focus = l_focus;
    this.l_tempus = l_tempus;
    this.l_period = l_period;
    this.p_prediction = p_prediction;
    this.p_simIDs_sameC = p_simIDs_sameC;
    this.p_simIDs_diffC = p_simIDs_diffC;
  }

  clone() {
    return new Question(this.q_uid, this.q_id, this.q_text, this.q_text_token, this.q_items, this.q_items_token, this.q_answers, this.q_answers_token, this.q_variable_IDs,
      this.a_name, this.a_timestamp, this.a_annotime, this.a_certainty,
      this.l_attribute1, this.l_attribute2, this.l_attribute3, this.l_topic1, this.l_topic2, this.l_topic3, this.l_topic4, this.l_concept, this.l_focus, this.l_tempus, this.l_period,
      this.p_prediction, this.p_simIDs_sameC, this.p_simIDs_diffC);
  }

  static stringify(obj: Question, delimiter = '$$$'): string {
    for (let i = 0; i < obj.q_text_token.length; i += 1) {
      obj.q_text_token[i].splice(2,1);
    }
    const text_token = Question.doubleSerialise(obj.q_text_token);
    for (let i = 0; i < obj.q_items_token.length; i += 1) {
      obj.q_items_token[i].splice(2,1);
    }
    const items_token = Question.doubleSerialise(obj.q_items_token, ",", ";");

    const answers_token = Question.doubleSerialise(obj.q_answers_token)

    return obj.q_uid.toString() + delimiter +
      obj.q_id.toString() + delimiter +
      obj.q_text + delimiter +
      text_token + delimiter +
      obj.q_items + delimiter +
      items_token + delimiter +
      obj.q_answers + delimiter +
      answers_token + delimiter +
      Question.serialise(obj.q_variable_IDs) + delimiter +
      obj.a_name + delimiter +
      obj.a_timestamp + delimiter +
      obj.a_annotime + delimiter +
      obj.a_certainty + delimiter +
      obj.l_attribute1 + delimiter +
      obj.l_attribute2 + delimiter +
      obj.l_attribute3 + delimiter +
      obj.l_topic1 + delimiter +
      obj.l_topic2 + delimiter +
      obj.l_topic3 + delimiter +
      obj.l_topic4 + delimiter +
      obj.l_concept + delimiter +
      obj.l_focus + delimiter +
      obj.l_tempus + delimiter +
      obj.l_period + delimiter +
      obj.p_prediction + delimiter +
      Question.serialise(obj.p_simIDs_sameC) + delimiter +
      Question.serialise(obj.p_simIDs_diffC) + '\n'
  }

  static serialise(ar, delimiter = ';') {
    let s = "";
    if (ar.length > 0) {
      for (let i = 0; i < ar.length - 1; i += 1) {
        s = s + ar[i] + delimiter;
      }
      s = s + ar[ar.length - 1];
    }
    return s
  }

  static doubleSerialise(arar, delimiter_outer = ';', delimiter_inner = ',') {
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


