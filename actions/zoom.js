/*
 * Pixastic Lib - Zoom filter - v0.1
 * Copyright (c) 2012 Michael Moore, stuporglue@gmail.com, http://stuporglue.org/
 * Dual licenced:
 * License: [http://www.pixastic.com/lib/license.txt]
 * License: [http://www.gnu.org/licenses/gpl-2.0.html]
 */

Pixastic.Actions.zoom = {
    process : function(params) {
	if (Pixastic.Client.hasCanvas()) {
	    var canvas = params.canvas;

	    var width = params.width;
	    var height = params.height;

	    var copy = document.createElement("canvas");
	    copy.width = width;
	    copy.height = height;
	    copy.getContext("2d").drawImage(canvas,0,0,width,height);

	    canvas.width = canvas.width * params.options.factor;
	    canvas.height = canvas.width * params.options.factor;

	    var ctx = canvas.getContext("2d");
	    ctx.scale(params.options.factor,params.options.factor);
	    ctx.drawImage(copy,0,0);

	    params.useData = false;
	    return true;
	}
    },
    checkSupport : function() {
	return Pixastic.Client.hasCanvas();
    }
}