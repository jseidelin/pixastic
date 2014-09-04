/*!
 * Pixastic - JavaScript Image Processing
 * http://pixastic.com/
 * Copyright 2012, Jacob Seidelin
 * 
 * Dual licensed under the MPL 1.1 or GPLv3 licenses.
 * http://pixastic.com/license-mpl.txt
 * http://pixastic.com/license-gpl-3.0.txt
 *
 */
 
 var Pixastic = (function() {

    var worker;

    function createImageData(ctx, width, height) {
        if (ctx.createImageData) {
            return ctx.createImageData(width, height);
        } else {
            return ctx.getImageData(0, 0, width, height);
        }
    }
    
    function Pixastic(ctx, workerControlPath) {

        var P = {},
            width = ctx.canvas.width, 
            height = ctx.canvas.height,
            queue = [],
            workerControlPath = workerControlPath || "";

        if (!worker) {
            if (typeof window.Worker != "undefined") {
                try {
                    worker = new window.Worker(workerControlPath + "pixastic.worker.control.js");
                } catch(e) {
                    if (location.protocol == "file:") {
                        Pixastic.log("Could not create native worker, running from file://")
                    } else {
                        Pixastic.log("Could not create native worker.")
                    }
                }
            }
            if (!worker) {
                worker = new Pixastic.Worker();
            }
        }
            
        for (var e in Pixastic.Effects) {
            if (Pixastic.Effects.hasOwnProperty(e)) {
                (function(e) {
                    P[e] = function(options) {
                        queue.push({
                            effect : e,
                            options : options
                        });
                        return P;
                    }

                    P.done = function(callback, progress) {
                        var inData, outData;
                        
                        try {
                            inData = ctx.getImageData(0, 0, width, height);
                        } catch(e) {
                            if (location.protocol == "file:") {
                                throw new Error("Could not access image data, running from file://");
                            } else {
                                throw new Error("Could not access image data, is canvas tainted by cross-origin data?");
                            }
                        }
                        
                        outData = createImageData(ctx, width, height);
                            
                        worker.postMessage({
                            queue : queue, 
                            inData : inData, 
                            outData : outData,
                            width : width,
                            height : height
                        });
                        
                        worker.onmessage = function(message) {
                            var d = message.data;
                            switch (d.event) {
                                case "done" : 
                                    ctx.putImageData(d.data, 0, 0);
                                    if (callback) {
                                        callback();
                                    }
                                    if (progress) {
                                        progress(1);
                                    }
                                    break;
                                case "progress" :
                                    if (progress) {
                                        progress(d.data);
                                    }
                                    break;
                                case "error" :
                                    break;
                            }
                        }
                        
                        if (progress) {
                            progress(0);
                        }
                    }
                })(e);
            }
        }
        return P;
    }


    Pixastic.Worker = function() {
        var me = this;
        function processMessage(data) {
            var queue = data.queue,
                inData = data.inData,
                outData = data.outData,
                width = data.width,
                height = data.height,
                tmpData;

            for (var i=0;i<queue.length;i++) {
                var e = queue[i].effect,
                    options = queue[i].options,
                    progressCallback;

                if (i > 0) {
                    tmpData = inData;
                    inData = outData;
                    outData = tmpData;
                }

                if (typeof importScripts == "function") {
                    progressCallback = function(p) {
                        me.onmessage({
                            data : {
                                event : "progress",
                                data : (i + p) / queue.length
                            }
                        });
                        return p;
                    }
                }

                Pixastic.Effects[e](inData.data, outData.data, width, height, options, progressCallback);
                
                me.onmessage({
                    data : {
                        event : "progress",
                        data : (i+1) / queue.length
                    }
                });
            }
           
            me.onmessage({
                data : {
                    event : "done",
                    data : outData
                }
            });
        }

        this.postMessage = function(data) {
            setTimeout(function() {
                processMessage(data)
            }, 0);
        };
        
        this.onmessage = function() {};

    }


    
    Pixastic.log = function(str) {
        if (typeof console != "undefined" && console.log) {
            console.log("Pixastic: " + str);
        }
    };
    
    function toCanvas(o) {
        var canvas;
        if (typeof o == "object") {
            if (typeof o.tagName == "string") {
                if (o.tagName.toLowerCase() == "canvas" || o.tagName.toLowerCase() == "img") {
                    canvas = document.createElement("canvas");
                    canvas.width = o.width;
                    canvas.height = o.height;
                    canvas.getContext("2d").drawImage(o, 0,0);
                }
            } else if ((window.ImageData && o instanceof window.ImageData)
                        || (typeof o.width == "number" && typeof o.height == "number" && typeof o.data == "object")) {
                canvas = document.createElement("canvas");
                canvas.width = o.width;
                canvas.height = o.height;
                canvas.getContext("2d").putImageData(o, 0, 0);
            }
        }
        return canvas;
    };
    
    function toImage(o) {
        var canvas = toCanvas(o),
            image = new Image();
        image.width = canvas.width;
        image.height = canvas.height;
        image.src = canvas.toDataURL();
        return image;
    };
    
    function toImageData(o) {
        var canvas = toCanvas(o),
            ctx = canvas.getContext("2d");
        return ctx.getImageData(0, 0, canvas.width, canvas.height);
    };
    
    function histogram(imageData) {
        var values = [],
            i, p,
            data = imageData.data,
            round = Math.round,
            maxValue,
            n = imageData.width * imageData.height;
            
        for (i=0;i<256;i++) {
            values[i] = 0;
        }
        
        for (i=0;i<n;i++) {
            p = i * 4;
            values[ round((data[p]+data[p+1]+data[p+2])/3) ]++;
        }
        
        maxValue = 0;
        for (i=0;i<256;i++) {
            if (values[i] > maxValue) {
                maxValue = values[i];
            }
        }
        
        return {
            maxValue : maxValue,
            values : values
        };
    }
    
    Pixastic.toCanvas = toCanvas;
    Pixastic.toImage = toImage;
    Pixastic.toImageData = toImageData;
    Pixastic.histogram = histogram;
    
    Pixastic.Color = {
        rgb2hsl : function(r, g, b) {
            if (r < 0) r = 0;
            if (g < 0) g = 0;
            if (b < 0) b = 0;
            if (r > 255) r = 0;
            if (g > 255) g = 0;
            if (b > 255) b = 0;
        },
        
        rgb2hsv : function(r, g, b) {
        },

        rgb2hex : function(r, g, b) {
        },
        
        hsl2rgb : function(h, s, l) {
        },
        
        hsv2rgb : function(h, s, v) {
        }

    }

    return Pixastic;

})();




