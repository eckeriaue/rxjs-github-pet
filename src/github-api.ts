export class GithubAPI {
  constructor() {
  }

  public findUser(username: string) {
    const url = `https://api.github.com/users/${ username }/repos`

    return fetch(url)
      .then(res => {
        if (res.ok) {
          return res.json()
        } 
        throw new Error('api error')
      })
  }
}