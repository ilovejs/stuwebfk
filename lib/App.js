var http = require("http");

module.exports = App;

function App(){
    // 插件有序列表
    var middleList = this._middleList = [];
    
    var self = this;

    this._route_post_handles = {}

    this._route_get_handles = {}
    
    // request事件响应函数
    function handle(req,res){
            
        // 循环执行插件
        var middleIndex = 0; // 插件索引
        
        execMiddle();
        
        // 执行这个函数时，会自动执行下一个middle插件。
        // 至于这个函数的执行，是由插件所控制。
        function next(){
            middleIndex += 1;
            execMiddle();
        }
        
        // 执行插件函数
        function execMiddle(){
            var middle = middleList[middleIndex];
            if(middle){
                middle(req,res,next);
            }else{
               var handle;
               // 判断是GET还是POST方法
               switch(req.method){
                     case "GET":
                         handle = self._route_get_handles[req.url]
                     break;
                     case "POST":
                         handle = self._route_post_handles[req.url]
                     break;
               }        
               if(handle){
                   handle(req,res);
               }
            }
        }        
        
    }
    
    this._server = http.createServer(handle);
    
}

// 加入功能栈
App.prototype.use = function(middle){
    this._middleList.push(middle);
}

App.prototype.get = function(route,handle){
    this._route_get_handles[route] = handle;
}

App.prototype.post = function(route,handle){
    this._route_post_handles[route] = handle;
}

// 监听端口
App.prototype.listen = function(){
    this._server.listen.apply(this._server,arguments);
}