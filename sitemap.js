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
	this.url = url;
	this.x = x;
	this.y = y;
	
	this.circle = sitemap.paper.circle(x, y, 10);
	this.circle.attr("fill", "#f00");
	this.circle.attr("stroke", "#fff");

	this.links = [];

	this.move = function (x,y) {
		this.x = x;
		this.y = y;
	};

	this.animate = function () {
		this.circle.animate({'cx':this.x,'cy':this.y}, 2000, '>');
		for (url in this.links) {
			this.links[url].animate();
		}
	};

	this.addLink = function (url, to) {
		if (this.links[url] != undefined) return;
		this.links[url] = new Link(this, to);
		//to.links[this.url] = this.links[to];
	};
}

var sitemap = {
	adjustTimeout: null,

	nodes: [],

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

	addNode: function(url) {
		if (this.nodes[url] != undefined) return;
		this.nodes[url] = new Node(url, Math.random()*this.width, Math.random()*this.height);
	},

	addLink: function(from, to) {
		this.addNode(from); this.addNode(to);

		if (to < from) { var x = from; from = to; to = x; }
		this.nodes[from].addLink(to, this.nodes[to]);

	}
};

