export interface Author {
  _id: string;
  username: string;
}

export interface Post {
  _id: string;
  content: string;
  image: string;
  author: Author;
  createdAt: string; // или Date, если вы хотите использовать объект даты
  updatedAt: string; // или Date, если вы хотите использовать объект даты
  __v: number;
}

export type PostsArray = Post[];
