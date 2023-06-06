const pedidos = require('../../data/pedidos.json')
const httpStatusCodes = require('http2').constants;

const getPedido = (_, res) =>{
    res.status(httpStatusCodes.HTTP_STATUS_OK).json(pedidos)
}

const getPedidoById =  (req, res) => {
    const id = req.params.id
    const resultado = pedidos.find(pedido => pedido.id == id)
    if(resultado){
        res.status(200).json(resultado).status(200)
    } else {
        res.status(404).json({ mensaje: `El pedido con id ${id} no fue encontrado`} )
    }

}



module.exports = 
{
    getPedido,
    getPedidoById
}