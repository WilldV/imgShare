const path = require('path');
const {randomNumber} = require('../helpers/libs');
const fs = require('fs-extra');
const {Image} = require('../models');

const ctrl={};

ctrl.index =  async (req,res)=>{
    //expresion regular
    const id = {$regex: req.params.image_id};
    const image = await Image.findOne({filename: id});
    
    res.render('image', {image});
};

ctrl.create = async (req,res) => {
    
    //validamos que no exista ya el nombre de la imagen
    let imgUrl;
    let images
    do{
        imgUrl = randomNumber();
        images = await Image.find({filename: imgUrl});
    }while(images.lenght > 0);
 
    //obetenemos la extension de la peticion (req)
    const ext = (path.extname(req.file.originalname)).toLocaleLowerCase();
    
    //definimos la ruta temporal
    const imageTempPath = req.file.path;
    
    //definimos la ruta objetivo para mover la imagen
    const targetPath = path.resolve(`src/public/upload/${imgUrl}${ext}`);

    if(ext === '.png' || ext ==='.jpg' || ext ==='.jpeg' || ext ==='.gif'){
        await fs.rename(imageTempPath,targetPath);
        const newImg = new Image({
            title: req.body.title,
            filename: imgUrl+ext,
            description: req.body.description
        })
        const imageSaved = await newImg.save();
        res.redirect('/images/' + imgurl);

    }else{
        await fs.unlink(imageTempPath);
        res.status(500).json({error:'Only images are allowed'})
    }
    

};
ctrl.like = (req,res)=>{

};
ctrl.comment = (req,res)=>{

};
ctrl.remove = (req,res)=>{

};

module.exports = ctrl;