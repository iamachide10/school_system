export  const errorHandler=(err, req, res, next)=>{
    console.error("Error caugth :", err.message);

    res.status(500).json({
        message : err|| "Internal server Error"
    })
}