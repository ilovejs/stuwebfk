var url = require("url"),
    fs = require("fs");

// 把URL转换成资源路径
function url2path(url_str){
    var urlObj = url.parse(url_str); 
    var path = urlObj.path;
    return path;
}

module.exports = function static(parent_path){
    
    return function(req,res,next){  // 这个插件无需调用next。
       var path = url2path(req.url);
       function callback(err,data){
             if(err){
                 // res.statusCode = 404;
                 // 如果找不到资源，直接next()
                 next();
             }
             else{
                res.write(data);
                res.end();  
             }
       }
       fs.readFile(parent_path+path,callback);
    }
    
}