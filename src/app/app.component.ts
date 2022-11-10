<!-- Navigation Bar -->
<nav class="navbar navbar-dark bg-dark" id="top-section">
  <a class="navbar-brand" href="#">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
    <img src="assets/logo.png" width="32" height="32" alt="AnnoTool"> Annotation Tool</a>
  <span class="navbar-text">
    <button *ngIf="result && name" type="button" class="mx-2 btn btn-secondary" data-toggle="modal" data-target="#logoutModal">Logout</button>
    <button *ngIf="result && name && devMode" type="button" class="mx-2 btn btn-secondary" (click)="logCurrentQuestion()">Log CurrQ</button>
    <button *ngIf="result && name && devMode" type="button" class="mx-2 btn btn-secondary" (click)="logCurrentQuestionText()">Log CurrQText</button>
  </span>
  <span class="navbar-text" *ngIf="result && name">
    <h3>Annotator: {{name}}</h3>
  </span>
</nav>
<hr/>

<!-- Start Screen -->
<div class="container" *ngIf="!result">
  <div class="flex-md-row">
    <h1>AnnoFile hochladen:</h1>

    <div class="input-group mb-3">
      <div class="input-group-prepend">
        <span class="input-group-text" id="basic-addon1">Annotator Name</span>
      </div>
      <input type="text" class="form-control" [(ngModel)]="name" name="personName"
             placeholder="Bitte Vornamen oder Initialien angeben"
             aria-label="Annotator name" aria-describedby="basic-addon1">
    </div>

    <div class="input-group mb-3">
      <div class="input-group-prepend">
        <span class="input-group-text" id="basic-addon2">Dokumenten-Pfad</span>
      </div>
      <div class="custom-file">
        <input type="file" class="custom-file-input" name="fileInput" (change)="fileChanged($event)"
               id="inputGroupFile01">
        <label class="custom-file-label" for="inputGroupFile01">Dokument auswählen</label>
      </div>
    </div>

    <div class="custom-control custom-checkbox">
      <input type="checkbox" class="custom-control-input" id="customCheck1" [(ngModel)]="resetDB" value="check1">
      <label class="custom-control-label" for="customCheck1">NUR Textdatei laden und alle im Browser gespeicherte Annotationen löschen</label>
    </div>
    <hr/>

    <button type="button" class="btn btn-danger" id="fileuploadbutton" (click)="uploadDocument()">
      <span class="spinner-border spinner-border-sm" role="status" *ngIf="loadResult"></span>
      <span *ngIf="!loadResult">Dokument hochladen</span>
    </button>

  </div>
</div>


<!-- Logout Modal -->
<div class="modal fade" id="logoutModal" tabindex="-1" role="dialog" aria-labelledby="logoutConfirmation"
     aria-hidden="true">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="logoutConfirmation">Logout Warnung</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-dismiss="modal">Zurück zur Annotierung</button>
        <button type="button" class="btn btn-danger" (click)="logout()">Logout</button>
      </div>
    </div>
  </div>
</div>


<!-- Annotation Content -->
<div class="container" *ngIf="result && name && !paused">
  <hr/>



  <form >
    <div class="row">
      <div class="col">
        <label for="">Question ID</label>
        <div class="col-lg-12 border border-dark rounded">
          <span>{{currentQuestion.q_uid}}</span></div>
      </div>
      <div class="col">
        <label for="">Variable ID</label>
        <div class="col-lg-12 border border-dark rounded">
          <span>{{currentQuestion.q_variable_ID}}</span></div>
      </div>
    </div>
    <div class="row">
      <div class="col">
        <label for="" >Fragetext</label>
        <div class="col-sm-6 border border-dark rounded"  style="padding:0 0 30px 10px ;">
          <span>{{currentQuestion.q_text}}</span>

        </div>
      </div>

    </div>

    <div class="row">
      <div class="col">
        <label for="">Frageitem</label>
        <div class="col-lg-12 border border-dark rounded" style="padding:0 0 30px 10px ;">
          <span>{{currentQuestion.q_items}}</span></div>
      </div>
      <div class="col">
        <label for="">Variable label</label>
        <div class="col-lg-12 border border-dark rounded" style="padding:0 0 30px 10px ;">
          <span>{{currentQuestion.var_label}}</span></div>
      </div>
    </div>

    <div class="row">
      <div class="col">
        <label for="">Antwortkategorien</label>
        <div  class="col-lg-12 border border-dark rounded" style="padding:0 0 60px 10px ;">
          <span>{{currentQuestion.q_answers}}</span>
        </div>
      </div>
      <div class="col">
        <label for="">Wertelabel</label>
        <div class="col-lg-12 border border-dark rounded" style="padding:0 0 60px 10px ;">
          <span>{{currentQuestion.q_answers}}</span></div>
      </div>
    </div>
