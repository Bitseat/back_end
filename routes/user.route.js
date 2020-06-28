let express = require('express'),
  multer = require('multer'),
  mongoose = require('mongoose'),
  router = express.Router();

// Multer File upload settings
const DIR = './resumes/';
const path = require('path');
var fs = require('fs');
const util = require('util');
const exec = util.promisify(require('child_process').exec);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, DIR);
  },
  filename: (req, file, cb) => {
    const fileName = file.originalname.toLowerCase().split(' ').join('-');
    cb(null, fileName)
  }
});

var upload = multer({
  storage: storage,
  // limits: {
  //   fileSize: 1024 * 1024 * 5
  // },
  fileFilter: (req, file, cb) => {
    if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg" || file.mimetype == "application/pdf" || 
    file.mimetype == "application/msword" || 
    file.mimetype == "application/vnd.openxmlformats-officedocument.wordprocessing" || 
    file.mimetype == "application/doc" || 
    file.mimetype == "application/vnd.openxmlformats-officedocument.wordprocessingml.document" || 
    file.mimetype == "application/ms-doc") {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error('Only image, word and pdf format allowed!'));
    }
  }
});

// User model
let User = require('../models/User');

router.post('/create-user', upload.array('avatar', 20), (req, res, next) => {
  const reqFiles = []
  const url = req.protocol + '://' + req.get('host')
  for (var i = 0; i < req.files.length; i++) {
    reqFiles.push(url + '/resumes/' + req.files[i].filename)
    try {
      fs.copyFileSync(path.join(__dirname, '../resumes/'+req.files[i].filename), 
                      path.join(__dirname, '../temp/', req.files[i].filename))
      console.log("Successfully copied and moved the file!")
    } catch(err) {
      throw err
    }
  }

  async function runScript() {
    const { stdout, stderr } = await exec('python3' + ' ' + path.join(__dirname, '../extract_resume.py'));
    console.log('stdout:', stdout);
    console.log('stderr:', stderr);
  }

  runScript();   

  for (var i = 0; i < reqFiles.length; i++) {

    console.log(reqFiles[i])

    var uploaded_file_name = req.files[i].filename
    console.log(uploaded_file_name)
    console.log(uploaded_file_name.slice(0,uploaded_file_name.lastIndexOf('.')));
    let rawdata

    if(!fs.existsSync(path.join(__dirname, '../jsons/'+uploaded_file_name+'.json'))) {
        console.log("File not found");
      }
  
    else {
        rawdata = fs.readFileSync(path.resolve(__dirname, '../jsons/'+uploaded_file_name+'.json'));
        var new_avatar = (url + '/pdfs/' + uploaded_file_name.slice(0,uploaded_file_name.lastIndexOf('.')) + '.pdf')
        let applicant = JSON.parse(rawdata);
        console.log(applicant['name']);
    
        const user = new User({
        _id: new mongoose.Types.ObjectId(),
        avatar: new_avatar,
        name: applicant['name'],
        email: applicant['email'],
        mobile_number: applicant['mobile_number'],
        designation: applicant['designation'],
        degree: applicant['degree'],
        skills: applicant['skills'],
        experience: applicant['experience'],
        total_experience: applicant['total_experience'],
        });
        
        user.save().then(result => {
          console.log(result);
          res.status(201).json({
            message: "Done upload!",
            userCreated: {
              _id: result._id,
              avatar: result.avatar,
              name: result.name,
              email: result.email,
              mobile_number: result.mobile_number,
              designation: result.designation,
              degree: result.degree,
              skills: result.skills,
              experience: result.experience,
              total_experience: result.total_experience,
      
            }
          })
        }).catch(err => {
          console.log(err),
            res.status(500).json({
              error: err
            });
        });

      }

}


router.get("/", async (req, res, next) => {
  try {
  //listing messages in users mailbox 
    User.find().then(data => {
      res.status(200).json({
        message: "User list retrieved successfully!",
        users: data
      });
    });
  } catch (err) {
    next(err);
  }
})

})

module.exports = router;