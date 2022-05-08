
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */
export interface NewPost {
    title: string;
    content: string;
}

export interface UserData {
    email?: Nullable<string>;
    password?: Nullable<string>;
}

export interface Token {
    access_token?: Nullable<string>;
}

export interface IMutation {
    register(email: string, password: string): Nullable<boolean> | Promise<Nullable<boolean>>;
    login(email: string, password: string): Nullable<Token> | Promise<Nullable<Token>>;
    createPost(title: string, content: string): Nullable<boolean> | Promise<Nullable<boolean>>;
    updatePost(postId: number, postData?: Nullable<NewPost>): Nullable<boolean> | Promise<Nullable<boolean>>;
    deletePost(postId: number): Nullable<boolean> | Promise<Nullable<boolean>>;
    updateUser(userId: number, userData?: Nullable<UserData>): Nullable<User> | Promise<Nullable<User>>;
    blockUser(userId: number): Nullable<boolean> | Promise<Nullable<boolean>>;
}

export interface Post {
    id: number;
    title: string;
    content: string;
    created_at: string;
    updated_at: string;
    author?: Nullable<User>;
}

export interface IQuery {
    getPost(postId: number): Nullable<Post> | Promise<Nullable<Post>>;
    getAllPosts(): Nullable<Nullable<Post>[]> | Promise<Nullable<Nullable<Post>[]>>;
    getUserPosts(userId: number): Nullable<Nullable<Post>[]> | Promise<Nullable<Nullable<Post>[]>>;
    getUser(userId: number): Nullable<User> | Promise<Nullable<User>>;
}

export interface User {
    id: number;
    email: string;
    password: string;
    isActive: boolean;
    created_at: string;
    posts?: Nullable<Nullable<Post>[]>;
}

type Nullable<T> = T | null;
