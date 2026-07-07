import redis from "../../shared/redis/redis.js";


export const protect =
async(req,res,next)=>{

 try{

   const sessionId =
   req?.cookies?.session;
  
   if(!sessionId){

     return res.status(401).json({
       success: false,
       message:"Unauthorized"
     });

   }

   // Add timeout to redis operations
   const session = await Promise.race([
     redis.get(`session:${sessionId}`),
     new Promise((_, reject) => 
       setTimeout(() => reject(new Error('Redis timeout')), 2000)
     )
   ]).catch(err => {
     console.error("Redis error in auth middleware:", err.message);
     return null;
   });

   if(!session){

     return res.status(401).json({
       success: false,
       message:"Session Expired"
     });

   }

   req.user =
   JSON.parse(session);

   next();

 }catch(error){

   console.error("Auth middleware error:", error);
   return res.status(500).json({
    success: false,
    message: error.message
   });

 }

}