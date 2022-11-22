import Dexie from "dexie";
import {IQuestion} from "./Question";

class AppDatabase extends Dexie {
  questions: Dexie.Table<IQuestion, number>;

  constructor() {
    super("AppDatabase");

    this.version(1).stores(
      {
        questions: 'q_uid, q_id, q_text, q_text_token, q_items, q_items_token, q_answers, q_answers_token, q_variable_ID, a_name,' +
          'a_timestamp, a_annotime, a_certainty, l_attribute1, l_attribute2, l_attribute3, l_topic1, l_topic2, l_topic3, l_concept, p_prediction,' +
          'p_simIDs_sameC, p_simIDs_diffC'
      }
    );

    this.questions = this.table("questions")
  }
}

export var db = new AppDatabase();
