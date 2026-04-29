const errorHandler = (err, req, res, next) => {
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: 'error',
        message: err.message,
      });
    }
  
    if (err.code === 'P2002') {
      return res.status(409).json({
        status: 'error',
        message: `Já existe um registro com esse ${err.meta?.target?.join(', ')}.`,
      });
    }
  
    if (err.code === 'P2025') {
      return res.status(404).json({
        status: 'error',
        message: 'Registro não encontrado.',
      });
    }
  
    console.error('ERROR:', err);
  
    return res.status(500).json({
      status: 'error',
      message: 'Erro interno no servidor.',
    });
  };
  
  module.exports = errorHandler;