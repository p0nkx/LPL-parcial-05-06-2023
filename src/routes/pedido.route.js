const {Router} = require('express')
const controller = require('../controllers/pedido.controller')

const route = Router()

route.get("/", controller.getPedido)
route.get('/:id', controller.getPedidoById)

module.exports = route