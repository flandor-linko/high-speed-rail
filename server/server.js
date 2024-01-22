
const express = require('express')   //引入express
const bodyParser = require('body-parser')   // 解析参数

const app = express();

app.use(bodyParser())  // 获取 post请求传递来的参数
const port = 6000  //（监听的端口号）

// 解决跨域
app.all("*", function (req, res, next) {
    //设置允许跨域的域名，*代表允许任意域名跨域
    res.header("Access-Control-Allow-Origin", "*");
    //允许的header类型
    res.header("Access-Control-Allow-Headers", "content-type");
    //跨域允许的请求方式
    res.header("Access-Control-Allow-Methods", "DELETE,PUT,POST,GET,OPTIONS");
    next();
});
 
// 测试是否连接成功
app.get('/', (req, res) => {
    console.log();
    res.send({
        data: '连接成功----',
        status: 200
    })
})
 
app.listen(port, () => {
    console.log(`连接成功`)
})
