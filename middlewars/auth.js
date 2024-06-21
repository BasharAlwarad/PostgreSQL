
export const auth1 = (req,res,next) => { 
    const {token}=req.query
    
    if (!token) {
       return res.status(400).json({message:"Invalid request!"})
    }
    if (token!=="12345") {
        return res.status(401).json({message:"not authorized!"})
    }
    next()
     }
  

export const auth2 = (req,res,next) => { 
    const {token}=req.params
    
    console.log(token)
    if (!token) {
       return res.status(400).json({message:"Invalid request!"})
    }
    // if (token.length<3) {
    //    return res.status(401).json({message:"not authorized!"})
    // }
    if (token!=="1") {
        return res.status(401).json({message:"not authorized!"})
    }
    next()
     }
  