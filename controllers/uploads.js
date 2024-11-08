const multer  = require('multer')
const upload = multer({ dest: 'uploads/' })
module.exports.uploadTest = function(req, res){
    return res.status(200).json({
        message:'File uploaded'
    })
}