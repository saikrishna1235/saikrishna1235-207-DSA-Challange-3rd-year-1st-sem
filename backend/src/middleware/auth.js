import jwt from 'jsonwebtoken';
export function requireAuth(req,res,next){try{const t=req.cookies?.dsa_token;if(!t)return res.status(401).json({error:'Authentication required'});req.user=jwt.verify(t,process.env.JWT_SECRET);next()}catch{res.status(401).json({error:'Invalid or expired session'})}}
