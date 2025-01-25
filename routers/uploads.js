const express = require('express');
const Router = express.Router();
const multer  = require('multer')
var fs = require('fs');


const storage = multer.diskStorage({
    destination:'assets/uploads/'+new Date().toLocaleDateString('en-IN',{day:'2-digit',month:'2-digit',year:'numeric'}).split("/").join("_"),
    filename: function (req, file, cb) {
      cb(null, req.body.timeStamp+'_'+req.body.fileName)
    }
})
  
const upload = multer({storage:storage })

const uploadsHandler = require('../controllers/uploads')
const passport = require('../configs/passport-local-strategy')
Router.post('/report', upload.any('file'), uploadsHandler.uploadTest);
module.exports = Router;