<br>

    <div class="col-lg-12 border border-dark rounded" style="padding:0 0 30px 10px ;">

      <div class="form-group row" style="display:flex; justify-content:flex-start;">
        <label class="col-sm-2 col-form-label" style="max-width: 7%;">Thema:</label>
        <div class="col-md-8" style="max-width: 50%;">
          <!--<input type="checkbox" class="custom-control-input" [(ngModel)]="additionalTopic" id="toggleAdditionalTopic" name="toggleAdditionalTopic">
          <label class="custom-control-label" for="toggleAdditionalTopic" >Zusätzliches Thema</label>-->
          <form class="auto-form">
            <mat-form-field class="auto-full-width" appearance="fill">
              <input type="text" [(ngModel)]="topic_query" style="display: flex; align-items:center"
                     placeholder="search for a theme"
                     aria-label="From Thesoz"
                     matInput
                     [formControl]="myControl"
                     [matAutocomplete]="auto" >
              <mat-autocomplete #auto="matAutocomplete">
                <mat-option *ngFor="let option of (filteredAutoOptions | async)" (onSelectionChange)="addToThemes(option)" [value]="option">
                  {{option}}
                </mat-option>
              </mat-autocomplete>
            </mat-form-field>
            <span *ngIf="autoOptionNoResult" class="auto-no-result"> no result</span>
          </form>
      </div><i class="fa fa-search"  style="line-height: 2; margin-left:5px; margin-right: 60px; font-size: x-large; float: right;" ></i>
      </div><br><br>


        <div style="margin: 20px 0 40px 0;">Ausgewälte Themen:</div>
        <div  class="col-lg-12 border rounded" style="padding:10px;background-color: #f5f5f5;" id="questionAnswers">
          <div *ngFor="let theme of currentQuestion.themes" #item>
            
            <span style="padding-bottom:10px;margin-bottom: 10px;">
              
    
              <i class="material-icons md-18"  (click)="removeFromThemes(theme)" style="float:right;line-height: 2;font-size: 30px;">delete</i>
              
              <hr  style="width:100%;height:1px;border-width:0;color:gray;margin:10px auto;background-color:rgb(203, 201, 201)">
              
    

              {{theme }}
              
              
            </span>
            <br>
            <p style="margin-top: 10px;">Freie Schlagworte dazu (optional)</p>
            <select class="col-sm-6" style="  float: left;background-color: #fff;"></select><i class="fa fa-plus-square"  style="margin-left: 5px; font-size: x-large;"></i>
      <button style="float: right; background-color: #fff; border-radius: 5px;" >Neues freies Schlagwort zu Church hinzufügen</button>
          </div>

        </div>
    </div>
    <br>
    <div class="col-lg-12 border border-dark rounded" style="padding-bottom: 30px;">
      <p style="margin-top: 10px;">Freie Schlagworte,die nicht einem TheSoz Thema zugeordent sind (optional)</p>
      <select class="col-sm-6" style="  float: left;background-color: #fff;"></select><i class="fa fa-plus-square"  style="margin-left: 5px; font-size: x-large;"></i>
      <button style="float: right; background-color: #fff; border-radius: 5px;">Freies Schlagwort hinzufugen</button>

    </div>


      <br>
    <div class="row">
      <div class="col">
          <label for="">Kommentar</label>
          <div class="col-lg-12 border border-dark rounded" style="padding:0 0 60px 10px ;">
            <span>xxxx</span></div>
      </div>

    </div>

    <div class="form-group">
      <div class="form-check">
        <input class="form-check-input" type="checkbox" value="" id="invalidCheck" required>
        <label class="form-check-label" for="invalidCheck">
          Variable zur Wiedervorlage kennzeichnen
        </label>

      </div>
    </div>


  </form>




  <form>
    <!-- TEXT -->
    <div class="form-row" (mouseover)="hover=true" (mouseleave)="hover=false">
      <label for="questionText">Frage #{{currentQuestion.q_uid}}</label>
      <div class="col-lg-12 border border-dark rounded" style="padding:10px" id="questionText">
        <span>{{currentQuestion.q_text}}</span>
      </div>
    </div>

    <!-- ITEMS -->
    <div class="form-row" *ngIf="currentQuestion?.q_items.length>0">
      <label for="questionAnswers">Fragenitem</label>
      <div class="col-lg-12 border border-dark rounded" style="padding:10px" id="questionItem">
        <div *ngFor="let item of currentQuestion.q_items">
          <span>
            {{item}}
          </span>
        </div>
      </div>
    </div>

    <!-- ANSWER OPTIONS -->
    <div class="form-row">
      <label for="questionAnswers">Antwortoptionen</label>
      <div  class="col-lg-12 border border-dark rounded" style="padding:10px" id="questionAnswers">
        <div *ngFor="let a of currentQuestion.q_answers">
          <span>
            {{a}}
          </span>
        </div>

      </div>
    </div>

    <!-- Button Bar -->
    <hr/>
    <div class="form-row">
      <!-- Collapse Variablen ID
      <div class="mx-2 custom-control custom-switch">
        <input type="checkbox" class="custom-control-input" data-toggle="collapse" href="#collapseVarIDs"
               id="toggleVarIDs">
        <label class="custom-control-label" for="toggleVarIDs">Variablen IDs</label>
      </div> -->
      <!-- Mark problem with question
      <div class="mx-2"
           *ngIf="!inProblemQList()">
        <button type="button" class="btn btn-outline-info btn-sm" (click)="addToProblemQList()">Problem mit Text anmerken</button>
      </div>
      <div class="mx-2"
           *ngIf="inProblemQList()">
        <button type="button" class="btn btn-outline-info btn-sm" disabled>Problem mit Text angemerkt</button>
      </div>-->
    </div>
    <!--
    <div class="form-row">
      <div class="collapse" id="collapseVarIDs">
        <span *ngFor="let ID of currentQuestion?.q_variable_IDs" name="text_variableIDs"
              class="badge badge-secondary">{{ID}}</span>
      </div>
    </div>-->
    <div class="form-row" >
      <div style="width:100%;" id="varID">
        <label for="varID">VariabelID &nbsp;</label>
        <span class="badge badge-secondary">{{currentQuestion.q_variable_ID}}<br></span>
      </div>
      <label for="varLabel">Variabellabel &nbsp;</label>
      <div class="col-lg-12 border border-dark rounded" style="width:100%;" id="varLabel">

        <span>{{currentQuestion.var_label}}</span>
      </div>
    </div>

    <hr/>
    <hr/>


    <div class="row">
        <!-- HEADER -->
          <legend class="col-form-label col-md-2 pt-0">Thema</legend>

        <!-- CURRENT VALUES
        <div class="form-row">
          <div class="d-flex align-items-center justify-content-center col-md-12">
            <h4><span class="badge badge-secondary" id="SuperAttributeCurrent">{{currentQuestion?.l_topic1}}</span></h4>
          </div>
        </div>
        <div class="form-row">
          <div class="d-flex align-items-center justify-content-center col-md-12">
            <h4><span class="badge badge-info" id="SuperAttributeCurrentSecond">{{currentQuestion?.l_topic3}}</span></h4>
          </div>
      </div>-->

      <!-- SUBTOPIC
      <div class="col-md-6 border rounded">
        <!-- HEADER
        <div class="form-row">
          <div class="form-group col-md-6">
            <h3>Unterthema</h3>
          </div>
        </div>
        <!-- CURRENT VALUE
        <div class="form-row">
          <div class="d-flex align-items-center justify-content-center col-md-12">
            <h4><span class="badge badge-secondary" id="SubAttributeCurrent">{{currentQuestion?.l_topic2}}</span></h4>
          </div>
        </div>
        <div class="form-row">
          <div class="d-flex align-items-center justify-content-center col-md-12">
            <h4><span class="badge badge-info" id="SubAttributeCurrentSecond">{{currentQuestion?.l_topic4}}</span></h4>
          </div>
        </div>
        <!-- OPTIONS
        <div class="form-row">
          <div class="form-group col-md-12">
            <div *ngFor="let topic of subtopics" class="input-group" id="Subtopic">
              <button name="btn_period" class="btn btn-outline-secondary btn-block"
                      type="button"
                      id="btn_period"
                      (click)="setSubtopic(topic)">{{topic}}
              </button>
            </div>
          </div>
        </div>
      </div>-->
    </div>

    <div  class="col-lg-12 border border-dark rounded" style="padding:10px" id="questionAnswers">
      <div *ngFor="let theme of currentQuestion.themes" #item>
        <span style="padding-bottom:10px;margin-bottom: 10px;">
