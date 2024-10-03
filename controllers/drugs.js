const DrugsData = require('../models/drugs')
module.exports.addDrug = function(req, res){
    try{
        let drug = DrugsData.create({
            DrugName:req.body.DrugName,
        })
    }catch(err){

    }
}
function removeDrug(){}
function updateDrug(){}
