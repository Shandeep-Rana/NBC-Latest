// // Exception handling middleware
// const exceptionHandlerMiddleware = (err, req, res, next) => {
//     console.error(err.stack);
  
//     const statusCode = err.status || 500;
  
//     res.status(statusCode);
//     res.json({
//       error: {
//         message: err.message || 'Internal Server Error'
//       }
//     });
//   };
  
//   module.exports = exceptionHandlerMiddleware;