<<<<<<< Updated upstream
          <i class="material-icons md-18"  (click)="removeFromThemes(theme)" style="float:left">delete</i>
=======
          <i class="material-icons md-18" (click)="removeFromThemes(theme)" (click)="item.remove() " style="float: left;">delete</i>
>>>>>>> Stashed changes

          {{theme}}
        </span>
      </div>

    </div>

<!--
    <div class="row">

      <!-- CERTAINTY SLIDER
      <div class="col-md-12 border rounded">
        <div class="form-row">
          <h3>Antwortsicherheit</h3>
        </div>
        <div class="form-row">
          <span *ngIf="changedCurrQuestionTextHighlight() && !clickedSlider" class="badge badge-danger">Antwortsicherheit fehlt</span>
        </div>
        <div class="form-row">
          <ng5-slider [(value)]="currentQuestion.a_certainty" [options]="options" (click)="clickSlider()" id="CertSlider"></ng5-slider>
        </div>
        <hr/> <!-- Compensate for slider labels
      </div>

    </div> -->

  </form>

  <!-- Make room for buttom navigation bar -->
  <hr/>
  <hr/>
  <hr/>
  <hr/>
  <hr/>
  <hr/>
  <hr/>
  <hr/>


</div>

<!-- Pause-Resume Text -->
<div class="container" *ngIf="result && name && paused">
  <hr/>
  <hr/>
  <div class="row justify-content-md-center">
    <div class="col-md-auto">
      <button type="button" class="btn btn-danger" (click)="pause()">Resume</button>
    </div>
  </div>
