var fs = require("fs");

//将异步函数强行转为同步执行
exports.getAllAlbum = function(callback){
	fs.readdir("./uploads", function(err, files){
		var allAlbums = [];
		(function iterator(i){
			if(i == files.length){
				
				callback(allAlbums);
				return;
			}
			fs.stat("./uploads/" + files[i], function(err, state){
				if(state.isDirectory()){
					allAlbums.push(files[i]);
				}
				iterator(i+1);
			});
		})(0);
	});
};

//直接调用同步函数
exports.getAllAlbumSync = function(){
	var allAlbums = [];
	var files = fs.readdirSync("./uploads");
	for(var i=0; i<files.length; i++){
		var state = fs.statSync("./uploads/" + files[i]);
		if(state.isDirectory()){
			allAlbums.push(files[i]);
		}
	}
	
	return allAlbums;
};

exports.getAllImagesByAlbumName = function(albumName, callback){
	var err = null;
	var allImages = [];
	if(exports.getAllAlbumSync().indexOf(albumName)==-1){
		err = "找不到相册文件夹："+albumName;
		allImages = null;
		callback(err, allImages);
		return;
	}
	
	var files = fs.readdirSync("./uploads/"+albumName);
	
	for(var i=0; i<files.length; i++){
		var state = fs.statSync("./uploads/" + albumName+ "/" + files[i]);
		if(state.isFile()){
			allImages.push(files[i]);
		}
	}
	
	callback(err, allImages);
};

exports.createNewFolder = function(folderName, callback){
	fs.mkdir("./uploads/"+folderName, function(err){
		callback(err);
	});
};