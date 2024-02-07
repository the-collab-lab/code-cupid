export enum Role {
  Developer = 'developer',
  Contributor = 'contributor',
}

export enum Language {
  JavaScript = 'JavaScript',
  TypeScript = 'TypeScript',
  Python = 'Python',
  Go = 'Go',
  Java = 'Java',
}

export interface ApiResponse {
  id: string;
  link: string;
  language: string;
  createdAt: string;
}
