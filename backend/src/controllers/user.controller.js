
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const signupUser = async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" , success: false, data:{} });
    }

    try {
      const existingUser = await User.findOne({ email }).select("-password -refreshToken");

      if (existingUser) {
        return res.status(400).json({ message: "User already exists" , success: false, data:{user: existingUser} });
      }

      const newUser = await User.create({ name, email, password });

      
      if (!newUser) {
          return res.status(500).json({ message: "User could not be registered" , success: false, data:{} });
          
        }
        
    const {password:_, ...userDetails} = newUser._doc ;
      return res.status(201).json({ message: "User registered successfully" , success: true, data:{user: userDetails} });


    }
    catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Some error occurred during signup" , success: false, data:{} });
    }
} ;


export const loginUser = async (req, res) =>  {
    const {email, password: enteredPassword} = req.body;

    if (!email || !enteredPassword) {
      return res.status(401).json({ message: "All fields are required" , success: false, data:{} });
    }

    try {
      const existingUser = await User.findOne({ email });

    //   console.log(existingUser) ;

      if (!existingUser) {
        return res.status(401).json({ message: "User does not exist" , success: false, data:{} });
      }

      const isPasswordCorrect = await existingUser.isPasswordCorrect(enteredPassword);

      if (!isPasswordCorrect) {
        return res.status(401).json({ message: "Incorrect password" , success: false, data:{} });
      }

      const accessToken = existingUser.generateAccessToken();
      const refreshToken = existingUser.generateRefreshToken();

      existingUser.refreshToken = refreshToken;
      await existingUser.save();

      const {password, refreshToken:_, ...userDetails} = existingUser._doc ;

      return res
          .status(200)
          .cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 1000*60*15,
                
          })
          .cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 1000*60*60*24*10,
          })
          .json({ message: "User logged in successfully" , success: true, data:{user: userDetails, accessToken, refreshToken} });
    }
    catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Some error occurred during login" , success: false, data:{} });
    }

} ;

export const logoutUser = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "User not logged in" , success: false, data:{} });
        }

        req.user.refreshToken = null;
        await req.user.save();

        res.clearCookie("accessToken").clearCookie("refreshToken").status(200).json({ message: "User logged out successfully" , success: true, data:{} });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Some error occurred during logout" , success: false, data:{} });
    }
} ;

export const getCurrentUser = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "User not logged in" , success: false, data:{} });
        }
        const {password, refreshToken:_, ...userDetails} = req.user._doc ;
        return res.status(200).json({ message: "User details fetched successfully" , success: true, data:{user: userDetails} });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Some error occurred" , success: false, data:{} });
    }
} ;


export const refreshTheAccessToken = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "User not logged in" , success: false, data:{} });
        }

        const refreshToken = req.cookies.refreshToken ;

        if (!refreshToken) {
            return res.status(401).json({ message: "Missing Refresh token not found" , success: false, data:{} });
        }

        const decodedToken = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

        if (!decodedToken) {
            return res.status(401).json({ message: "Invalid refresh token" , success: false, data:{} });
        }

        const user = await User.findById(decodedToken.id);

        if (!user || user.refreshToken !== refreshToken) {
            return res.status(401).json({ message: "Refresh token mismatch" , success: false, data:{} });
        }

        const accessToken = user.generateAccessToken();

        return res
            .status(200)
            .cookie("accessToken", accessToken, {
                httpOnly: true,
                secure: true,
                sameSite: "none",
                maxAge: 1000*60*15,
            })
            .json({ message: "Access token refreshed successfully" , success: true, data:{accessToken, refreshToken} });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Some error occurred during token refresh" , success: false, data:{} });
    }
} ;