/*
 * Pixastic Lib - Solarize filter - v0.1.0
 * Copyright (c) 2008 Jacob Seidelin, jseidelin@nihilogic.dk, http://blog.nihilogic.dk/
 * MIT License [http://www.opensource.org/licenses/mit-license.php]
 */

Pixastic.Actions.solarize = {

	process : function(params) {
		var useAverage = !!params.options.average;

		if (Pixastic.Client.hasCanvasImageData()) {
			var data = Pixastic.prepareData(params);
			var rect = params.options.rect;
			var w = rect.width;
			var h = rect.height;
			var w4 = w*4;
			var y = h;
			do {
				var offsetY = (y-1)*w4;
				var x = w;
				do {
					var offset = offsetY + (x-1)*4;

					var r = data[offset];
					var g = data[offset+1];
					var b = data[offset+2];

					//r = (r > 127 ? 2 * (r - 127) : 2 * (127 - r));
					//g = (g > 127 ? 2 * (g - 127) : 2 * (127 - g));
					//b = (b > 127 ? 2 * (b - 127) : 2 * (127 - b));

					r = r > 127 ? 255 - r : r;
					g = g > 127 ? 255 - g : g;
					b = b > 127 ? 255 - b : b;

					if (r < 0 ) r = 0;
					if (g < 0 ) g = 0;
					if (b < 0 ) b = 0;
					if (r > 255 ) r = 255;
					if (g > 255 ) g = 255;
					if (b > 255 ) b = 255;

					data[offset] = r;
					data[offset+1] = g;
					data[offset+2] = b;

				} while (--x);
			} while (--y);
			return true;
		}
	},
	checkSupport : function() {
		return (Pixastic.Client.hasCanvasImageData());
	}
}