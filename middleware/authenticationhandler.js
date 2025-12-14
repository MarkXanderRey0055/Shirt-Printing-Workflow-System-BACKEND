import jwt from "jsonwebtoken";
import * as UserModel from "../models/UserModel.js";

const checkToken = async(req, res, next) =>{
    const {authorization} = req.headers;
    if(!authorization){
        res.status(401).json({
            success: false,
            message: [
                {result : "You do not have permission to access the app."}
            ]
        })
    }

    const token = authorization.split(' ')[1];

    try{
        const {id} = jwt.verify(token, process.env.SECRET);
        const user = await UserModel.getUser(id);
        if(!user){
            return res.status(401).json({
                message: [{result: "User not found"}]
            });
        }
        next();
    }catch(err){
        res.status(401).json({
            message: [
                {result: "Request is unauthorized"}
            ]
        })
    }
}

export default checkToken;