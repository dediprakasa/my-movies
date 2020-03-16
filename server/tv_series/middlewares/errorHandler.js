module.exports = (err, req, res, next) => {
  let statusCode = 500
  let errors = []
  console.log(err.message, '<<<< error')

  if (err.name === 'ValidationError') {
    for (let key in err.errors) {
      errors.push(err.errors[key].message)
    }
  } else {
    statusCode = err.statusCode || 500
    let msg = err.message || 'Internal server error'
    errors = [msg]
  }
  res.status(statusCode).json({ errors })
}