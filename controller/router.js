var file = require('../models/file.js');
var formidable = require('formidable');
var fs = require('fs');
var date = require('silly-datetime');
var path = require('path');

exports.showIndex = function(req, res){
	// 调用异步函数
	file.getAllAlbum(function(allAlbum){
		res.render("index", {
			"albums": allAlbum
		});
	});
	//调用同步函数
	// res.render("index", {
	// 	"albums": file.getAllAlbumSync()
	// });
};

exports.showAlbum = function(req, res, next){
	var albumName = req.params.albumName;
	
	file.getAllImagesByAlbumName(albumName, function(err, allImages){

		if(err){
			console.log(err);
			next();
			return;
		}
		res.render("album", {
			"albumName": albumName,
			"images": allImages,
		});
	});
};

exports.showUp = function(req, res, next){
	
	res.render("up", {
		"albums": file.getAllAlbumSync()
	});
}

exports.doPost = function(req, res, next){
	
	var form = new formidable.IncomingForm();
	//临时路径
	form.uploadDir = "./uploads/";
	// form.multiples = true;
    form.parse(req, function(err, fields, files) {
    	
    	var time = date.format(new Date(), 'YYYYMMDDHHmmss');
    	var ran = parseInt(Math.random() * 89999 + 10000);
    	var extname = path.extname(files.tupian.name);
    	var newName = "./uploads/"+ fields.wenjianjia + "/" + time + ran + extname;
    	
    	fs.rename(files.tupian.path, newName, function(err){
    		if(err){
    			console.log(err);
    		}
    	});
    	res.redirect('/'+fields.wenjianjia);
    });
};

exports.doCreate = function(req, res, next){
	var form = new formidable.IncomingForm();
	
    form.parse(req, function(err, fields, files) {
    	
    	file.createNewFolder(fields.folderName, function(error){
    		if(error){
    			console.log("创建失败");
    			res.redirect('/');
    			return;
    		}
    		res.redirect('/');
    	});
    });
}