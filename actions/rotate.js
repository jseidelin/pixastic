/*
 * Pixastic Lib - Rotate - v0.1.0
 * Copyright (c) 2009 Jacob Seidelin, jseidelin@nihilogic.dk, http://blog.nihilogic.dk/
 * License: [http://www.pixastic.com/lib/license.txt]
 */

Pixastic.Actions.rotate = {
	process : function(params) {
		if (Pixastic.Client.hasCanvas()) {
			var canvas = params.canvas;

			var width = params.width;
			var height = params.height;

			var copy = document.createElement("canvas");
			copy.width = width;
			copy.height = height;
			copy.getContext("2d").drawImage(canvas,0,0,width,height);

			var angle = parseFloat(params.options.angle) * Math.PI / 180;

			var diag = Math.sqrt(width*width + height*height);

			var diagAngle = Math.atan2(height, width);

			if (angle < 0) diagAngle = -diagAngle;

			var newHeight = Math.abs(Math.sin(diagAngle + angle) * diag);
			var newWidth = Math.abs(Math.cos(-diagAngle + angle) * diag);

			canvas.width = newWidth;
			canvas.height = newHeight;

			var ctx = canvas.getContext("2d");
			ctx.translate(newWidth/2, newHeight/2);
			ctx.rotate(angle);
			ctx.drawImage(copy,-width/2,-height/2);

			params.useData = false;
			return true;
		}
	},
	checkSupport : function() {
		return Pixastic.Client.hasCanvas();
	}
}


