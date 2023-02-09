import { GithubAPI } from "./github-api"
import {
  fromEvent,
  map,
  filter,
  debounceTime,
  distinctUntilChanged,
  mergeMap,
  from,
  catchError,
  of,
  type Observable
} from "rxjs"

class App {
  private app = document.querySelector('#app')
  private field?: HTMLInputElement
  private list?: HTMLUListElement
  private keyup$?: Observable<object[]>

  private API = new GithubAPI
  constructor() {
    if (!this.app) return
    this.field = this.app.appendChild(document.createElement('input'))
    this.list = this.app.appendChild(document.createElement('ul'))

    this.keyupListenerInit()
  }

  private keyupListenerInit() {
    if (!this.field) return
    this.keyup$ = fromEvent(this.field, 'keyup')
      .pipe(
        debounceTime(700),
        map((event: Event) => (event.target as HTMLInputElement).value),
        filter((value: string) => value.length > 2),
        distinctUntilChanged(),
        mergeMap((value: string) => from(this.API.findUser(value))
          .pipe(
            catchError(() => of([]))
          )
        ),
      )
    this.keyup$.subscribe({
      next: (reps: object[]) => this.recordRepsToList(reps),
      error: () => console.log('api error')
    })
  }

  private recordRepsToList(reps: any) {
    if (!this.list) return
    for (let i = 0; i < reps.length; i++) {
      if (!this.list.children[i]) {
        const li = document.createElement('li')
        this.list.appendChild(li)
      }

      const li = this.list.children[i]
      li.innerHTML = reps[i].name

      while (this.list.children.length > reps.length) {
        if (this.list.lastChild) {
          this.list.removeChild(this.list.lastChild)
        }
      }
    }
  }
}

new App


