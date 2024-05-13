import { NextFunction, Request, Response } from "express";

export function LoggerMiddleware(req: Request, res: Response, next: NextFunction) {
     const actualDate = new Date();
     const formattedDate = actualDate.toLocaleDateString();
     const formattedTime = actualDate.toLocaleTimeString();

     console.log(`${req.method} ${req.url} - ${formattedDate} ${formattedTime}`);
     next();
}