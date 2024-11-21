import { ILawyer } from "./Lawyer.interface";
import { IUser } from "./User.interface";

export interface IUserResponse {
    countUsers: number;
    countLawyers: number;
    users: IUser[];
    lawyers: ILawyer[];
  }