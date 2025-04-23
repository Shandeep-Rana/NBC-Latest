  const express = require("express"); 
  const knexConfig = require('./knexfile');
  const knex = require('knex')(knexConfig['development']);
  const app = express();
  const cors = require('cors');
  const bodyParser = require('body-parser');
  const { specs, swaggerUi } = require('./swaggerConfig');
  require('dotenv').config();
  require("./schedulers/cron")

  app.use(bodyParser.json({ limit: '10mb' }));

  app.use((req, res, next) => {
    next();
  });

  // const allowedOrigins = ["http://localhost:3000", "https://staging.nangalbycycle.com"];
  const allowedOrigins = ["http://localhost:3000", "https://nangalbycycle.com"];

  app.use(cors({
  origin: function (origin, callback) {
    // Check if the origin is in the allowedOrigins array or if it is undefined (allowing requests from browsers)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));

 app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

  app.get("/", (req, res) => {
    res.send("Hello World 3 ");
  });
  const constants = require("../src/constants/index");
  const { transporter, transporter2  } = require("../middelware/emailTranspoter");

  // app.use('/public', express.static('public'))
  app.use(`/${constants.STATIC_FILES_PATH}`, express.static(`${constants.STATIC_FILES_PATH}`));
  app.use(require("./router/router"));

  const port = process.env.PORT || 5000;

  app.listen(port, () => {
    console.log(`Connection is successful on ${port}`);
  });

  knex.raw('SELECT 1+1 as result').then((result) => {
    console.log('Connected to the database:', result[0][0].result === 2);
  }).catch((error) => {
    console.error('Error connecting to the database:', error);
  });

  transporter.verify((error, success) => {
    if (error) {
      console.error('Error:', error);
    } else {
      console.log('Server is ready to take our messages');
    }
  });