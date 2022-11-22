import {Component, OnInit} from '@angular/core';
import {Question} from './Question';
import * as FileSaver from "file-saver";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {debounceTime, map, startWith, tap} from "rxjs/operators";
import {Options} from 'ng5-slider';
import {db} from "./Database";
import {topic} from "./Dictionaries";
import {subtopic} from "./Dictionaries";
import { PostService } from './services/post.service';
import { ResponseType } from '@angular/http';
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs';
import { catchError } from 'rxjs/operators';
import { throwError, concat, of } from 'rxjs';
import { KeywordService } from 'src/app/services/keyword.service';



@Component({
selector: 'app-root',
templateUrl: './app.component.html',
styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  topics:any;
  myControl = new FormControl('');
  autoOptions: string[] = [];
  autoOptionNoResult : boolean = false;
  filteredAutoOptions: Observable<string[]>; 
  keyword = {
    keywordText: '',
    theme: '',
    theme_uri: ''
  };
  keyword_submitted;

constructor(private http: HttpClient,private service:PostService, private keywordService: KeywordService) {
    this.http = http
  } 

  updateIfPresent = false;
  resetDB = true;

  file: any;
  name: string = "";
  result: any;
  loadResult: boolean = false;
  currIndex: number = 0;
  currIndexProgress: number = 0;
  indexAll: Array<number> = [];
  currentAnnoCounter = 0;
  startAnnoTime: any;
  questions: Array<Question> = [];
  //currentQuestion: Question;
  //currentQuestion = new Question(-1, '', '', [], '', [], '', [], [], '', '', 0, 5, '', '', '', '', '', '', '', '', 'Selbstfokus', '', '', '', [], []);
  currentQuestion = new Question(-1, '', '','',[],[],'', [], [], '','');
  //currentQuestionUnprocessed: boolean = false;
  //currentTextUnprocessed: boolean = false;
  q_answers_token_list: Array<Array<string>> = [];

  requestedGoToIndex:number = 0;

  changedHighlighting: boolean = false;
  clickedSlider = false;
  additionalTopic: boolean = false;

  topic_copy: Array<string> = [];
  topic_query: string = "";
  subtopics: Array<string> = [];
  highlighting: Array<number> = [];

  wrongPreprocessingOrLanguageList = [];

  pauseTimeBegin: number = 0;
  pauseTimeTotal: number = 0;
  paused: boolean = false;

  devMode: boolean = false;

  options: Options = {
    floor: 0,
    ceil: 10,
    step: 1,
    showTicks: true,
    showTicksValues: true,
    ticksArray: [0, 5, 10],
    getTickColor: (value: number): string => {
      return 'lightsteelblue';
    },

    getPointerColor: (value, pointerType): string => {
      return 'lightsteelblue';
    }
  };

  fileChanged(e) {
    this.file = e.target.files[0];
  }

  fileSave() {
    db.questions.toArray().then(res => {
      let outputStrAr = [];
      let notInDbQuestions: Array<Question> = this.questions.filter(q => res.filter(q1 => q1.q_uid == q.q_uid).length == 0);
      let allQs = res.concat(notInDbQuestions).map(qes => Question.stringify(<Question>qes));
      const blob = new Blob(allQs, {type: "text/plain;charset=utf-8"});
      FileSaver.saveAs(blob, "annoThemFile_" + this.name.toString() + "_" + new Date().toLocaleString() + ".txt");
    }, err => {
      throw err;
    });
  }

  addToProblemQList () {
    console.log('problem with text noted for uid', this.currentQuestion.q_uid);
    console.log('problems list before adding', this.wrongPreprocessingOrLanguageList);
    if (!this.wrongPreprocessingOrLanguageList.includes(this.currentQuestion.q_uid)) this.wrongPreprocessingOrLanguageList.push(this.currentQuestion.q_uid);
    console.log('problems list after adding', this.wrongPreprocessingOrLanguageList);
  }

  inProblemQList () {
      if (this.wrongPreprocessingOrLanguageList.includes(this.currentQuestion.q_uid)) return true;
      return false;
  }

  clickSlider () {
    this.clickedSlider = true;
    console.log("slider clicked", this.clickedSlider);
  }
/*
  setTopic (tt: string) {
      tt = tt.trim();

      if (this.additionalTopic) {
        this.currentQuestion.l_topic3 = tt;
      }else{
        this.currentQuestion.l_topic1 = tt;
      }

      console.log ('set new topic:', tt);
      // set subtopics in subtopic list
      this.setSubtopicsList (tt);
  }

  setSubtopicsList (tt: string) {
      console.log ('find index in topic array, index:', topic.indexOf(tt));
      if (topic.indexOf(tt)>=0) {this.subtopics = subtopic[topic.indexOf(tt)];}
      console.log ('subtopics list updated:', this.subtopics);

      // check if current subtopic matches topic, if not delete
      if (this.additionalTopic) {
        if (!this.subtopics.includes(this.currentQuestion.l_topic4)) {
          this.currentQuestion.l_topic4 = '';
        }
      }else{
        if (!this.subtopics.includes(this.currentQuestion.l_topic2)) {
          this.currentQuestion.l_topic2 = '';
        }
      }
  }

  setSubtopic (st: string) {
      if (this.additionalTopic) {
        this.currentQuestion.l_topic4 = st;
      }else{
        this.currentQuestion.l_topic2 = st;
      }
  }
*/
  ngOnInit(): void {
    this.filteredAutoOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      map(value => this._filter(value || '')),
    );
  }

  addToThemes(theme){
    this.currentQuestion.themes.push(theme);
    console.log(this.currentQuestion.themes);
  }
 


  addToTopic(event: any,theme){
    // alert(event.target.value);
    if (theme) {this.currentQuestion.free_topics.push(theme+'_'+event.target.value)}
    else {
      this.currentQuestion.free_topics.push(event.target.value)
    }
    

      console.log(this.currentQuestion.free_topics);
      
  }
 
  


  // removeFromTopics(free_topic){

  //   //   const index = this.currentQuestion.themes.indexOf(free_topic);
  //   //   if (index !== -1) {
  //   //     this.currentQuestion.themes.splice(index, 1);
  //   //     console.log(free_topic);
        
  //   //   };
     
      
  //   // }



  
  
  removeFromThemes(theme){

    const index = this.currentQuestion.themes.indexOf(theme);
    if (index !== -1) {
      this.currentQuestion.themes.splice(index, 1);
    };
  }

  


  removeFromTopics(free_topic){
    // alert('halll');
    console.log(this.currentQuestion.free_topics);
    
    const index = this.currentQuestion.free_topics.indexOf(free_topic);
    if (index !== -1) {
      this.currentQuestion.free_topics.splice(index, 1);
      console.log("azade");
      
    };
    console.log(this.currentQuestion.free_topics);

  }
  

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    this.autoOptions = [];
    this.service.getPosts(filterValue).toPromise().then(response => {
        this.topics = response["results"]; // here you get the result
        if (this.topics == null || this.topics.length == 0 ) {
          if (filterValue!='') this.autoOptionNoResult = true;
        }
        else {
          this.autoOptionNoResult = false;
          this.topics.forEach((element, index, array) => {
              if (element["prefLabel"]!='' && !this.autoOptions.includes(element["prefLabel"]))  this.autoOptions.push(element["prefLabel"]);
          });
        }
      });
    return this.autoOptions = this.autoOptions.filter(option => option.toLowerCase().includes(filterValue)); 
  }

  loadDocumentFromFile(filename: string) {
    return this.http.get(filename, {
      responseType: 'text', headers: new HttpHeaders({
        'Access-Control-Allow-Origin': '*'
      })
    }).pipe(map(data => {
      return data.split("\n");
    }));
  }

  uploadDocument(startAtPrevIndex = false) {
    this.loadResult = true;
    if (this.resetDB) db.questions.clear();
    const fileReader = new FileReader();
    fileReader.onload = (e) => {
      this.result = fileReader.result;
      this.processResult(this.result);
      this.loadResult = false;
    };
    fileReader.readAsText(this.file);
  }

  
