const jwt = require("jsonwebtoken")

const verifyToken = (req, res, next) => {
    const authHeader = req.headers.token
    if(authHeader)
    {
        const token = authHeader.split(" ")[1];
        //this is beacuse of the bearer we have used
        jwt.verify(token, process.env.JWT_SEC, (err, user)=>{
            if(err) res.status(403).json("Token is not valid!");
            req.user = user;
            next();
            //its used for continuing running some function in this case the user router

        })

    }
    else
    {
        return res.status(401).json("You are not authenticated");
    }
}

const verifyTokenAndAuthorization = (req, res, next)=> {
    verifyToken(req, res, ()=> {
        if(req.user.id === req.params.id || req.user.isAdmin){
            next()
        }else{
            res.status(403).json("You are not allowed to do this task!")
        }
    })
}

const verifyTokenAndAdmin = (req, res, next)=> {
    verifyToken(req, res, ()=> {
        if(req.user.isAdmin){
            next()
        }else{
            res.status(403).json("You are not allowed to do this task!")
        }
    })
}

module.exports = {verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin};