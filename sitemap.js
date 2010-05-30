function Link(from, to) {
	this.from = from;
	this.to = to;

	this.line = sitemap.paper.path("M"+this.from.x+" "+this.from.y+"L"+this.to.x+" "+this.to.y);
	this.line.attr("stroke", "#fff");

	this.animate = function() {
		this.line.animate({'path':"M"+this.from.x+" "+this.from.y+"L"+this.to.x+" "+this.to.y}, 2000, '>');
	}
};
function Node(url, x, y) {
	var n = this;

	this.url = url;
	this.x = x;
	this.y = y;
	
	var circle = sitemap.paper.circle(x, y, 10);
	circle.attr("fill", "#f00");
	circle.attr("stroke", "#fff");

	var label = sitemap.paper.text(x, y-25, url)
									.attr({"font": '10px Fontin-Sans, Arial', stroke: "none", fill: "#fff"}).hide();
								
	var box = label.getBBox();
	var bg = sitemap.paper.rect(box.x-5,box.y-5,box.width+10,box.height+10,4);
	bg.attr('fill', '#222').hide();
	label.toFront();

	circle.node.onmouseover = function() {
		label.attr({'x':n.x,'y':n.y-25});
		box = label.getBBox();
		bg.attr({'x':box.x-5,'y':box.y-5});
		bg.show();
		label.show();
	};
	circle.node.onmouseout = function() {
		bg.hide();
		label.hide();
	};
	
	this.links = [];

	this.move = function (x,y) {
		this.x = x;
		this.y = y;
	};

	var animating = false;

	this.zorder = function () {
		circle.toFront();
		bg.toFront();
		label.toFront();
	};
	this.animate = function () {
		// Override any animations
		animating = true;
		circle.animate({'cx':this.x,'cy':this.y, 'fill':'#f00'}, 2000, '>', function() {
			animating = false;
		});
		for (url in this.links) {
			this.links[url].animate();
		}
	};

	this.addLink = function (url, to) {
		if (this.links[url] != undefined) return;
		this.links[url] = new Link(this, to);
		//to.links[this.url] = this.links[to];
	};

	this.pageview = function() {
		if (animating) return;
		circle.animate({'fill': '#0f0'}, 300, function() {
			circle.animate({'fill':'#f00'},1000);
		});
	};
}

var sitemap = {
	adjustTimeout: null,

	nodes: [],
	clients: [],

	init: function() {
		this.width = window.innerWidth;
		this.height = window.innerHeight;
		this.paper = Raphael(0, 0, this.width, this.height);

		window.onresize = function(){sitemap.resize();};
	},

	resize: function() {
		this.width = window.innerWidth;
		this.height = window.innerHeight;
		this.paper.setSize(this.width, this.height);

		if (this.adjustTimeout) clearTimeout(this.adjustTimeout);
		this.adjustTimeout = setTimeout(function() { sitemap.adjust(); }, 100);

	},

	adjust: function() {
		this.adjustTimeout = null;
		for (url in this.nodes) {
			this.nodes[url].move(Math.random()*this.width, Math.random()*this.height);
		}
		for (url in this.nodes) {
			this.nodes[url].animate();
		}
	},
	
	pageview: function(client, url) {
		var to = this.nodes[url];
		if (this.clients[client] != undefined) {
			var from = this.nodes[this.clients[client]];
			var circle = this.paper.circle(from.x, from.y, 1);
			circle.attr('fill', '#fff');

			
			circle.animate({'cx': from.x + (to.x-from.x)/2.0, 'cy': from.y + (to.y-from.y)/2.0, 'r': 7}, 1000, function() {
				circle.animate({'cx': to.x, 'cy': to.y, 'r': 1}, 1000, function() {
					circle.remove();
				});
			});


		}
		this.clients[client] = url;
		this.nodes[url].pageview();
	},

	addNode: function(url) {
		if (this.nodes[url] != undefined) return;
		this.nodes[url] = new Node(url, Math.random()*this.width, Math.random()*this.height);
		for (url in this.nodes) { this.nodes[url].zorder(); } // TODO : run this less
	},

	addLink: function(from, to) {
		this.addNode(from); this.addNode(to);

		if (to < from) { var x = from; from = to; to = x; }
		this.nodes[from].addLink(to, this.nodes[to]);

		for (url in this.nodes) { this.nodes[url].zorder(); } // TODO : run this less
	}
};

