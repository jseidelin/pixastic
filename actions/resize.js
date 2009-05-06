/*
 * Pixastic Lib - Resize - v0.1.0
 * Copyright (c) 2009 Jacob Seidelin, jseidelin@nihilogic.dk, http://blog.nihilogic.dk/
 * License: [http://www.pixastic.com/lib/license.txt]
 */

Pixastic.Actions.resize = {
	process : function(params) {
		if (Pixastic.Client.hasCanvas()) {
			var width = params.options.width;
			var height = params.options.height;
			var canvas = params.canvas;

			var copy = document.createElement("canvas");
			copy.width = width;
			copy.height = height;
			copy.getContext("2d").drawImage(canvas,0,0,width,height);

			canvas.width = width;
			canvas.height = height;

			canvas.getContext("2d").drawImage(copy,0,0);

			params.useData = false;
			return true;
		}
	},
	checkSupport : function() {
		return Pixastic.Client.hasCanvas();
	}
}


