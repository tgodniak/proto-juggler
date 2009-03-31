var Juggler = Class.create({
	// Default params
	defaults: $H({
		prevId:      'prev_btn',
		nextId:      'next_btn',
		itemsToMove: 1,
		itemsToShow: 1,
		horizontal:    true,
		duration:    0.5,
		delay:       3.0,
		autoMove:    false,
		autoRewind:  false,
		itemSize:    0,
		itemsInRow:  1
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
    var size = 0;
    if(this.params.get('itemSize') != 0) {
	size = this.params.get('itemSize');
    } else {
	if(this.params.get('horizontal')) {
	    size = this.itemWidth();
	} else {
	    size = this.itemHeight();
	}
    }
    this.params.set('itemSize', size);
};

Juggler.fn.itemWidth = function() {
    var e = this.items.first().childElements().first();
    var width = 0;
    width += e.getWidth();
    width += parseInt(e.getStyles().marginLeft);
    width += parseInt(e.getStyles().marginRight);
    return width;
};

Juggler.fn.itemHeight = function() {
    var e = this.items.first().childElements().first();
    var height = 0;
    height += e.getHeight();
    height += parseInt(e.getStyles().marginTop);
    height += parseInt(e.getStyles().marginBottom);
    return height;
};

Juggler.fn.init = function() {
    this.juggler = $(this.container.down('ul'));
    this.juggler.setStyle('position: relative; left: 0px; top: 0px; overflow: hidden;');
    this.items = this.juggler.childElements();
    this.container.setStyle('overflow: hidden; position: relative;');
    this.params.set('itemsCount', this.items.size());
    this.getItemSize();
    this.items.each(function(el) { el.setStyle('float:left;') });
    if(this.params.get('horizontal')) {
	this.juggler.setStyle('width:' + (this.params.get('itemSize')*this.params.get('itemsCount')) + 'px;');
	this.container.setStyle('width:' + (this.params.get('itemSize')*this.params.get('itemsToShow')) + 'px;');
    } else {
	this.juggler.setStyle('height:' + (this.params.get('itemSize')*this.params.get('itemsCount')) + 'px;');
	this.container.setStyle('height:' + (this.params.get('itemSize')*this.params.get('itemsToShow')) + 'px;');
	this.container.setStyle('width:' + (this.itemWidth()*this.params.get('itemsInRow')) + 'px;');
    }
    this.moveSize    = this.params.get('itemSize')*this.params.get('itemsToMove');
    this.jugglerSize = this.params.get('itemSize')*Math.ceil(this.params.get('itemsCount')/this.params.get('itemsInRow'))
    this.maxToMove   = this.jugglerSize - this.params.get('itemSize')*this.params.get('itemsToShow');
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
	this.nextBtn.addClassName('next-inactive');
    }
    this.prevBtn.addClassName('prev-inactive');
};

Juggler.fn.createHandlers = function() {
    this.prevBtn = $(this.params.get('prevId'));
    this.nextBtn = $(this.params.get('nextId'));
    var wrapper = new Element('div', {'id':'juggler_wrapper'});
    $(this.container.parentNode).insert(wrapper);
    wrapper.insert(this.container);
    if(!this.prevBtn) {
	this.prevBtn = new Element('a', {'id':'prev_btn','href':'#'}).update('<< Prev ');
	wrapper.insert(this.prevBtn);
    }
    if(!this.nextBtn) {
	this.nextBtn = new Element('a', {'id':'next_btn','href':'#'}).update(' Next >>');
	wrapper.insert(this.nextBtn);
    }
    this.addHandlers();
};

Juggler.fn.currentPosition = function() {
    return this.params.get('horizontal') ? parseInt(this.juggler.getStyle('left')) : parseInt(this.juggler.getStyle('top'));
};

Juggler.fn.animate = function(directions) {
    new Effect.Move(this.juggler, { x: directions.first(),
				    y: directions.last(),
				    mode: 'relative',
				    transition: Effect.Transitions.sinoidal,
				    duration: this.params.get('duration')});
};

Juggler.fn.rewind = function() {
    var scrollValue = -this.currentPosition();
    var directions  = this.params.get('horizontal') ? [scrollValue, 0] : [0, scrollValue];

    this.animate(directions);
    this.autoMove(this.params.get('duration'));

    this.nextBtn.removeClassName('next-inactive');
    this.prevBtn.addClassName('prev-inactive');
};

Juggler.fn.nextItem = function() {
    var pos = this.currentPosition();
    if(pos > -this.maxToMove){
	var scrollValue = (this.maxToMove + pos < this.moveSize) ? (this.maxToMove + pos) : this.moveSize;
	var directions  = this.params.get('horizontal') ? [-scrollValue, 0] : [0, -scrollValue];

	this.animate(directions);
	this.autoMove(this.params.get('duration'));

	this.prevBtn.removeClassName('prev-inactive');
	if(pos - this.moveSize <= -this.maxToMove) { this.nextBtn.addClassName('next-inactive'); }
    } else {
	if(this.params.get('autoRewind')) { this.rewind(); }
    }
};

Juggler.fn.prevItem = function() {
    var pos = this.currentPosition();
    if(pos < 0) {
	var scrollValue = (pos + this.moveSize > 0) ? (-pos) : this.moveSize;
	var directions  = this.params.get('horizontal') ? [scrollValue, 0] : [0, scrollValue];

	this.animate(directions);
	this.params.set('autoMove', false);
	this.nextBtn.removeClassName('next-inactive');
    }
    if(pos + this.moveSize >= 0) { this.prevBtn.addClassName('prev-inactive'); }
};