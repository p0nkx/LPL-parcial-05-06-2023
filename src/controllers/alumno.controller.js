const alumnos = require('../../data/alumnos.json')
const httpStatusCodes = require('http2').constants;

const getAlumnos = (_, res) => {
    res.status(httpStatusCodes.HTTP_STATUS_OK).json(alumnos)
}

const getAlumnoByDni = (req, res) => {
    const dni = req.params.dni
    const resultado = alumnos.find( alumno => alumno.dni == dni)
    if(resultado) {
        res.status(200).json(resultado).status(200)
    } else {
        res.status(404).json({ mensaje: `El alumno con dni ${dni} no fue encontrado`} )
    }
}

const createAlumno = (req, res) => {
    const alumnosData = req.body
    const existe = alumnos.find(alumno => alumno.dni == alumnosData.dni)

    // Validar que el dni tenga 8 dígitos numéricos
    if (!/^\d{8}$/.test(alumnosData.dni)) {
        return res.status(400).json({ error: 'El DNI debe tener 8 dígitos numéricos' });
      }
    // Validar la edad del alumno
    if (alumnosData.edad <= 18 || alumnosData.edad >= 99) {
        return res.status(400).json({ error: 'La edad del alumno debe ser mayor a 18 y menor a 99 años' });
      }

      const esCeliaco = alumnosData.celiaco || false;


    
    if (!existe) {
        // Crear el nuevo alumno
        const nuevoAlumno = {
            dni: alumnosData.dni,
            edad: alumnosData.edad,
            nombre: alumnosData.nombre,
            habilitado: true,
            celiaco: esCeliaco,
          };
        
            alumnos.push(nuevoAlumno)
            res.status(201).json({mensaje: `El alumno con dni ${alumnosData.dni} fue creado correctamente`})
        
    } else {
        res.status(400).json({mensaje: `El alumno con dni ${alumnosData.dni} ya existe en la base de datos`})
    }
}


const updateAlumno = (req, res) => {
    const dni = req.params.dni; // Obtener el dni de los parámetros de la URL
    const alumnosData = req.body;
    const existe = alumnos.find(alumno => alumno.dni == dni);
  
    if (!existe) {
      return res.status(404).json({ error: `No se encontró ningún alumno con dni ${dni}` });
    }
  
    // Actualizar los atributos del alumno si se proporcionan en la solicitud
    if (alumnosData.habilitado !== undefined) {
      existe.habilitado = alumnosData.habilitado;
    }
  
    if (alumnosData.celiaco !== undefined) {
      existe.celiaco = alumnosData.celiaco;
    }
  
    if (alumnosData.edad !== undefined) {
      existe.edad = alumnosData.edad;
    }
  
    res.status(200).json({ mensaje: `Alumno con dni ${dni} actualizado correctamente` });
  }
  


module.exports = 
{
    getAlumnos,
    getAlumnoByDni,
    createAlumno,
    updateAlumno
}