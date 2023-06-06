const {Router} = require('express')
const controller = require('../controllers/alumno.controller')

const route = Router()

route.get("/", controller.getAlumnos)
route.get('/:dni', controller.getAlumnoByDni)
route.post('/', controller.createAlumno)
route.put('/:dni', controller.updateAlumno )

module.exports = route