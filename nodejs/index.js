const express = require('express');
const cheerio = require('cheerio');
const superagent = require('superagent');

var app = express();

var targetUrls = []; //目标网站;
var topNumber = 100;// Top100
var jsLibraryInput = 'jquery.m  .js'; //输入的js库,可包含通匹配符' '(空格)
var jsLibraryInput = jsLibraryInput.replace(/\s/g,'.');//将输入的通匹配符替换成正则中的通匹配符
var jsLibrary = new RegExp(jsLibraryInput);

function getRankedSite(number) {

	var pageCount = Math.ceil(number/20);
	for(var i = 0; i < pageCount; i++) {
		var count = i==0? '':i;
		superagent.get('www.alexa.cn/siterank'+count)
			.end((err,sres)=>{
				if(err) {
					return next(err)
				}

				var $ = cheerio.load(sres.text);

				$('.info-wrap').each(function(index,item) {
					var $item = $(item),
						targetUrls.push($item.find('a').text());
				})
			})
	}
}

app.get('/',(req,res,next)=>{
	getRankedSite(30);
	for(var i = 0; i < targetUrls.length;i++) {
		superagent.get(targetUrls[i])
			.end((err,sres)=>{
				if(err){
					return next(err)
				}

				var $ = cheerio.load(sres.text),
					result = [];

				$('script').each(function(index,item){
					var $item = $(item)
					if(jsLibrary.test($item.attr('src'))) {
						result.push(targetUrls[i])
					}
				})
				res.send(targetUrls[i])
			})
	}
})
// app.get('/',(req,res,next)=>{
// 	superagent.get(targetUrl)
// 		.end((err,sres)=>{
// 			if(err) {
// 				return next(err)
// 			}
		

// 			var $ = cheerio.load(sres.text)

// 			var result ='不存在';

// 			$('script').each(function(index,item){
// 				var $item = $(item);
// 				if(jsLibrary.test($item.attr('src'))) {
// 					result = '存在'
// 				}
// 			})

// 			res.send(result)
// 		})
// })

app.listen(3000,()=>{
	console.log('listening')
})