const express = require('express');
const Router = express.Router();
const multer  = require('multer')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, 'testFile.txt')
    }
})
  
const upload = multer({storage:storage })
const uploadsHandler = require('../controllers/uploads')
const passport = require('../configs/passport-local-strategy')
Router.post('/report', upload.any(), uploadsHandler.uploadTest);
module.exports = Router;
