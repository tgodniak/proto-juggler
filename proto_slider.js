var ProtoSlider = Class.create({
	initialize: function(element, options) {
	    this.element = $(element);
	    this.id      = (element.id == null || element.id == '') ? this.generateRandomId() : element.id;
	    this.params  = options    || {};
	    Object.extend(this, options);
	}
    });

ProtoSlider.fn = ProtoSlider.prototype;

ProtoSlider.fn.generateRandomId = function() {
    var chars = "ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
    var stringLength = 10;
    var randomString = '';
    for (var i = 0; i < stringLength; i++) {
	var rnum = Math.floor(Math.random() * chars.length);
	randomString += chars.substring(rnum, rnum + 1);
    }
    return randomString;
};
