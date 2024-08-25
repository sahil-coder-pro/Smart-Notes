import User from "../models/user.model.js";

import jwt from "jsonwebtoken";


export const protect = async (req, res, next) => {
    try {

        // console.log("in auth middleware", req.cookies) ;

        const token = req.cookies?.accessToken || req.body?.accessToken || req.headers.authorization?.split(' ')[1] ; 

        if (!token) {
            return res.status(401).json({message: "Missing token, authorization denied", success: false, data:{}});
        }

        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        if (!decodedToken) {
            return res.status(401).json({message: "Invalid token, authorization denied", success: false, data:{}});
        }

        const user = await User.findById(decodedToken.id);

        if (!user) {
            return res.status(401).json({message: "User not found, authorization denied", success: false, data:{}});
        }

        req.user = user;
        // console.log("user in auth middleware", user) ;
        next();
    } catch (error) {

        console.error(error);


        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Expired token' , success: false, data:{} });
        }

        return res.status(500).json({message: "Some error occurred while authenticating the user", success: false, data:{}});
    } 
};
