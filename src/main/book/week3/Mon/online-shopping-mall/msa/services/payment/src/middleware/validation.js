const validate = (schema, property = 'body') => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req[property], {
      abortEarly: false,
      stripUnknown: true
    });
    
    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }));
      
      return res.status(400).json({
        error: 'Validation failed',
        details: errors
      });
    }
    
    req[property] = value;
    next();
  };
};

const errorHandler = (err, req, res, next) => {
  console.error('Payment service error:', err);
  
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      error: 'Validation error',
      message: err.message
    });
  }
  
  if (err.message.includes('not found')) {
    return res.status(404).json({
      error: 'Not found',
      message: err.message
    });
  }
  
  if (err.message.includes('Payment intent') || err.message.includes('Stripe')) {
    return res.status(400).json({
      error: 'Payment processing error',
      message: err.message
    });
  }
  
  res.status(500).json({
    error: 'Internal server error',
    message: 'An unexpected error occurred'
  });
};

module.exports = { validate, errorHandler };