
import { getRefreshToken ,saveRefreshToken,editTokenStatus } from "../models/refreshTokenModel.js";
import { signRefreshToken } from "../Utils/Token.js";
import { createAccessToken } from "../Utils/Token.js";
import bcrypt from "bcryptjs";



 
export const refreshTokenController = async (req, res) => {
    console.log("About to refresh token ");
    
  try {
    const oldRefreshToken = req.cookies.refreshToken;
    
    if (!oldRefreshToken) {
      return res.status(401).json({ message: "No refresh token" });
    }

    const prefix = oldRefreshToken.slice(0, 10);
    const stored = await getRefreshToken(prefix);

    if (!stored) {
        console.log("Token not found");
        
      return res.status(403).json({ message: "Invalid refresh token" });
    }

    const isMatch = await bcrypt.compare(oldRefreshToken, stored.token_hash);

    if (!isMatch || stored.replace_by) {
        console.log("Refresh token mismatch or already replaced");
      return res.status(403).json({ message: "Invalid refresh token" });
    }

    console.log(isMatch);
    
    // ---- Generate new tokens ----
    const { refreshToken: newRefreshToken, tokenHash, tokenPrefixs } = signRefreshToken();
    const newRecord = await saveRefreshToken(stored.user_id, tokenHash, tokenPrefixs);
    console.log("New token",newRecord);
    

    // Update old token as replaced
    await editTokenStatus(newRecord.id, stored.id);

    // ---- SEND NEW REFRESH TOKEN TO BROWSER ----
    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: true,        // IMPORTANT ON PRODUCTION
      sameSite: "none",    // REQUIRED for frontend-backend cross domain
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    const accessToken = createAccessToken({
      id: stored.user_id,
      role: stored.user_role
    });

    return res.status(200).json({ accessToken });

  } catch (error) {
    console.log("Refresh error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
