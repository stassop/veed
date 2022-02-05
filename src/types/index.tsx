export interface User {
  login: string,
  avatar_url: string,
  html_url: string,
}

export interface Repo {
  id: number,
  name: string,
  owner: User,
  html_url: string,
  description: string,
  language: string,
  stargazers_count: number,
}

export interface Results {
  items: Repo[],
}