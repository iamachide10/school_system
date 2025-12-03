
import { getRefreshToken ,saveRefreshToken,editTokenStatus } from "../models/refreshTokenModel.js";
import { signRefreshToken } from "../Utils/Token.js";
import { createAccessToken } from "../Utils/Token.js";
import bcrypt from "bcryptjs";




export const refreshTokenController= async (req, res)=>{
    
    
    try {
        const refreshTokens = req.cookies.refreshToken
        console.log(refreshTokens);
        
    
        if (!refreshTokens) {
            return res.status(401).json({ message: "Refresh token not found" });
        }
        const tokenPrefix = refreshTokens.slice(0, 10);
        const storedToken= await getRefreshToken(tokenPrefix);

        if (!storedToken) {
            return res.status(403).json({ message: "Invalid refresh token" });
        }   

        const isMatch = await bcrypt.compare(refreshTokens, storedToken.token_hash);
        console.log("Is Match:", isMatch);
        if (!isMatch) {
            return res.status(403).json({ message: "Invalid refresh token" });

        }

        if(storedToken.replace_by){
              return res.status(403).json({ message: "Invalid refresh token" });
        }

        const { refreshToken, tokenHash,tokenPrefixs }=signRefreshToken();

        const userId = storedToken.user_id;

        const newRefreshToken= await saveRefreshToken(userId ,tokenHash,tokenPrefixs)

        const newTokenId=newRefreshToken.id
        const oldTokenId = storedToken.id
        await editTokenStatus(newTokenId,oldTokenId)
        console.log("Stored Token",storedToken);
        
        const id = storedToken.user_id;
        const role = storedToken.user_role;
        
        
        const accessToken = createAccessToken({ id, role });
        return res.status(200).json({ accessToken });

    } catch (error) {
        console.error("Error refreshing token:", error);
        return res.status(500).json({ message: "Internal server error" });
    }   
}

