import {Injectable, OnDestroy} from '@angular/core';
import * as firebase from 'firebase/app';
import {HttpClient, HttpParams} from '@angular/common/http';
import {of, Subject, Subscription} from 'rxjs';
import { environment } from 'src/environments/environment';
import {map} from 'rxjs/operators';

export const DEFAULT_CACHE_TIMEOUT = 5 * 60 * 1000;

@Injectable({
  providedIn: 'root'
})
export class FirebaseApiService implements OnDestroy {
  public tokenStore = new Subject();
  public token = '';

  private subs: Subscription[] = [];
  private httpOptions = this.tokenStore.pipe(map((token) => {
    if ( token ) {
      return {
        headers: {
          'Content-Type':  'application/json',
          'Authorization': 'Bearer ' + token
        }
      };
    } else {
      return null;
    }
  }));

  constructor(private client: HttpClient) { }

  checkAuth() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        user.getIdToken().then(token => {
          this.tokenStore.next(token);
          this.token = token;
        });
      } else {
        this.token = null;
      }
    });
  }
  url(template, data: any = {}) {
    if (data) {
      Object.keys(data).forEach(key => {
        if (data[key]) {
          const placeholder = ':' + key;
          template = template.replace(placeholder, data[key]);
        }
      });
    }
    return template;
  }

  get(path, params = {}, apiOptions: any = {}) {
    // I disabled the cache
    if (false) {
      const cachedData = this.getCache(path, params);
      if (cachedData) {
        return of(cachedData);
      }
    }
    let httpParams = params ? new HttpParams() : null;
    if (httpParams) {
      Object.keys(params).forEach(k => {
        httpParams = httpParams.set(k, params[k]);
      });
    }
    // Here we re-trigger the this.tokenStore so the pipes move
    // onAuthStatechanged -> tokenStore -> httpOption -> httpClient
    // -> view/component
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        user.getIdToken().then(token => {
          this.tokenStore.next(token);
          this.token = token;
        });
      }
    });
    const subject = new Subject();
    // This forces the this.httpOptions observer trigger
    // Not sure if this is the right way to do it.
    // Feel free to improve
    this.checkAuth();
    const subscription = this.httpOptions.subscribe((options: any) => {
      if (options) {
        if (httpParams) {
          options.params = httpParams;
        }
        return this.client.get(this.getUrl(path, apiOptions), options).subscribe(data => {
          if (!apiOptions.disableCache) {
            this.setCache(path, params, data);
          }
          subject.next(data);
          subscription.unsubscribe();
        }, error => {
        });
      }
    });
    return subject;
  }

  getCache(path, params) {
    const cache = sessionStorage.getItem(this.getCacheKey(path, params));
    if (! cache) {
      return false;
    }
    const {data, expires} = JSON.parse(cache);
    if (expires < Date.now()) {
      sessionStorage.removeItem(this.getCacheKey(path, params));
      return false;
    } else {
      return data;
    }
  }

  setCache(path, params, data, options: any = {}) {
    const cacheTimeout = options.cacheTimeout ? options.cacheTimeout : DEFAULT_CACHE_TIMEOUT;
    const expires = cacheTimeout + Date.now();
    return sessionStorage.setItem(this.getCacheKey(path, params), JSON.stringify({data, expires}));
  }

  getCacheKey(path, params): string {
    return `firebase-api-cache:${path}?${btoa(JSON.stringify(params))}`;
  }

  post(path, body, apiOptions: any = {}) {
    const subject = new Subject();
    // This forces the this.httpOptions observer trigger
    // Not sure if this is the right way to do it.
    // Feel free to improve
    this.checkAuth();
    this.subs.push(this.httpOptions.subscribe(options => {
      this.subs.push(
        this.client.post(this.getUrl(path, apiOptions), body, options).subscribe(res => subject.next(res), error => console.error(error)));
    }));
    return subject;
  }

  put(path, body, apiOptions: any = {}) {
    const subject = new Subject();
    this.subs.push(this.httpOptions.subscribe(options => {
      this.subs.push(
        this.client.put(this.getUrl(path, apiOptions), body, options).subscribe(res => subject.next(res), error => console.error(error)));
    }));
    return subject;
  }

  delete(path, apiOptions: any = {}) {
    const subject = new Subject();
    this.subs.push(this.httpOptions.subscribe(options => {
      this.subs.push(
        this.client.delete(this.getUrl(path, apiOptions), options).subscribe(res => subject.next(res), error => console.error(error)));
    }));
    return subject;
  }

  private getUrl(path, apiOptions: any = {}) {
    const {apiPath} = environment;
    const basePath = apiOptions.basePath ? apiOptions.basePath : 'api';
    const cleanPath = path.replace(/^\/+/g, '');
    return [apiPath, basePath, cleanPath].join('/');
  }

  ngOnDestroy(): void {
    if (this.subs) {
      this.subs.forEach(sub => sub.unsubscribe());
    }
  }
}
