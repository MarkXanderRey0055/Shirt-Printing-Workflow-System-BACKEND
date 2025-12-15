import * as UserModel from "../models/UserModels.js";

export const register = async (req, res) =>{
    const {role, password} = req.body;

    try{
        const user = await UserModel.createUser(role, password);
        res.status(201).json({success: true, message: user});
    }catch(err){
        console.log(err);
        res.status(400).json({success: false, message: err});
    }
}

export const login = async (req, res) =>{
    const {role, password} = req.body;

    try{
        const token = await UserModel.login(role, password);
        res.status(200).json({
            success: true,
            message: [
                {result: "Login Successful"}
            ],
            token: token
        });
    }catch(err){
        console.log(err);
        res.status(400).json({success: false, message: err});
    }
}
