import * as HttpStatus from "http-status-codes";
import express from "express";

/**
 * @param {express.Request} req 
 * @param {express.Response} res 
 * @param {express.NextFunction} next 
 */
export function checkUserHeader(req, res, next) {
    if (!req.headers["x-user"]) {

        res.status(HttpStatus.BAD_REQUEST).json({ message: "User header is missing." });

        return;
    }
    else {
        next();
    }
}