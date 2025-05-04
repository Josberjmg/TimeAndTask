import { IUser } from "./user.entity";

export interface ResponseSignIn{
    user: IUser,
    token: string,
}