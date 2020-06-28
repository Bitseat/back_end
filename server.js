const express = require('express'),
      cors = require('cors'),
      path= require('path'),
      bodyParser= require('body-parser'),
      mongoose= require('mongoose'),
      config = require('./DB');
      businessRoute = require('./routes/business-route');

      mongoose.connect(config.DB,{useNewUrlParser:true}).then(() => {
        console.log("Connected to Database");
        }).catch((err) => {
            console.log("Not Connected to Database ERROR! ", err);
        });

const app = express();

// Routes to Handle upload Request
const userRoute = require('./routes/user.route')

app.use(bodyParser.json());
app.use(cors());



// Make Images "Uploads" Folder Publicly Available
app.use('/public', express.static('public'));

app.use('/resumes', express.static('resumes'));

app.use('/jsons', express.static('jsons'));

app.use('/pdfs', express.static('pdfs'));


// API Route
app.use('/api', userRoute)
app.use('/api/business', businessRoute);

// start server
const port = process.env.NODE_ENV === 'production' ? (process.env.PORT || 80) : 5000;
const server = app.listen(port, function () {
    console.log('Server listening on port ' + port);
});