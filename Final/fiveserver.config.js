module.exports = {
  port: 5500,

  middleware: [
    (req, res, next) => {
      if (req.url === '/menu' || req.url.startsWith('/menu/')) {
        req.url = '/menu.html';
      }

      next();
    }
  ]
};
