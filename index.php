<?php

require 'config.php';

?>
<html>
<head>
<link rel="stylesheet" type="text/css" href="stylesheet.css"/>
<script type="text/javascript" src="ext/raphael/raphael.js"></script>
<script type="text/javascript" src="sitemap.js"></script>
<script type="text/javascript">

function init() {
	// Creates canvas 320 × 200 at 10, 50
	sitemap.init();
	sitemap.addNode('/');
	sitemap.addNode('/clients');
	sitemap.addNode('/client/add');
	sitemap.addNode('/client/modify');
	sitemap.addNode('/services');
	sitemap.addNode('/setup/client');

	sitemap.addLink('/', '/clients');
	sitemap.addLink('/', '/client/add');
	sitemap.addLink('/', '/client/modify');
	sitemap.addLink('/', '/services');
	sitemap.addLink('/', '/setup/client');

	sitemap.addLink('/clients', '/client/add');
	sitemap.addLink('/client/add', '/client/modify');
}
</script>
</head>
<body onload="init();">

</body>
</html>
