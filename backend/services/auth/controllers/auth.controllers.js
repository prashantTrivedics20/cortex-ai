import crypto from "crypto";
import { getAuth } from "firebase-admin/auth";
import User from "../models/user.model.js";
import redis from "../../../shared/redis/redis.js";
import { app } from "../config/firebase.js";

export const login = async (req, res) => {
  try {
    console.log("Login request received");
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: "Token is required"
      });
    }

    console.log("Verifying Firebase token...");
    const decoded = await getAuth(app).verifyIdToken(token);
    console.log("Token verified:", decoded.email);

    let user = await User.findOne({
      firebaseUid: decoded.uid,
    });

    if (!user) {
      console.log("Creating new user...");
      user = await User.create({
        firebaseUid: decoded.uid,
        email: decoded.email,
        name: decoded.name,
        avatar: decoded.picture,
        provider: decoded.firebase?.sign_in_provider,
      });
    }

    console.log("User found/created:", user._id);

    const sessionId = crypto.randomUUID();

    console.log("Storing session in Redis...");
    
    try {
      await Promise.race([
        Promise.all([
          redis.set(
            `user-session:${user._id}`,
            sessionId,
            "EX",
            60 * 60 * 24 * 7
          ),
          redis.set(
            `session:${sessionId}`,
            JSON.stringify({
              userId: user._id,
              email: user.email,
              avatar: user.avatar,
              name: user.name,
              plan: user.plan,
              credits: user.credits,
              totalCredits: user.totalCredits
            }),
            "EX",
            60 * 60 * 24 * 7
          )
        ]),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Redis timeout')), 3000)
        )
      ]);
      console.log("Session stored in Redis");
    } catch (redisError) {
      console.error("Redis error (non-fatal):", redisError.message);
    }

    res.cookie("session", sessionId, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      path: "/",
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });

    console.log("Login successful!");
    return res.status(200).json({
      success: true,
      user,
    });

  } catch (error) {
    console.error("Login error:", error);
    return res.status(401).json({
      success: false,
      message: error.message,
    });
  }
};

export const logout = async (req, res) => {
  try {
    const sessionId = req.cookies?.session;

    if (sessionId) {
      await redis.del(`session:${sessionId}`);
    }

    res.clearCookie("session", {
      httpOnly: true,
      secure: false,
      sameSite: "lax"
    });

    return res.status(200).json({
      success: true,
      message: "Logged out successfully"
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const updatePlan = async (req, res) => {
  try {
    const { userId, plan, credits } = req.body;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    user.plan = plan;
    user.credits += credits;
    user.totalCredits += credits;
    user.planExpiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    await user.save();

    const sessionId = await redis.get(`user-session:${user._id}`);

    if (sessionId) {
      await redis.set(
        `session:${sessionId}`,
        JSON.stringify({
          userId: user._id,
          email: user.email,
          avatar: user.avatar,
          name: user.name,
          plan: user.plan,
          credits: user.credits,
          totalCredits: user.totalCredits
        }),
        "EX",
        60 * 60 * 24 * 7
      );
    }

    return res.json({
      success: true
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const deductCredits = async (req, res) => {
  try {
    const { userId, agent } = req.body;

    const COST = {
      chat: 1,
      search: 5,
      coding: 10,
      pdf: 10,
      ppt: 10,
      image: 10
    };

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    const requiredCredits = COST[agent] || 1;

    if (user.credits < requiredCredits) {
      return res.status(400).json({
        success: false,
        message: "Not enough credits."
      });
    }

    user.credits -= requiredCredits;
    await user.save();

    const sessionId = await redis.get(`user-session:${user._id}`);

    if (sessionId) {
      await redis.set(
        `session:${sessionId}`,
        JSON.stringify({
          userId: user._id,
          email: user.email,
          avatar: user.avatar,
          name: user.name,
          plan: user.plan,
          credits: user.credits,
          totalCredits: user.totalCredits
        }),
        "EX",
        60 * 60 * 24 * 7
      );
    }

    return res.json({
      success: true,
      credits: user.credits
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
