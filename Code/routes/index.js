var router = require('express').Router();

router.all('/', function (req, res, next) {
  res.render('game', {
    title: 'Asteroids',
  });
});

module.exports = router;
