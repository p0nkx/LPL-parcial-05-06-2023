const {Router} = require('express')
const controller = require('../controllers/pedido.controller')

const route = Router()

route.get("/", controller.getPedido)
route.get('/:id', controller.getPedidoById)
route.post('/', controller.createPedido)
route.get('/search', controller.getUltimoPedidoByNombre)
route.delete('/:id', controller.deletePedido)

module.exports = route