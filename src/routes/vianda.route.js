const {Router} = require('express')
const controller = require('../controllers/vianda.controller')
const route = Router()

route.get("/", controller.getViandas)
route.get('/:codigo', controller.getViandaBycodigo)
route.post('/', controller.createVianda)
route.put('/:codigo', controller.updateVianda)
module.exports = route