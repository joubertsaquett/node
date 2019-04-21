

exports.listar = () => 
{
    console.log("listando")
}

exports.criar = (nome,email) =>
{
    console.log("criar")
}

exports.delete = (nome,email) => 
{
    console.log("criar")
}

exports.retornoPadrao = (req,res) =>
{
    res.status(200).json({'message' : req.requestTime})
}