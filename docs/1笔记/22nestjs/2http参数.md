# http 参数

对于前端来说，后端主要是提供 http 接口来传输数据，而这种数据传输的方式主要有 5 种：

- url param
- query
- form-urlencoded
- form-data
- json

## url param

就是路径参数

如 `https://baidu.com/person/1111`的 1111

## query

就是查询参数

如 `https://baidu.com/person?name=jack&age=18`

汉字等特殊字符需要用 encodeURIComponent api 编码然后 decodeURIComponent 解码，或者使用 query-string 等库

## form-urlencoded

表单参数，和 query 字符串的方式的区别只是放在了 body 里并且请求头指定 content-type 是 application/x-www-form-urlencoded

内容一样需要 encode 与 decode，所以大数据就很慢了

## form-data

一般是文件

form-data 需要指定 content type 为 multipart/form-data，然后指定 boundary

boundary 就是用 --------- + 一串数字做为分隔符,如`------WebKitFormBoundaryVEod2Um21K0wAwOa`

## json

指定 content type 为 application/json，或者不指定也可以，默认也是 application/json
