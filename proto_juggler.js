var Juggler = Class.create({
	// Default params
	defaults: $H({
		prevId:      'prev_btn',
		nextId:      'next_btn',
		itemsToMove: 1,
		itemsToShow: 1,
		itemSize:    100,
		vertical:    true
	    }),
	initialize: function(element, options) {
	    this.container = $(element);
	    if(!this.container) { return false; }
	    // this.id      = (element.id == null || element.id == '') ? this.generateRandomId() : element.id;
	    this.params  = this.defaults.merge(options);
	    Object.extend(this, this.params);
	    this.init();
	},
    });

Juggler.fn = Juggler.prototype;

Juggler.fn.generateRandomId = function() {
    var chars = "ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
    var stringLength = 10;
    var randomString = '';
    for (var i = 0; i < stringLength; i++) {
	var rnum = Math.floor(Math.random() * chars.length);
	randomString += chars.substring(rnum, rnum + 1);
    }
    return randomString;
};

Juggler.fn.init = function() {
    this.juggler = $(this.container.down('ul'));
    this.juggler.setStyle('position: relative; left: 0px; top: 0px;');
    this.items = this.juggler.childElements();
    this.container.setStyle('overflow:hidden');
    this.params.set('itemsCount', this.items.size());
    if(this.params.get('vertical')) {
	this.items.each(function(el) { el.setStyle('float:left;') });
	this.params.set('itemSize', this.items.first().getWidth());
	this.juggler.setStyle('width:' + (this.params.get('itemSize')*this.params.get('itemsCount')) + 'px;');
	this.container.setStyle('width:' + (this.params.get('itemSize')*this.params.get('itemsToShow')) + 'px;');
    } else {
	this.params.set('itemSize', this.items.first().getHeight());
	this.container.setStyle('height:' + (this.params.get('itemSize')*this.params.get('itemsCount')) + 'px;');
	this.juggler.setStyle('height:' + (this.params.get('itemSize')*this.params.get('itemsToShow')) + 'px;');
    }
    this.createHandlers();
};

Juggler.fn.addHandlers = function() {
    if(this.get('itemsCount') > this.params.get('itemsToShow')) {
	this.nextBtn.onclick = function() {this.nextItem();return false;}.bind(this);
	this.prevBtn.onclick = function() {this.prevItem();return false;}.bind(this);
    } else {
	this.prevBtn.onclick = function() {return false;};
	this.nextBtn.onclick = function() {return false;};
	this.nextBtn.addClassName('inactive');
    }
    this.prevBtn.addClassName('inactive');
};

Juggler.fn.createHandlers = function() {
    this.prevBtn = $(this.params.get('prevId'));
    this.nextBtn = $(this.params.get('nextId'));
    if(!this.prevBtn) {
	this.prevBtn = new Element('a', {'id':'prevBtn','href':'#'}).update('<< Prev ');
	this.container.insert(this.prevBtn);
    }
    if(!this.nextBtn) {
	this.nextBtn = new Element('a', {'id':'nextBtn','href':'#'}).update(' Next >>');
	this.container.insert(this.nextBtn);
    }
    this.addHandlers();
}