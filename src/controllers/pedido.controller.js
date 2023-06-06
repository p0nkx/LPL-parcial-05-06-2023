const pedidos = require('../../data/pedidos.json')
const alumnos = require('../../data/alumnos.json')
const viandas = require('../../data/viandas.json');

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


const createPedido = (req, res) => {
    const dni = req.body.dni;
  
    // Verificar si el alumno existe y está habilitado
    const alumno = alumnos.find((alumno) => alumno.dni === dni);
    if (!alumno) {
      return res.status(400).json({ error: `No se encontró ningún alumno con DNI ${dni}` });
    }
    if (!alumno.habilitado) {
      return res.status(400).json({ error: `El alumno con DNI ${dni} no está habilitado para realizar un pedido` });
    }
  
    // Obtener el tipo de vianda solicitado
    const tipoVianda = req.body.tipo;
    
    // Validar el tipo de vianda
    const tiposValidos = ['TARTA', 'POLLO', 'PASTA', 'PIZZA', 'EMPANADAS'];
    if (!tiposValidos.includes(tipoVianda)) {
      return res.status(400).json({ error: 'Tipo de vianda incorrecta. Los valores disponibles son: TARTA, POLLO, PASTA, PIZZA, EMPANADAS' });
    }
  
    // Buscar una vianda que cumpla con las condiciones del tipo y disponibilidad
    const vianda = viandas.find((vianda) =>
      vianda.tipo === tipoVianda &&
      vianda.aptoCeliaco === alumno.celiaco &&
      vianda.stock > 0
    );
  
    if (!vianda) {
      return res.status(400).json({ error: 'No hay disponibilidad de viandas para el tipo solicitado' });
    }
  
    // Actualizar el stock de la vianda
    vianda.stock--;
  
    // Deshabilitar al alumno
    alumno.habilitado = false;
  
    // Calcular el siguiente id del pedido
    const nuevoIdPedido = pedidos.length + 1;
  
    // Obtener la fecha actual
    const fechaPedido = new Date().toISOString().slice(0, 10);
  
    // Crear el nuevo pedido
    const nuevoPedido = {
      id: nuevoIdPedido,
      fecha: fechaPedido,
      alumno: {
        dni: alumno.dni,
        nombre: alumno.nombre,
        edad: alumno.edad,
        aptoCeliaco: alumno.celiaco,
      },
      vianda: {
        codigo: vianda.codigo,
        tipo: vianda.tipo,
        aptoCeliaco: vianda.aptoCeliaco,
        descripcion: vianda.descripcion,
      },
    };
  
    // Agregar el nuevo pedido al arreglo de pedidos
    pedidos.push(nuevoPedido);
  
    res.status(201).json({ pedido: nuevoPedido });
  };
  
  const getUltimoPedidoByNombre = (req, res) => {
    const nombre = req.query.nombre;
  
    // Buscar el último pedido del alumno por su nombre
    const ultimoPedido = pedidos
      .filter((pedido) => pedido.alumno.nombre === nombre)
      .sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
      .shift();
  
    if (!ultimoPedido) {
      return res.status(404).json({ mensaje: 'No encontrado' });
    }
  
    res.status(200).json(ultimoPedido);
  };

  const deletePedido = (req, res) => {
    const idPedido = parseInt(req.params.id); // Convertir a número
  
    // Buscar el pedido por su ID
    const index = pedidos.findIndex((pedido) => pedido.id === idPedido);
  
    // Verificar si el pedido existe
    if (index === -1) {
      return res.status(404).json({ mensaje: `El pedido no fue encontrado ${idPedido}` });
    }
  
    // Obtener el pedido
    const pedido = pedidos[index];
  
    // Incrementar el stock de la vianda en 1 unidad
    const vianda = pedido.vianda;
    vianda.stock++;
  
    // Habilitar al alumno
    const alumnoDni = pedido.alumno.dni;
    const alumno = alumnos.find((alumno) => alumno.dni === alumnoDni);
    if (alumno) {
      alumno.habilitado = true;
    }
  
    // Eliminar el pedido
    pedidos.splice(index, 1);
  
    res.json({ mensaje: 'El pedido ha sido borrado exitosamente' });
  };
  
  


module.exports = 
{
    getPedido,
    getPedidoById,
    createPedido,
    getUltimoPedidoByNombre,
    deletePedido
}