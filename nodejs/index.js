const express = require('express');
const cheerio = require('cheerio');
const superagent = require('superagent');

var app = express();

var targetUrl = 'office.qq.com'; //目标网站;
var jsLibraryInput = 'jquery'; //输入的js库,可包含通匹配符'*'
var jsLibraryArr = jsLibraryInput.split('*');//分割字符串,这里假设只有一个通匹配符
var jsLibrary = new RegExp(jsLibraryArr[0]+'.'+jsLibraryArr[1]);
app.get('/',(req,res,next)=>{
	superagent.get(targetUrl)
		.end((err,sres)=>{
			if(err) {
				return next(err)
			}
		

			var $ = cheerio.load(sres.text)

			var result ='不存在';

			$('script').each(function(index,item){
				var $item = $(item);
				if(jsLibrary.test($item.attr('src'))) {
					result = '存在'
				}
			})

			res.send(result)
		})
})

app.listen(3000,()=>{
	console.log('listening')
})