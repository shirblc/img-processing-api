declare namespace Express {
  import Express from "express";

  export interface Request extends Express.Request {
     image: {
        name: string;
        height: number;
        width: number;
     }
  }
}