</div>


<nav class="navbar fixed-bottom navbar-dark bg-dark" *ngIf="result && name">
  <!-- Left -->

  <span class="navbar-text">
   <!-- <a *ngIf="!paused"
       [class.disabled]="(changedCurrQuestionTextHighlight() && !clickedSlider) ? true: null"
       class="btn btn-secondary float-left" href="index.html#top-section" (click)="loadNewQuestion(-1)" id="prev_question_button">Vorherige</a>-->
       <a class="btn btn-secondary float-left" href="index.html#top-section" (click)="loadNewQuestion(-1)" id="prev_question_button">Vorherige</a>
  </span>
  <!-- Center left -->
  <span class="navbar-text">
    <h4>Aktueller Index: {{currIndex}}</h4>
    <div class="progress">
      <div class="progress-bar bg-info" role="progressbar" [style.width]="currIndexProgress + '%'" aria-valuenow="50" aria-valuemin="0" aria-valuemax="100"></div>
    </div>
  </span>
  <!-- Center right -->
  <span class="navbar-text">
    <div class="col-7">
      <div class="input-group">
        <input type="text" class="form-control" id="inputGoToIndex" placeholder="ID" [(ngModel)]="requestedGoToIndex">
        <div class="input-group-append">
          <button type="submit" class="mx-2 btn btn-secondary" (click)="goToIndex()">Öffne Index</button>
        </div>
      </div>
    </div>
  </span>
  <!-- Center right -->
  <span class="navbar-text">
    <button *ngIf="!paused" type="button" class="mx-2 btn btn-danger" (click)="pause()">Pause</button>
    <button type="button" class="mx-2 btn btn-secondary" (click)="exportData()">Daten exportieren</button>
  </span>
  <!-- Right -->
  <span class="navbar-text">
    <!--<a *ngIf="!paused && currIndex<indexAll.length-1"
       [class.disabled]="(changedCurrQuestionTextHighlight() && !clickedSlider) ? true: null"
       class="btn btn-secondary float-right" href="index.html#top-section" (click)="loadNewQuestion(1)" id="next_question_button">Nächste</a>-->
    <a class="btn btn-secondary float-right" href="index.html#top-section" (click)="loadNewQuestion(1)" id="next_question_button">Nächste</a>
  </span>
  <span class="navbar-text">
  <a *ngIf="!paused && currIndex>=indexAll.length-1" class="btn btn-secondary float-right" href="index.html#top-section" (click)="loadNewQuestion(1)" id="next_question_button"
     data-toggle="modal" data-target="#lastQModal">Eintragen</a>
  </span>
</nav>


<!-- Last Q Modal -->
<div class="modal fade" id="lastQModal" tabindex="-1" role="dialog" aria-labelledby="finalQuestionConfirmation"
     aria-hidden="true">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="finalQuestionConfirmation">Last Question</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-dismiss="modal">Ok</button>
      </div>
    </div>
  </div>
</div>

