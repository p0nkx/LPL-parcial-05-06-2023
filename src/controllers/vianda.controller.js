const viandas = require('../../data/viandas.json')
const httpStatusCodes = require('http2').constants;

const getViandas = (_, res) => {
    res.status(httpStatusCodes.HTTP_STATUS_OK).json(viandas)
}

const getViandaBycodigo = (req, res) => {
    const codigo = req.params.codigo
    const resultado = viandas.find( vianda => vianda.codigo == codigo)
    if(resultado) {
        res.status(200).json(resultado).status(200)
    } else {
        res.status(404).json({ mensaje: `La vianda con codigo ${codigo} no fue encontrado`} )
    }
}

const createVianda = (req, res) => {
    const viandaData = req.body;
  
    // Validar que el código de vianda tenga 5 caracteres y comience con 'V'
    if (!/^V.{4}$/.test(viandaData.codigo)) {
      return res.status(400).json({ error: 'El código de vianda debe tener 5 caracteres y comenzar con "V"' });
    }
  
    // Validar que la vianda no se encuentre registrada previamente
    const existe = viandas.find(vianda => vianda.codigo === viandaData.codigo);
    if (existe) {
      return res.status(400).json({ error: `La vianda con código ${viandaData.codigo} ya está registrada` });
    }
  
    // Validar el tipo de vianda
    const tiposValidos = ['TARTA', 'POLLO', 'PASTA', 'PIZZA', 'EMPANADAS'];
    if (!tiposValidos.includes(viandaData.tipo)) {
      return res.status(400).json({ error: 'Tipo de vianda incorrecta. Los valores disponibles son: TARTA, POLLO, PASTA, PIZZA, EMPANADAS' });
    }
  
    // Validar el stock
    if (viandaData.stock < 0) {
      return res.status(400).json({ error: 'El stock de la vianda debe ser mayor o igual a 0' });
    }
  
    // Crear la nueva vianda
    const nuevaVianda = {
      codigo: viandaData.codigo,
      tipo: viandaData.tipo,
      aptoCeliaco: viandaData.aptoCeliaco || false,
      stock: viandaData.stock,
      descripcion: viandaData.descripcion || '',
    };
  
    viandas.push(nuevaVianda);
    res.status(201).json({ mensaje: `Vianda con código ${viandaData.codigo} registrada correctamente` });
  }
  
  const updateVianda = (req, res) => {
    const codigoVianda = req.params.codigo;
    const viandaData = req.body;
  
    // Buscar la vianda por su código
    const vianda = viandas.find(vianda => vianda.codigo === codigoVianda);
    if (!vianda) {
      return res.status(404).json({ error: `No se encontró ninguna vianda con código ${codigoVianda}` });
    }
  
    // Actualizar los atributos de la vianda si se proporcionan en la solicitud
    if (viandaData.aptoCeliaco !== undefined) {
      vianda.aptoCeliaco = viandaData.aptoCeliaco;
    }
  
    if (viandaData.stock !== undefined) {
      vianda.stock = viandaData.stock;
    }
  
    if (viandaData.descripcion !== undefined) {
      vianda.descripcion = viandaData.descripcion;
    }
  
    res.status(200).json({ mensaje: `Vianda con código ${codigoVianda} actualizada correctamente` });
  };
  




module.exports = 
{
    getViandas,
    getViandaBycodigo,
    createVianda,
    updateVianda
}