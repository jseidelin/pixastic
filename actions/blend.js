/*
 * Pixastic Lib - Blend - v0.1.0
 * Copyright (c) 2008 Jacob Seidelin, jseidelin@nihilogic.dk, http://blog.nihilogic.dk/
 * MIT License [http://www.opensource.org/licenses/mit-license.php]
 */

Pixastic.Actions.blend = {

	process : function(params) {
		var amount = parseFloat(params.options.amount);
		var mode = (params.options.mode || "normal").toLowerCase();
		var image = params.options.image;

		amount = Math.max(0,Math.min(1,amount));

		var amount1 = 1 - amount;
		var amount2 = amount;

		if (!image) return false;

		if (Pixastic.Client.hasCanvasImageData()) {
			var data = Pixastic.prepareData(params);
			var rect = params.options.rect;
			var w = rect.width;
			var h = rect.height;

			var otherCanvas = document.createElement("canvas");
			otherCanvas.width = w;
			otherCanvas.height = h;
			var otherCtx = otherCanvas.getContext("2d");
			otherCtx.drawImage(image,0,0);

			var data2 = otherCtx.getImageData(0,0,w,h).data;

			var w4 = w*4;
			var y = h;

			var p = w*h;
			switch (mode) {
				case "normal" : 
					while (p--) {
						var offset = p*4;
						var r1 = data[offset], g1 = data[offset+1], b1 = data[offset+2];
						var r2 = data2[offset], g2 = data2[offset+1], b2 = data2[offset+2];
						data[offset] = r1 * amount1 + amount2 * r2;
						data[offset+1] = g1 * amount1 + amount2 * g2;
						data[offset+2] = b1 * amount1 + amount2 * b2;
					}
					break;

				case "multiply" : 
					while (p--) {
						var offset = p*4;
						var r1 = data[offset], g1 = data[offset+1], b1 = data[offset+2];
						var r2 = data2[offset], g2 = data2[offset+1], b2 = data2[offset+2];
						data[offset] = r1 * amount1 + amount2 * (r1 * r2 / 255);
						data[offset+1] = g1 * amount1 + amount2 * (g1 * g2 / 255);
						data[offset+2] = b1 * amount1 + amount2 * (b1 * b2 / 255);
					}
					break;

				case "lighten" : 
					while (p--) {
						var offset = p*4;
						var r1 = data[offset], g1 = data[offset+1], b1 = data[offset+2];
						var r2 = data2[offset], g2 = data2[offset+1], b2 = data2[offset+2];
						data[offset] = r1 * amount1 + amount2 * (r1 > r2 ? r1 : r2);
						data[offset+1] = g1 * amount1 + amount2 * (g1 > g2 ? g1 : g2);
						data[offset+2] = b1 * amount1 + amount2 * (b1 > b2 ? b1 : b2);
					}
					break;

				case "darken" : 
					while (p--) {
						var offset = p*4;
						var r1 = data[offset], g1 = data[offset+1], b1 = data[offset+2];
						var r2 = data2[offset], g2 = data2[offset+1], b2 = data2[offset+2];
						data[offset] = r1 * amount1 + amount2 * (r1 < r2 ? r1 : r2);
						data[offset+1] = g1 * amount1 + amount2 * (g1 < g2 ? g1 : g2);
						data[offset+2] = b1 * amount1 + amount2 * (b1 < b2 ? b1 : b2);
					}
					break;

				case "average" : 
					while (p--) {
						var offset = p*4;
						var r1 = data[offset], g1 = data[offset+1], b1 = data[offset+2];
						var r2 = data2[offset], g2 = data2[offset+1], b2 = data2[offset+2];
						data[offset] = r1 * amount1 + amount2 * ((r1 + r2) / 2);
						data[offset+1] = g1 * amount1 + amount2 * ((g1 + g2) / 2);
						data[offset+2] = b1 * amount1 + amount2 * ((b1 + b2) / 2);
					}
					break;

				case "lineardodge" : 
					while (p--) {
						var offset = p*4;
						var r1 = data[offset], g1 = data[offset+1], b1 = data[offset+2];
						var r2 = data2[offset], g2 = data2[offset+1], b2 = data2[offset+2];
						var r3 = r1+r2, g3 = g1+g2, b3 = b1+b2;
						data[offset] = r1 * amount1 + amount2 * (r3 > 255 ? 255 : r3);
						data[offset+1] = g1 * amount1 + amount2 * (g3 > 255 ? 255 : g3);
						data[offset+2] = b1 * amount1 + amount2 * (b3 > 255 ? 255 : b3);
					}
					break;

				case "linearburn" : 
					while (p--) {
						var offset = p*4;
						var r1 = data[offset], g1 = data[offset+1], b1 = data[offset+2];
						var r2 = data2[offset], g2 = data2[offset+1], b2 = data2[offset+2];
						var r3 = (r2+r1 < 255) ? 0 : (r2+r1-255);
						var g3 = (g2+g1 < 255) ? 0 : (g2+g1-255);
						var b3 = (b2+b1 < 255) ? 0 : (b2+b1-255);

						data[offset] = r1 * amount1 + amount2 * (r3 < 0 ? 0 : r3);
						data[offset+1] = g1 * amount1 + amount2 * (g3 < 0 ? 0 : g3);
						data[offset+2] = b1 * amount1 + amount2 * (b3 < 0 ? 0 : b3);
					}
					break;

				case "difference" : 
					while (p--) {
						var offset = p*4;
						var r1 = data[offset], g1 = data[offset+1], b1 = data[offset+2];
						var r2 = data2[offset], g2 = data2[offset+1], b2 = data2[offset+2];
						var r3 = r1-r2, g3 = g1-g2, b3 = b1-b2;
						data[offset] = r1 * amount1 + amount2 * (r3 < 0 ? -r3 : r3);
						data[offset+1] = g1 * amount1 + amount2 * (g3 < 0 ? -g3 : g3);
						data[offset+2] = b1 * amount1 + amount2 * (b3 < 0 ? -b3 : b3);
					}
					break;


				case "screen" : 
					while (p--) {
						var offset = p*4;
						var r1 = data[offset], g1 = data[offset+1], b1 = data[offset+2];
						var r2 = data2[offset], g2 = data2[offset+1], b2 = data2[offset+2];
						var r3 = (255 - (((255 - r2) * (255 - r1)) >> 8));
						var g3 = (255 - (((255 - g2) * (255 - g1)) >> 8));
						var b3 = (255 - (((255 - b2) * (255 - b1)) >> 8));
						data[offset] = r1 * amount1 + amount2 * r3;
						data[offset+1] = g1 * amount1 + amount2 * g3;
						data[offset+2] = b1 * amount1 + amount2 * b3;
					}
					break;

				case "exclusion" : 
					while (p--) {
						var offset = p*4;
						var r1 = data[offset], g1 = data[offset+1], b1 = data[offset+2];
						var r2 = data2[offset], g2 = data2[offset+1], b2 = data2[offset+2];
						var r3 = r2 + r1 - 2 * r2 * r1 / 255;
						var g3 = g2 + g1 - 2 * g2 * g1 / 255;
						var b3 = b2 + b1 - 2 * b2 * b1 / 255;
						data[offset] = r1 * amount1 + amount2 * r3;
						data[offset+1] = g1 * amount1 + amount2 * g3;
						data[offset+2] = b1 * amount1 + amount2 * b3;
					}
					break;

				case "overlay" : 
					while (p--) {
						var offset = p*4;
						var r1 = data[offset], g1 = data[offset+1], b1 = data[offset+2];
						var r2 = data2[offset], g2 = data2[offset+1], b2 = data2[offset+2];
						var r3 = ((r1 < 128) ? (2*r2*r1/255) : (255-2*(255-r2) * (255-r1)/255));
						var g3 = ((g1 < 128) ? (2*g2*g1/255) : (255-2*(255-g2) * (255-g1)/255));
						var b3 = ((b1 < 128) ? (2*b2*b1/255) : (255-2*(255-b2) * (255-b1)/255));
						data[offset] = r1 * amount1 + amount2 * r3;
						data[offset+1] = g1 * amount1 + amount2 * g3;
						data[offset+2] = b1 * amount1 + amount2 * b3;
					}
					break;

				case "softlight" : 
					while (p--) {
						var offset = p*4;
						var r1 = data[offset], g1 = data[offset+1], b1 = data[offset+2];
						var r2 = data2[offset], g2 = data2[offset+1], b2 = data2[offset+2];
						var r3 = ((r1 < 128) ? (2*((r2>>1)+64))*(r1/255) : (255-(2*(255-((r2>>1)+64))*(255-r1)/255)));
						var g3 = ((g1 < 128) ? (2*((g2>>1)+64))*(g1/255) : (255-(2*(255-((g2>>1)+64))*(255-g1)/255)));
						var b3 = ((b1 < 128) ? (2*((b2>>1)+64))*(b1/255) : (255-(2*(255-((b2>>1)+64))*(255-b1)/255)));
						data[offset] = r1 * amount1 + amount2 * r3;
						data[offset+1] = g1 * amount1 + amount2 * g3;
						data[offset+2] = b1 * amount1 + amount2 * b3;
					}
					break;


				case "hardlight" : 
					while (p--) {
						var offset = p*4;
						var r1 = data[offset], g1 = data[offset+1], b1 = data[offset+2];
						var r2 = data2[offset], g2 = data2[offset+1], b2 = data2[offset+2];
						var r3 = ((r2 < 128) ? (2*r1*r2/255) : (255-2*(255-r1) * (255-r2)/255));
						var g3 = ((g2 < 128) ? (2*g1*g2/255) : (255-2*(255-g1) * (255-g2)/255));
						var b3 = ((b2 < 128) ? (2*b1*b2/255) : (255-2*(255-b1) * (255-b2)/255));
						data[offset] = r1 * amount1 + amount2 * r3;
						data[offset+1] = g1 * amount1 + amount2 * g3;
						data[offset+2] = b1 * amount1 + amount2 * b3;
					}
					break;

				case "colordodge" : 
					while (p--) {
						var offset = p*4;
						var r1 = data[offset], g1 = data[offset+1], b1 = data[offset+2];
						var r2 = data2[offset], g2 = data2[offset+1], b2 = data2[offset+2];
						var r3 = (r2 == 255) ? 255 : ((r1<<8)/(255-r2));
						var g3 = (g2 == 255) ? 255 : ((g1<<8)/(255-g2));
						var b3 = (b2 == 255) ? 255 : ((b1<<8)/(255-b2));
						data[offset] = r1 * amount1 + amount2 * (r3 > 255 ? 255 : r3);
						data[offset+1] = g1 * amount1 + amount2 * (g3 > 255 ? 255 : g3);
						data[offset+2] = b1 * amount1 + amount2 * (b3 > 255 ? 255 : b3);
					}
					break;

				case "colorburn" : 
					while (p--) {
						var offset = p*4;
						var r1 = data[offset], g1 = data[offset+1], b1 = data[offset+2];
						var r2 = data2[offset], g2 = data2[offset+1], b2 = data2[offset+2];
						var r3 = (r2 == 0) ? 0 : (255-((255-r1)<<8)/r2);
						var g3 = (g2 == 0) ? 0 : (255-((255-g1)<<8)/g2);
						var b3 = (b2 == 0) ? 0 : (255-((255-b1)<<8)/b2);
						data[offset] = r1 * amount1 + amount2 * (r3 < 0 ? 0 : r3);
						data[offset+1] = g1 * amount1 + amount2 * (g3 < 0 ? 0 : g3);
						data[offset+2] = b1 * amount1 + amount2 * (b3 < 0 ? 0 : b3);
					}
					break;

				case "linearlight" : 
					while (p--) {
						var offset = p*4;
						var r1 = data[offset], g1 = data[offset+1], b1 = data[offset+2];
						var r2 = data2[offset], g2 = data2[offset+1], b2 = data2[offset+2];
						var r3 = (r2 < 128) ? ((2*r2+r1 < 255) ? 0 : (2*r2+r1-255)) : (r1+(2*(r2-128)));
						var g3 = (g2 < 128) ? ((2*g2+g1 < 255) ? 0 : (2*g2+g1-255)) : (g1+(2*(g2-128)));
						var b3 = (b2 < 128) ? ((2*b2+r1 < 255) ? 0 : (2*b2+r1-255)) : (b1+(2*(b2-128)));
						if (r3 > 255) r3 = 255;
						if (g3 > 255) g3 = 255;
						if (b3 > 255) b3 = 255;
						data[offset] = r1 * amount1 + amount2 * (r3 < 0 ? 0 : r3);
						data[offset+1] = g1 * amount1 + amount2 * (g3 < 0 ? 0 : g3);
						data[offset+2] = b1 * amount1 + amount2 * (b3 < 0 ? 0 : b3);
					}
					break;

				case "vividlight" : 
					while (p--) {
						var offset = p*4;
						var r1 = data[offset], g1 = data[offset+1], b1 = data[offset+2];
						var r2 = data2[offset], g2 = data2[offset+1], b2 = data2[offset+2];
						var r3 = (r2 < 128) ? ((r2 == 0) ? 0 : (255-((255-r1)<<8)/(2*r2))) : 
							(((2*(r2-128)) == 255) ? 255 : ((r1<<8)/(255-(2*(r2-128)))));

						var g3 = (g2 < 128) ? ((g2 == 0) ? 0 : (255-((255-g1)<<8)/(2*g2))) : 
							(((2*(g2-128)) == 255) ? 255 : ((g1<<8)/(255-(2*(g2-128)))));

						var b3 = (b2 < 128) ? ((b2 == 0) ? 0 : (255-((255-b1)<<8)/(2*b2))) : 
							(((2*(b2-128)) == 255) ? 255 : ((b1<<8)/(255-(2*(b2-128)))));

						if (r3 > 255) r3 = 255;
						if (g3 > 255) g3 = 255;
						if (b3 > 255) b3 = 255;
						data[offset] = r1 * amount1 + amount2 * (r3 < 0 ? 0 : r3);
						data[offset+1] = g1 * amount1 + amount2 * (g3 < 0 ? 0 : g3);
						data[offset+2] = b1 * amount1 + amount2 * (b3 < 0 ? 0 : b3);
					}
					break;

				case "pinlight" : 
					while (p--) {
						var offset = p*4;
						var r1 = data[offset], g1 = data[offset+1], b1 = data[offset+2];
						var r2 = data2[offset], g2 = data2[offset+1], b2 = data2[offset+2];

						var r3 = (r2 < 128) ? (r1 < (2*r2) ? r1 : (2*r2)) : (r1 > (2*(r2-128)) ? r1 : (2*(r2-128)));
						var g3 = (g2 < 128) ? (g1 < (2*g2) ? g1 : (2*g2)) : (g1 > (2*(g2-128)) ? g1 : (2*(g2-128)));
						var b3 = (b2 < 128) ? (b1 < (2*b2) ? b1 : (2*b2)) : (b1 > (2*(b2-128)) ? b1 : (2*(b2-128)));

						data[offset] = r1 * amount1 + amount2 * r3;
						data[offset+1] = g1 * amount1 + amount2 * g3;
						data[offset+2] = b1 * amount1 + amount2 * b3;
					}
					break;

				case "hardmix" : 
					while (p--) {
						var offset = p*4;
						var r1 = data[offset], g1 = data[offset+1], b1 = data[offset+2];
						var r2 = data2[offset], g2 = data2[offset+1], b2 = data2[offset+2];
						var r3 = (r2 < 128) ? ((r2 == 0) ? 0 : (255-((255-r1)<<8)/(2*r2))) : 
							(((2*(r2-128)) == 255) ? 255 : ((r1<<8)/(255-(2*(r2-128)))));

						var g3 = (g2 < 128) ? ((g2 == 0) ? 0 : (255-((255-g1)<<8)/(2*g2))) : 
							(((2*(g2-128)) == 255) ? 255 : ((g1<<8)/(255-(2*(g2-128)))));

						var b3 = (b2 < 128) ? ((b2 == 0) ? 0 : (255-((255-b1)<<8)/(2*b2))) : 
							(((2*(b2-128)) == 255) ? 255 : ((b1<<8)/(255-(2*(b2-128)))));

						data[offset] = r1 * amount1 + amount2 * (r3 < 128 ? 0 : 255);
						data[offset+1] = g1 * amount1 + amount2 * (g3 < 128 ? 0 : 255);
						data[offset+2] = b1 * amount1 + amount2 * (b3 < 128 ? 0 : 255);
					}
					break;

/*
#define ChannelBlend_HardMix(B,L)     ((uint8)((ChannelBlend_VividLight(B,L) < 128) ? 0:255))
#define ChannelBlend_Reflect(B,L)     ((uint8)((L == 255) ? L:min(255, (B * B / (255 - L)))))
#define ChannelBlend_Glow(B,L)        (ChannelBlend_Reflect(L,B))
#define ChannelBlend_Phoenix(B,L)     ((uint8)(min(B,L) - max(B,L) + 255))
#define ChannelBlend_Alpha(B,L,O)     ((uint8)(O * B + (1 - O) * L))
#define ChannelBlend_AlphaF(B,L,F,O)  (ChannelBlend_Alpha(F(B,L),B,O))
*/
			}

			return true;
		}
	},
	checkSupport : function() {
		return Pixastic.Client.hasCanvasImageData();
	}
}