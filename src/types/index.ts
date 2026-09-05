export interface Comment {
    id?: number;
    author: string;
    text: string;
    createdAt?: string;
}

export interface Post {
    id: number;
    author: string;
    content: string;
    likesCount: number;
    createdAt: string;
    comments: Comment[];
}