<?php

require 'config.php';

?>
<html>
<head>
<link rel="stylesheet" type="text/css" href="stylesheet.css"/>
<script type="text/javascript" src="ext/raphael/raphael.js"></script>
<script type="text/javascript" src="sitemap.js"></script>
<script type="text/javascript">

function choice(arr) {
	return arr[Math.floor(Math.random()*arr.length)];
}
function init() {
	// Creates canvas 320 × 200 at 10, 50
	sitemap.init();

	var map = {
		'/': {'link': ['/clients', '/client/add', '/client/modify', '/services', '/setup/client']},
		'/clients': {'link': ['/client/add', '/client/modify','/']},
		'/client/add': {'link': ['/client/modify','/']},
		'/client/modify': {'link': ['/client/add','/']},
		'/services': {'link':['/']},
		'/setup': {'link':['/setup/client','/']},
		'/setup/client': {'link':['/']}
	};

	var k; var j;

	for (k in map) {
		sitemap.addNode(k);
		for (j in map[k]['link']) {
			sitemap.addLink(k, map[k]['link'][j]);
		}
	}

	var clients = ['/', '/clients', '/services'];
	for (k in clients) {
		setInterval(function() {
			var move = choice(map[clients[k]]['link']);
			clients[k] = move; 
			sitemap.pageview(k, clients[k]);
		}, 250+Math.random()*2000);
	}
}
</script>
</head>
<body onload="init();">

</body>
</html>