/*
  toggleAnswerListLength() {
    if (this.currentQuestion.q_answers_token.length > 5 && this.q_answers_token_list.length <= 5) {
      this.q_answers_token_list = [];
      for (let i = 0; i < this.currentQuestion.q_answers_token.length; i += 1) {
        this.q_answers_token_list.push(this.currentQuestion.q_answers_token[i]);
      }
    } else if (this.q_answers_token_list.length > 5) {
      this.q_answers_token_list = [];
      for (let i = 0; i < Math.min(5, this.currentQuestion.q_answers_token.length); i += 1) {
        this.q_answers_token_list.push(this.currentQuestion.q_answers_token[i]);
      }
    }
  }*/

  searchArrayForSubstring(subs: string, arr = []) {
    let outp = [];
    arr.forEach(element => {
      if (element.toLowerCase().search(subs.toLowerCase()) != -1) {
        outp.push(element);
      }
    });
    return outp;
  }
  /*
  highlightWord(wi, qPart='qText') {
    if (qPart==='qText') {
      console.log("request to change word in qText at index: ", wi);
      this.currentQuestion.q_text_token[wi][1] = Math.abs(this.currentQuestion.q_text_token[wi][1]-1);
      //console.log("adapted word tuple: ", this.currentQuestion.q_text_token[wi]);
      //console.log('questions[this.currIndex]:', this.questions[this.currIndex].q_text_token[wi]);
      this.changedHighlighting = true;
    } else if (qPart==='qItem') {
      console.log("request to change word in qItem at index: ", wi);
      this.currentQuestion.q_items_token[wi][1] = Math.abs(this.currentQuestion.q_items_token[wi][1]-1);
      //console.log("adapted word tuple: ", this.currentQuestion.q_items_token[wi]);
      //console.log('questions[this.currIndex]:', this.questions[this.currIndex].q_items_token[wi]);
      this.changedHighlighting = true;
    }
  }*/

  getAllIndices(arr, val) {
    let indices = [];
    for(let i = 0; i < arr.length; i++) {
      if (arr[i][0] === val) indices.push(i);
    }
    return indices;
  }


  processResult(result: string, startAtPrevIndex = false) {
    console.log('start processing file input');
    const lines = result.split('\n').map(line => {
      return line.split(';');
    });
    const header = lines[0];
    lines.shift();
    let q_uid:number;
    let q_variable_ID:string;
    let var_label:string;
    let q_text:string;
    let q_items: Array<string>;
    let q_answers: Array<string>;
    let sub_question: string;
    let themes: Array<string>;
    let free_topics : Array<string>;
    let comment: string;
    let a_name: string;
    lines.filter(line => (line.length >= 5 && line.length <= 27) ).forEach(line => {
      
      let ind = 0;
      for (let columnName in header)
      {
        if (header[columnName] == 'q_uid')  q_uid = Number(line[ind]);
        else if (header[columnName] == 'q_variable_ID') q_variable_ID = line[ind];
        else if (header[columnName] == 'var_label') var_label = line[ind];
        else if (header[columnName] == 'q_text') q_text = line[ind];
        else if (header[columnName] == 'q_items') q_items = line[ind].split('&');
        else if (header[columnName] == 'q_answers') q_answers = line[ind].split('&');
        else if (header[columnName] == 'sub_question') sub_question = line[ind];
        else if (header[columnName] == 'themes') themes = line[ind].split('&');
        else if (header[columnName] == 'free_topics') free_topics = line[ind].split('&');
        else if (header[columnName] == 'comment')comment = line[ind];
        else if (header[columnName] == 'a_name')a_name = line[ind];
        ind = ind +1;
      }
      /*
      const q_uid: number = +line[ind];
      const q_variable_ID = line[++ind];
      const var_label = line[++ind];
      const q_text: string = line[++ind];
      const q_items = line[++ind].split('&');
      const q_answers = line[++ind].split('&');
      const sub_question: string = line[++ind];
      const themes = line[++ind].split('&');
      const free_topics = line[++ind].split('&');
      const comment: string = line[++ind];
      const a_name: string = line[++ind];*/
      this.questions.push(new Question(q_uid,q_variable_ID, var_label,q_text, q_items, q_answers,sub_question,	themes,	free_topics,	comment,a_name ));
      this.indexAll.push(q_uid); 

    });

    this.currIndex = 0;
    this.loadNewQuestion(this.currIndex, false);

    console.log("done")

  }

  annoDB_AddUpdate(questElem: Question, update = true) {

    let k = db.questions.get(questElem.q_uid).then(res => {
      if (!res) {
        db.questions.put(questElem).then(r => {
          console.log("put element in db ", questElem.q_uid) 
        });
      } else {
        db.questions.update(questElem.q_uid, questElem).then(
          () => {
            console.log('updated question', questElem.q_uid);
          },
          error => {
            console.log('error when updating existing question', error);
          });
      }
    });

  }

  goToIndex() {
    console.log('requested go to index', this.requestedGoToIndex);
    this.loadNewQuestion(this.requestedGoToIndex - this.currIndex);
  }



  loadNewQuestion(plusMinusIndex: number, saveCurrent = true): void {
    // save current question
    if (saveCurrent) this.saveCurrQuestion();
    // get index of requested question
    let targetQuestIndex = this.currIndex + plusMinusIndex;
    if (targetQuestIndex > this.questions.length - 1) targetQuestIndex = this.questions.length - 1;
    if (targetQuestIndex < 0) targetQuestIndex = 0;
    //this.currIndex = targetQuestIndex;

    // load requested question
    console.log('request new question with index', this.indexAll[targetQuestIndex]);
    db.questions.get(this.indexAll[targetQuestIndex]).then(res => {
      if (!res) {
        let question = this.questions[targetQuestIndex].clone();
        db.questions.put(question).then(pr => {
          console.log("saved question to db ", question.q_uid);
        });
        this.currentQuestion = question;
      } else {
        this.currentQuestion = <Question>res;
      }
      this.currIndex = targetQuestIndex;
      this.currIndexProgress = Math.round(this.currIndex*100/this.questions.length);
      console.log ('this.currIndexProgress:', this.currIndexProgress);
      /*this.q_answers_token_list = [];
      for (let i = 0; i < Math.min(5, this.currentQuestion.q_answers_token.length); i += 1) {
        this.q_answers_token_list.push(this.currentQuestion.q_answers_token[i]);
      }*/
      // reset a few variables
      /*this.additionalTopic = false;
      this.subtopics = [];
      if (!this.additionalTopic && this.currentQuestion.l_topic1.length>1) this.setSubtopicsList (this.currentQuestion.l_topic1);
      if (this.additionalTopic && this.currentQuestion.l_topic3.length>1) this.setSubtopicsList (this.currentQuestion.l_topic3);
      if (this.currentQuestion.l_topic1.length>1 && this.currentQuestion.l_topic2.length>1 && this.currentQuestion.l_topic3.length>1 && this.currentQuestion.l_topic4.length<=1) {
        this.additionalTopic = true;
        this.setSubtopicsList (this.currentQuestion.l_topic3);
      }
      this.changedHighlighting = false;
      this.highlighting = this.getQuestionTextHighlight (this.currentQuestion);*/
      this.clickedSlider = false;
      this.startAnnoTime = Date.now()/1000;
      console.log('new Question loaded from db:', this.currentQuestion);

    });

  }

  /*
  getQuestionTextHighlight (q) {
    let h: Array<number> = [];
    for (let i = 0; i < q.q_text_token.length; i++) {
      h.push(q.q_text_token[i][1]);
    }
    for (let i = 0; i < q.q_items_token.length; i++) {
      h.push(q.q_items_token[i][1]);
    }
    return h;
  }

  changedCurrQuestionTextHighlight () {
    let changed = false;
    const h_new = this.getQuestionTextHighlight (this.currentQuestion);
    for (let i = 0; i < h_new.length; i++) {
      if (h_new[i] != this.highlighting[i]) {
        changed = true;
        break;
      }
    }
    //console.log('changed text highlighting: ', changed);
    return changed;
  }*/

  saveCurrQuestion(): void {
    if (/*this.currentQuestion.l_topic1 != this.questions[this.currIndex].l_topic1 ||
      this.currentQuestion.l_topic2 != this.questions[this.currIndex].l_topic2 ||
      this.currentQuestion.l_topic3 != this.questions[this.currIndex].l_topic3 ||
      this.currentQuestion.l_concept != this.questions[this.currIndex].l_concept ||
      this.changedCurrQuestionTextHighlight() === true ||
      this.changedHighlighting === true*/true == true) {
      this.currentAnnoCounter += 1;
      this.currentQuestion.a_name = this.name;
      this.currentQuestion.a_name = this.name;
      /*this.currentQuestion.a_timestamp = new Date().toLocaleString();
      this.currentQuestion.a_annotime = Date.now()/1000 - this.startAnnoTime - this.pauseTimeTotal;*/
      this.questions[this.currIndex] = this.currentQuestion; // insert to Array
      this.annoDB_AddUpdate(this.currentQuestion, true); // insert to annoDB
      console.log('Question saved to array:', this.questions[this.currIndex]);
    } else {
      console.log('no changes, object not overwritten');
    }
  }

  pause(): void {
    if (this.paused) {
      this.paused = false;
      this.pauseTimeTotal = this.pauseTimeTotal + Date.now()/1000 - this.pauseTimeBegin;
      this.pauseTimeBegin = 0;
    } else {
      this.paused = true;
      this.pauseTimeBegin = Date.now()/1000;
    }
  }

  logout(): void {
    // resume if paused (to get annotime correct)
    if (this.paused) this.pause();
    // save current question
    this.saveCurrQuestion();
    // save all to file
    this.exportData();
    // reset variables
    this.currentAnnoCounter = 0;
    // reset all
    window.location.reload();
  }

  logCurrentQuestion() {
    console.log('currentQuestion:', this.currentQuestion);
    console.log('questions[this.currIndex]:', this.questions[this.currIndex]);
  }

  logCurrentQuestionText() {
    console.log('currentQuestion:', this.currentQuestion.q_text);
    console.log('questions[this.currIndex]:', this.questions[this.currIndex].q_text);
      /*console.log('currentQuestion:', this.currentQuestion.q_text_token);
      console.log('questions[this.currIndex]:', this.questions[this.currIndex].q_text_token);*/
    }

  outputProblemQList () {
    let s = [];
    for (let i = 0; i < this.wrongPreprocessingOrLanguageList.length; i += 1) {
      s.push( this.wrongPreprocessingOrLanguageList[i].toString() + '\r\n' );
    }
    const blob = new Blob(s, {type: "text/plain;charset=utf-8"});
    FileSaver.saveAs(blob, "annoFile_PROBLEMIDS_" + this.name.toString() + "_" + new Date().toLocaleString() + ".txt");
  }

  exportData () {
    // save current question
    this.saveCurrQuestion();
    // save all to file
    this.fileSave ();
    // export problem ID list
    this.outputProblemQList();
  }

  addKeywordToDatabase(theme: string) {
    this.keyword.theme = theme.trim();
    this.keywordService.findByKeywordTheme(this.keyword.keywordText,this.keyword.theme).subscribe(
      response => {
        if (Object.keys(response).length)
          console.log('A keyword for this theme exists in the database');
        else {
          this.service.getUri(theme).toPromise().then(response => {
            const res = response["results"]; // here you get the result
            if (res == null || res.length == 0 ) {
              if (theme!='') console.log('no theme from Thesoz');
            }
            else {
              for (let i=0; i <res.length; i++){
                if (res[i]["prefLabel"]!='' && res[i]["prefLabel"]==theme){
                  this.keyword.theme_uri=res[i]["uri"];
                    break;
                }
              }  
            };
          
            const data = {
              keywordText: this.keyword.keywordText,
              theme: this.keyword.theme,
              theme_uri: this.keyword.theme_uri
            };
            
            this.keywordService.create(data)
              .subscribe(
                response => {
                  console.log('Keyword has been added to database');
                  this.keyword_submitted = true;
               },
              error => {
                console.log('Keyword could not be added to the database'+error);
              });
          });
        }
      });
  }


}
