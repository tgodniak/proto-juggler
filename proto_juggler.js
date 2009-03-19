var Juggler = Class.create({
	// Default params
	defaults: $H({
		prevId:      'prev_btn',
		nextId:      'next_btn',
		itemsToMove: 1,
		itemsToShow: 1,
		vertical:    true,
		duration:    0.5,
		delay:       3.0,
		autoMove:    false,
		autoRewind:  false
	    }),
	initialize: function(element, options) {
	    this.container = $(element);
	    if(!this.container) { return false; }
	    // this.id      = (element.id == null || element.id == '') ? this.generateRandomId() : element.id;
	    this.params  = this.defaults.merge(options);
	    Object.extend(this, this.params);
	    this.init();
	}
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

Juggler.fn.getItemSize = function() {
    var e = this.items.first().childElements().first();
    var size = 0;
    if(this.params.get('vertical')) {
	size += e.getWidth();
	size += parseInt(e.getStyles().marginLeft);
	size += parseInt(e.getStyles().marginRight);
    } else {
	size += e.getHeight();
	size += parseInt(e.getStyles().marginTop) || parseInt(e.getStyles().marginBottom);
    }
    this.params.set('itemSize', size);
};

Juggler.fn.init = function() {
    this.juggler = $(this.container.down('ul'));
    this.juggler.setStyle('position: relative; left: 0px; top: 0px; overflow: hidden;');
    this.items = this.juggler.childElements();
    this.container.setStyle('overflow: hidden; position: relative;');
    this.params.set('itemsCount', this.items.size());
    this.getItemSize();
    if(this.params.get('vertical')) {
	this.items.each(function(el) { el.setStyle('float:left;') });
	this.juggler.setStyle('width:' + (this.params.get('itemSize')*this.params.get('itemsCount')) + 'px;');
	this.container.setStyle('width:' + (this.params.get('itemSize')*this.params.get('itemsToShow')) + 'px;');
    } else {
	this.juggler.setStyle('height:' + (this.params.get('itemSize')*this.params.get('itemsCount')) + 'px;');
	this.container.setStyle('height:' + (this.params.get('itemSize')*this.params.get('itemsToShow')) + 'px;');
    }
    this.moveSize    = this.params.get('itemSize')*this.params.get('itemsToShow');
    this.jugglerSize = this.params.get('itemSize')*this.params.get('itemsCount');
    this.maxToMove   = this.jugglerSize - this.moveSize;
    this.createHandlers();
    this.autoMove(0);
};

Juggler.fn.autoMove = function(delay) {
    var d = (this.params.get('delay') + delay) * 1000
    if(this.params.get('autoMove')) {
	setTimeout(function() {
		this.nextItem();
	    }.bind(this), d);
    }
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
	this.container.parentNode.appendChild(this.prevBtn);
    }
    if(!this.nextBtn) {
	this.nextBtn = new Element('a', {'id':'next_btn','href':'#'}).update(' Next >>');
	this.container.parentNode.appendChild(this.nextBtn);
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

Juggler.fn.rewind = function() {
    var scrollValue = this.jugglerSize - this.moveSize
    var directions  = this.params.get('vertical') ? [scrollValue, 0] : [0, scrollValue];

    this.animate(directions);
    this.autoMove(this.params.get('duration'));

    this.nextBtn.removeClassName('inactive');
    this.prevBtn.addClassName('inactive');
};

Juggler.fn.nextItem = function() {
    var pos = this.currentPosition();
    if(pos > -this.maxToMove){
	var scrollValue = (this.maxToMove + pos < this.moveSize) ? (this.maxToMove + pos) : this.moveSize;
	var directions  = this.params.get('vertical') ? [-scrollValue, 0] : [0, -scrollValue];

	this.animate(directions);
	this.autoMove(this.params.get('duration'));

	this.prevBtn.removeClassName('inactive');
	if(pos - this.moveSize <= -this.maxToMove) { this.nextBtn.addClassName('inactive'); }
    } else {
	if(this.params.get('autoRewind')) { this.rewind(); }
    }
};

Juggler.fn.prevItem = function() {
    var pos = this.currentPosition();
    if(pos < 0) {
	var scrollValue = (pos + this.moveSize > 0) ? (-pos) : this.moveSize;
	var directions  = this.params.get('vertical') ? [scrollValue, 0] : [0, scrollValue];

	this.animate(directions);
	this.params.set('autoMove', false);
	this.nextBtn.removeClassName('inactive');
    }
    if(pos + this.moveSize >= 0) { this.prevBtn.addClassName('inactive'); }
};