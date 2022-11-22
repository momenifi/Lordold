import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

const baseUrl = 'http://localhost:8080/api/keywords';


@Injectable({
  providedIn: 'root'
})
export class KeywordService {

  constructor(private http: HttpClient) { }

  getAll() {
    return this.http.get(baseUrl);
  }

  get(id) {
    return this.http.get(`${baseUrl}/${id}`);
  }

  create(data: { keywordText: string; theme: string; theme_uri: string; }) { 
    return this.http.post(baseUrl, data);
  }

  update(id, data) {
    return this.http.put(`${baseUrl}/${id}`, data);
  }

  delete(id) {
    return this.http.delete(`${baseUrl}/${id}`);
  }

  deleteAll() {
    return this.http.delete(baseUrl);
  }

  findByKeywordTheme(keywordText,theme) {
    return this.http.get(baseUrl+'?keywordText='+keywordText+'&theme='+theme);
    //return this.http.get(`${baseUrl}?keywordText=${keywordText}&theme=${theme}`);
  }

  findByTheme(theme) {
    return this.http.get(baseUrl+'?theme='+theme);
    //return this.http.get(`${baseUrl}?keywordText=${keywordText}&theme=${theme}`);
  }

}
