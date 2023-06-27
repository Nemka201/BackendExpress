const pool = require('./db.js');
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const indexRouter = require('./routes/index.js');
const crypto = require('crypto');
const usersRouter = require('./routes/users.js');
const port = 3030;
const app = express();
const cors = require('cors');


// view engine setup

app.listen(port, () => {
  console.log(`Servidor Express iniciado en el puerto ${port}`);
});

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/Users', usersRouter);

// Register API
app.post('/Api/Register', async (req, res) => {
  try {
    // Obtén los datos del usuario desde el cuerpo de la solicitud
    const { username, password, name, year, gender } = req.body;
    // Declaro el Query
    const sql = 'INSERT INTO users (username, password, name, year, gender) VALUES (?, ?, ?, ?, ?)';
    // Inserto los valores y Hasheo el password
    const values = [username, Sha256(password), name, year, gender];
    await pool.query(sql,values, (error,result) =>{
    if (error) {
      console.error('Error en la consulta SQL:', error);
      res.status(500).json({ message: 'Error en el registro' });
      return;
    }});
    const responseObj = {
      user: {
        username,
        name,
        year,
        gender
      }, message: 'Registro exitoso'
    };
    res.json(responseObj);

  } catch (error) {
    console.error('Error en el registro:', error);
    res.status(500).json({ message: 'Error en el registro' });
  }
});
// Login API
app.post('/Api/Login', async (req, res) => {

  const { username, password } = req.body;
  try {
    // Consultar el usuario y contraseña en la tabla
    const [rows] = await pool.query(
      'SELECT * FROM users WHERE username = ? AND password = ?',
      [username, Sha256(password)]
    );
      
    // Verificar si se encontró un usuario con los datos proporcionados
    if (rows.length > 0) {
      // Usuario y contraseña válidos, enviar los datos del usuario como respuesta
      const user = rows[0];
      const userData = {
        username: user.username,
        name: user.name,
        year: user.year,
        gender: user.gender
      };
      res.json(userData);
    } else {
      // Usuario o contraseña incorrectos, enviar una respuesta de error
      res.status(401).json({ message: 'Credenciales inválidas' });
    }
  } catch (error) {
    // Error al ejecutar la consulta SQL, enviar una respuesta de error
    console.error('Error en la consulta SQL:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// Funciones

function Sha256(input) {
  const hash = crypto.createHash('sha256');
  hash.update(input);
  return hash.digest('hex');
}

module.exports = app;
