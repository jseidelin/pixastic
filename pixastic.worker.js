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
                options = queue[i].options;

            if (i > 0) {
                tmpData = inData;
                inData = outData;
                outData = tmpData;
            }

            Pixastic.Effects[e](inData.data, outData.data, width, height, options);
            
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
    }
    
    this.onmessage = function() {};

}
