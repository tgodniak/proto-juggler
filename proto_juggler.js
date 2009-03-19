var Juggler = Class.create({
	// Default params
	defaults: $H({
		prevId:      'prev_btn',
		nextId:      'next_btn',
		itemsToMove: 1,
		itemsToShow: 1,
		vertical:    true,
		duration:    0.5
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
    this.juggler.setStyle('position: relative; left: 0px; top: 0px; overflow: hidden;');
    this.items = this.juggler.childElements();
    this.container.setStyle('overflow: hidden;');
    this.params.set('itemsCount', this.items.size());
    if(this.params.get('vertical')) {
	this.items.each(function(el) { el.setStyle('float:left;') });
	this.params.set('itemSize', this.items.first().getWidth());
	this.juggler.setStyle('width:' + (this.params.get('itemSize')*this.params.get('itemsCount')) + 'px;');
	this.container.setStyle('width:' + (this.params.get('itemSize')*this.params.get('itemsToShow')) + 'px;');
    } else {
	this.params.set('itemSize', this.items.first().getHeight());
	this.juggler.setStyle('height:' + (this.params.get('itemSize')*this.params.get('itemsCount')) + 'px;');
	this.container.setStyle('height:' + (this.params.get('itemSize')*this.params.get('itemsToShow')) + 'px;');
    }
    this.moveSize    = this.params.get('itemSize')*this.params.get('itemsToShow');
    this.jugglerSize = this.params.get('itemSize')*this.params.get('itemsCount');
    this.maxToMove   = this.jugglerSize - this.moveSize;
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
	this.prevBtn = new Element('a', {'id':'prev_btn','href':'#'}).update('<< Prev ');
	this.container.parentNode.insert(this.prevBtn);
    }
    if(!this.nextBtn) {
	this.nextBtn = new Element('a', {'id':'next_btn','href':'#'}).update(' Next >>');
	this.container.parentNode.insert(this.nextBtn);
    }
    this.addHandlers();
};

Juggler.fn.currentPosition = function() {
    return this.params.get('vertical') ? parseInt(this.juggler.getStyle('left')) : parseInt(this.juggler.getStyle('top'));
};

Juggler.fn.animate = function(directions) {
    new Effect.Move(this.juggler, { x: directions.first(),
				    y: directions.last(),
				    mode: 'relative',
				    transition: Effect.Transitions.sinoidal,
				    duration: this.params.get('duration')});
};

Juggler.fn.nextItem = function() {
    var pos = this.currentPosition();
    if(pos > -this.maxToMove){
	var scrollValue = (this.maxToMove + pos < this.moveSize) ? (this.maxToMove + pos) : this.moveSize;
	var directions = this.params.get('vertical') ? [-scrollValue, 0] : [0, -scrollValue];
	this.animate(directions);
	this.prevBtn.removeClassName('inactive');
    }
    if(pos - this.moveSize <= -this.maxToMove) {
	this.nextBtn.addClassName('inactive');
    }
};

Juggler.fn.prevItem = function() {
    var pos = this.currentPosition();
    if(pos < 0) {
	var scrollValue = (pos + this.moveSize > 0) ? (-pos) : this.moveSize;
	var directions = this.params.get('vertical') ? [scrollValue, 0] : [0, scrollValue];
	this.animate(directions);
	this.nextBtn.removeClassName('inactive');
    }
    if(pos + this.moveSize >= 0){
	this.prevBtn.addClassName('inactive');
    }
};