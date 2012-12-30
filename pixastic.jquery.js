/*
 * Pixastic Lib - jQuery plugin
 * Copyright (c) 2008 Jacob Seidelin, jseidelin@nihilogic.dk, http://blog.nihilogic.dk/
 * License: [http://www.pixastic.com/lib/license.txt]
 */

if (typeof jQuery != "undefined" && jQuery && jQuery.fn) {
	jQuery.fn.pixastic = function(action, options) {
		var newElements = [];
		this.each(
			function () {
				var newOptions = jQuery.extend({}, options);
				if (this.tagName.toLowerCase() == "img" && !this.complete) {
					return;
				}
				if (action === "revert") {
					var res = Pixastic.revert(this);
				} else {
					var res = Pixastic.process(this, action, newOptions);
				}
				if (res) {
					newElements.push(res);
				}
			}
		);
		if (newElements.length > 0)
			return jQuery(newElements);
		else
			return this;
	};

};
