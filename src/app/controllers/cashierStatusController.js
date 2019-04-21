
exports.list = async (req, res) => 
{        
    res.status(200).json({'message' : req.requestTime})
}

exports.create = (req,res) =>
{
    res.status(200).json({'message' : req.requestTime})
}

exports.alter = (req,res) =>
{
    res.status(200).json({'message' : req.requestTime})
}

