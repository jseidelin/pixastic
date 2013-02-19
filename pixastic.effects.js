Pixastic.Effects = (function() {

    function defaultOptions(options, defaults) {
        var O = {};
        for (var opt in defaults) {
            if (typeof options[opt] == "undefined") {
                O[opt] = defaults[opt];
            } else {
                O[opt] = options[opt];
            }
        }
        return O;
    }

    function clamp(val, min, max) {
        return Math.min(max, Math.max(min, val));
    }

    function convolve3x3(inData, outData, width, height, kernel, progress, alpha, invert, mono) {
        var idx, r, g, b, a,
            pyc, pyp, pyn,
            pxc, pxp, pxn,
            x, y,
            
            prog, lastProg = 0,
            n = width * height * 4,
            
            k00 = kernel[0][0], k01 = kernel[0][1], k02 = kernel[0][2],
            k10 = kernel[1][0], k11 = kernel[1][1], k12 = kernel[1][2],
            k20 = kernel[2][0], k21 = kernel[2][1], k22 = kernel[2][2],
            
            p00, p01, p02,
            p10, p11, p12,
            p20, p21, p22;
            
        for (y=0;y<height;++y) {
            pyc = y * width * 4;
            pyp = pyc - width * 4;
            pyn = pyc + width * 4;

            if (y < 1) pyp = pyc;
            if (y >= width-1) pyn = pyc;
            
            for (x=0;x<width;++x) {
                idx = (y * width + x) * 4;
                
                pxc = x * 4;
                pxp = pxc - 4;
                pxn = pxc + 4;
          
                if (x < 1) pxp = pxc;
                if (x >= width-1) pxn = pxc;
                
                p00 = pyp + pxp;    p01 = pyp + pxc;    p02 = pyp + pxn;
                p10 = pyc + pxp;    p11 = pyc + pxc;    p12 = pyc + pxn;
                p20 = pyn + pxp;    p21 = pyn + pxc;    p22 = pyn + pxn;

                r = inData[p00] * k00 + inData[p01] * k01 + inData[p02] * k02
                  + inData[p10] * k10 + inData[p11] * k11 + inData[p12] * k12
                  + inData[p20] * k20 + inData[p21] * k21 + inData[p22] * k22;

                g = inData[p00 + 1] * k00 + inData[p01 + 1] * k01 + inData[p02 + 1] * k02
                  + inData[p10 + 1] * k10 + inData[p11 + 1] * k11 + inData[p12 + 1] * k12
                  + inData[p20 + 1] * k20 + inData[p21 + 1] * k21 + inData[p22 + 1] * k22;
                  
                b = inData[p00 + 2] * k00 + inData[p01 + 2] * k01 + inData[p02 + 2] * k02
                  + inData[p10 + 2] * k10 + inData[p11 + 2] * k11 + inData[p12 + 2] * k12
                  + inData[p20 + 2] * k20 + inData[p21 + 2] * k21 + inData[p22 + 2] * k22;

                if (alpha) {
                    a = inData[p00 + 3] * k00 + inData[p01 + 3] * k01 + inData[p02 + 3] * k02
                      + inData[p10 + 3] * k10 + inData[p11 + 3] * k11 + inData[p12 + 3] * k12
                      + inData[p20 + 3] * k20 + inData[p21 + 3] * k21 + inData[p22 + 3] * k22;
                } else {
                    a = inData[idx+3];
                }

                if (mono) {
                    r = g = b = (r + g + b) / 3;
                }
                if (invert) {
                    r = 255 - r;
                    g = 255 - g;
                    b = 255 - b;
                }
                
                outData[idx] = r;
                outData[idx+1] = g;
                outData[idx+2] = b;
                outData[idx+3] = a;
                
                if (progress) {
                    prog = (idx/n*100 >> 0) / 100;
                    if (prog > lastProg) {
                        lastProg = progress(prog);
                    }
                }
            }
        }
    }
    
    function convolve5x5(inData, outData, width, height, kernel, progress, alpha, invert, mono) {
        var idx, r, g, b, a,
            pyc, pyp, pyn, pypp, pynn,
            pxc, pxp, pxn, pxpp, pxnn,
            x, y,
            
            prog, lastProg = 0,
            n = width * height * 4,
            
            k00 = kernel[0][0], k01 = kernel[0][1], k02 = kernel[0][2], k03 = kernel[0][3], k04 = kernel[0][4],
            k10 = kernel[1][0], k11 = kernel[1][1], k12 = kernel[1][2], k13 = kernel[1][3], k14 = kernel[1][4],
            k20 = kernel[2][0], k21 = kernel[2][1], k22 = kernel[2][2], k23 = kernel[2][3], k24 = kernel[2][4],
            k30 = kernel[3][0], k31 = kernel[3][1], k32 = kernel[3][2], k33 = kernel[3][3], k34 = kernel[3][4],
            k40 = kernel[4][0], k41 = kernel[4][1], k42 = kernel[4][2], k43 = kernel[4][3], k44 = kernel[4][4],
            
            p00, p01, p02, p03, p04,
            p10, p11, p12, p13, p14,
            p20, p21, p22, p23, p24,
            p30, p31, p32, p33, p34,
            p40, p41, p42, p43, p44;
            
        for (y=0;y<height;++y) {
            pyc = y * width * 4;
            pyp = pyc - width * 4;
            pypp = pyc - width * 4 * 2;
            pyn = pyc + width * 4;
            pynn = pyc + width * 4 * 2;

            if (y < 1) pyp = pyc;
            if (y >= width-1) pyn = pyc;
            if (y < 2) pypp = pyp;
            if (y >= width-2) pynn = pyn;
            
            for (x=0;x<width;++x) {
                idx = (y * width + x) * 4;
                
                pxc = x * 4;
                pxp = pxc - 4;
                pxn = pxc + 4;
                pxpp = pxc - 8;
                pxnn = pxc + 8;
          
                if (x < 1) pxp = pxc;
                if (x >= width-1) pxn = pxc;
                if (x < 2) pxpp = pxp;
                if (x >= width-2) pxnn = pxn;
                
                p00 = pypp + pxpp;    p01 = pypp + pxp;    p02 = pypp + pxc;    p03 = pypp + pxn;    p04 = pypp + pxnn;
                p10 = pyp  + pxpp;    p11 = pyp  + pxp;    p12 = pyp  + pxc;    p13 = pyp  + pxn;    p14 = pyp  + pxnn;
                p20 = pyc  + pxpp;    p21 = pyc  + pxp;    p22 = pyc  + pxc;    p23 = pyc  + pxn;    p24 = pyc  + pxnn;
                p30 = pyn  + pxpp;    p31 = pyn  + pxp;    p32 = pyn  + pxc;    p33 = pyn  + pxn;    p34 = pyn  + pxnn;
                p40 = pynn + pxpp;    p41 = pynn + pxp;    p42 = pynn + pxc;    p43 = pynn + pxn;    p44 = pynn + pxnn;

                r = inData[p00] * k00 + inData[p01] * k01 + inData[p02] * k02 + inData[p03] * k04 + inData[p02] * k04
                  + inData[p10] * k10 + inData[p11] * k11 + inData[p12] * k12 + inData[p13] * k14 + inData[p12] * k14
                  + inData[p20] * k20 + inData[p21] * k21 + inData[p22] * k22 + inData[p23] * k24 + inData[p22] * k24
                  + inData[p30] * k30 + inData[p31] * k31 + inData[p32] * k32 + inData[p33] * k34 + inData[p32] * k34
                  + inData[p40] * k40 + inData[p41] * k41 + inData[p42] * k42 + inData[p43] * k44 + inData[p42] * k44;
                  
                g = inData[p00+1] * k00 + inData[p01+1] * k01 + inData[p02+1] * k02 + inData[p03+1] * k04 + inData[p02+1] * k04
                  + inData[p10+1] * k10 + inData[p11+1] * k11 + inData[p12+1] * k12 + inData[p13+1] * k14 + inData[p12+1] * k14
                  + inData[p20+1] * k20 + inData[p21+1] * k21 + inData[p22+1] * k22 + inData[p23+1] * k24 + inData[p22+1] * k24
                  + inData[p30+1] * k30 + inData[p31+1] * k31 + inData[p32+1] * k32 + inData[p33+1] * k34 + inData[p32+1] * k34
                  + inData[p40+1] * k40 + inData[p41+1] * k41 + inData[p42+1] * k42 + inData[p43+1] * k44 + inData[p42+1] * k44;
                  
                b = inData[p00+2] * k00 + inData[p01+2] * k01 + inData[p02+2] * k02 + inData[p03+2] * k04 + inData[p02+2] * k04
                  + inData[p10+2] * k10 + inData[p11+2] * k11 + inData[p12+2] * k12 + inData[p13+2] * k14 + inData[p12+2] * k14
                  + inData[p20+2] * k20 + inData[p21+2] * k21 + inData[p22+2] * k22 + inData[p23+2] * k24 + inData[p22+2] * k24
                  + inData[p30+2] * k30 + inData[p31+2] * k31 + inData[p32+2] * k32 + inData[p33+2] * k34 + inData[p32+2] * k34
                  + inData[p40+2] * k40 + inData[p41+2] * k41 + inData[p42+2] * k42 + inData[p43+2] * k44 + inData[p42+2] * k44;

                if (alpha) {
                    a = inData[p00+3] * k00 + inData[p01+3] * k01 + inData[p02+3] * k02 + inData[p03+3] * k04 + inData[p02+3] * k04
                      + inData[p10+3] * k10 + inData[p11+3] * k11 + inData[p12+3] * k12 + inData[p13+3] * k14 + inData[p12+3] * k14
                      + inData[p20+3] * k20 + inData[p21+3] * k21 + inData[p22+3] * k22 + inData[p23+3] * k24 + inData[p22+3] * k24
                      + inData[p30+3] * k30 + inData[p31+3] * k31 + inData[p32+3] * k32 + inData[p33+3] * k34 + inData[p32+3] * k34
                      + inData[p40+3] * k40 + inData[p41+3] * k41 + inData[p42+3] * k42 + inData[p43+3] * k44 + inData[p42+3] * k44;
                } else {
                    a = inData[idx+3];
                }

                if (mono) {
                    r = g = b = (r + g + b) / 3;
                }
                
                if (invert) {
                    r = 255 - r;
                    g = 255 - g;
                    b = 255 - b;
                }
                
                outData[idx] = r;
                outData[idx+1] = g;
                outData[idx+2] = b;
                outData[idx+3] = a;
                
                if (progress) {
                    prog = (idx/n*100 >> 0) / 100;
                    if (prog > lastProg) {
                        lastProg = progress(prog);
                    }
                }
            }
        }
    }
    
    function gaussian(inData, outData, width, height, kernelSize, progress) {
        var r, g, b, a, idx,
            n = width * height * 4,
            x, y, i, j, 
            inx, iny, w,
            tmpData = [],
            maxKernelSize = 13,
            kernelSize = clamp(kernelSize, 3, maxKernelSize),
            k1 = -kernelSize / 2 + (kernelSize % 2 ? 0.5 : 0),
            k2 = kernelSize + k1,
            weights,
            kernels = [[1]],
            prog, lastProg = 0;
            
            
        for (i=1;i<maxKernelSize;++i) {
            kernels[0][i] = 0;
        }
        
        for (i=1;i<maxKernelSize;++i) {
            kernels[i] = [1];
            for (j=1;j<maxKernelSize;++j) {
                kernels[i][j] = kernels[i-1][j] + kernels[i-1][j-1];
            }
        }

        weights = kernels[kernelSize - 1]
        
        for (i=0,w=0;i<kernelSize;++i) {
            w += weights[i];
        }
        for (i=0;i<kernelSize;++i) {
            weights[i] /= w;
        }
        
        // pass 1
        for (y=0;y<height;++y) {
            for (x=0;x<width;++x) {
                r = g = b = a = 0;

                for (i=k1;i<k2;++i) {
                    inx = x + i;
                    iny = y;
                    w = weights[i - k1];
                    
                    if (inx < 0) {
                        inx = 0;
                    }
                    if (inx >= width) {
                        inx = width - 1;
                    }
                    
                    idx = (iny * width + inx) * 4;

                    r += inData[idx] * w;
                    g += inData[idx + 1] * w;
                    b += inData[idx + 2] * w;
                    a += inData[idx + 3] * w;

                }
                
                idx = (y * width + x) * 4;
                
                tmpData[idx] = r;
                tmpData[idx+1] = g;
                tmpData[idx+2] = b;
                tmpData[idx+3] = a;
                
                if (progress) {
                    prog = (idx/n*50 >> 0) / 100;
                    if (prog > lastProg) {
                        lastProg = progress(prog);
                    }
                }
            }
        }
        
        lastProg = 0;
        
        // pass 2
        for (y=0;y<height;++y) {
            for (x=0;x<width;++x) {
                r = g = b = a = 0;

                for (i=k1;i<k2;++i) {
                    inx = x;
                    iny = y + i;
                    w = weights[i - k1];
                    
                    if (iny < 0) {
                        iny = 0;
                    }
                    if (iny >= height) {
                        iny = height - 1;
                    }
                    
                    idx = (iny * width + inx) * 4;
                    
                    r += tmpData[idx] * w;
                    g += tmpData[idx + 1] * w;
                    b += tmpData[idx + 2] * w;
                    a += tmpData[idx + 3] * w;
                }
                
                idx = (y * width + x) * 4;
                
                outData[idx] = r;
                outData[idx+1] = g;
                outData[idx+2] = b;
                outData[idx+3] = a;
                
                if (progress) {
                    prog = 0.5 + (idx/n*50 >> 0) / 100;
                    if (prog > lastProg) {
                        lastProg = progress(prog);
                    }
                }
            }
        }
    }
    
    
    return {

        invert : function(inData, outData, width, height, options, progress) {
            var n = width * height * 4,
                prog, lastProg = 0;

            for (i=0;i<n;i+=4) {
                outData[i] = 255 - inData[i];
                outData[i+1] = 255 - inData[i+1];
                outData[i+2] = 255 - inData[i+2];
                outData[i+3] = inData[i+3];

                
                if (progress) {
                    prog = (i/n*100 >> 0) / 100;
                    if (prog > lastProg) {
                        lastProg = progress(prog);
                    }
                }
            }
        },
        
        sepia : function(inData, outData, width, height, options, progress) {
            var n = width * height * 4,
                prog, lastProg = 0,
                r, g, b;

            for (var i=0;i<n;i+=4) {
                r = inData[i];
                g = inData[i+1];
                b = inData[i+2];
                outData[i] = (r * 0.393 + g * 0.769 + b * 0.189);
                outData[i+1] = (r * 0.349 + g * 0.686 + b * 0.168);
                outData[i+2] = (r * 0.272 + g * 0.534 + b * 0.131);
                outData[i+3] = inData[i+3];
                
                if (progress) {
                    prog = (i/n*100 >> 0) / 100;
                    if (prog > lastProg) {
                        lastProg = progress(prog);
                    }
                }
            }
        },
        
        solarize : function(inData, outData, width, height, options, progress) {
            var n = width * height * 4,
                prog, lastProg = 0,
                r, g, b;

            for (i=0;i<n;i+=4) {
                r = inData[i];
                g = inData[i+1];
                b = inData[i+2];
                
                outData[i] = r > 127 ? 255 - r : r;
                outData[i+1] = g > 127 ? 255 - g : g;
                outData[i+2] = b > 127 ? 255 - b : b;
                outData[i+3] = inData[i+3];
                
                if (progress) {
                    prog = (i/n*100 >> 0) / 100;
                    if (prog > lastProg) {
                        lastProg = progress(prog);
                    }
                }
            }
        },

        brightness : function(inData, outData, width, height, options, progress) {
            options = defaultOptions(options, {
                brightness : 0,
                contrast : 0
            });
            
            var contrast = clamp(options.contrast, -1, 1) / 2,
                brightness = 1 + clamp(options.brightness, -1, 1),
                prog, lastProg = 0,
                r, g, b,
                n = width * height * 4;

            var brightMul = brightness < 0 ? - brightness : brightness;
            var brightAdd = brightness < 0 ? 0 : brightness;

            contrast = 0.5 * Math.tan((contrast + 1) * Math.PI/4);
            contrastAdd = - (contrast - 0.5) * 255;

            for (var i=0;i<n;i+=4) {
                r = inData[i];
                g = inData[i+1];
                b = inData[i+2];
                
                r = (r + r * brightMul + brightAdd) * contrast + contrastAdd;
                g = (g + g * brightMul + brightAdd) * contrast + contrastAdd;
                b = (b + b * brightMul + brightAdd) * contrast + contrastAdd;
                
                outData[i] = r;
                outData[i+1] = g;
                outData[i+2] = b;
                outData[i+3] = inData[i+3];
                
                if (progress) {
                    prog = (i/n*100 >> 0) / 100;
                    if (prog > lastProg) {
                        lastProg = progress(prog);
                    }
                }
            }
        },
        
        desaturate : function(inData, outData, width, height, options, progress) {
            var n = width * height * 4,
                prog, lastProg = 0,
                level;

            for (var i=0;i<n;i+=4) {
                level = inData[i] * 0.3 + inData[i+1] * 0.59 + inData[i+2] * 0.11;
                outData[i] = level;
                outData[i+1] = level;
                outData[i+2] = level;
                outData[i+3] = inData[i+3];
                
                if (progress) {
                    prog = (i/n*100 >> 0) / 100;
                    if (prog > lastProg) {
                        lastProg = progress(prog);
                    }
                }
            }
        },
        
        lighten : function(inData, outData, width, height, options, progress) {
            var n = width * height * 4,
                prog, lastProg = 0,
                mul = 1 + clamp(options.amount, 0, 1);

            for (var i=0;i<n;i+=4) {
                outData[i] = inData[i] * mul;
                outData[i+1] = inData[i+1] * mul;
                outData[i+2] = inData[i+2] * mul;
                outData[i+3] = inData[i+3];
                
                if (progress) {
                    prog = (i/n*100 >> 0) / 100;
                    if (prog > lastProg) {
                        lastProg = progress(prog);
                    }
                }
            }
        },
        
        noise : function(inData, outData, width, height, options, progress) {
            var n = width * height * 4,
                prog, lastProg = 0,
                amount = clamp(options.amount, 0, 1),
                strength = clamp(options.strength, 0, 1),
                mono = !!options.mono,
                random = Math.random,
                rnd, r, g, b;
                
            for (var i=0;i<n;i+=4) {
                r = inData[i];
                g = inData[i+1];
                b = inData[i+2];
                
                rnd = random();
                
                if (rnd < amount) {
                    if (mono) {
                        rnd = strength * ((rnd / amount) * 2 - 1) * 255;
                        r += rnd;
                        g += rnd;
                        b += rnd;
                    } else {
                        r += strength * random() * 255;
                        g += strength * random() * 255;
                        b += strength * random() * 255;
                    }
                }
                
                outData[i] = r;
                outData[i+1] = g;
                outData[i+2] = b;
                outData[i+3] = inData[i+3];
                
                if (progress) {
                    prog = (i/n*100 >> 0) / 100;
                    if (prog > lastProg) {
                        lastProg = progress(prog);
                    }
                }
            }
        },
        
        flipv : function(inData, outData, width, height, options, progress) {
            var inPix, outPix,
                n = width * height * 4,
                prog, lastProg = 0,
                x, y;
            for (y=0;y<height;++y) {
                for (x=0;x<width;++x) {
                    inPix = (y * width + x) * 4;
                    outPix = (y * width + (width - x - 1)) * 4;
                    
                    outData[outPix] = inData[inPix];
                    outData[outPix+1] = inData[inPix+1];
                    outData[outPix+2] = inData[inPix+2];
                    outData[outPix+3] = inData[inPix+3];
                    
                    if (progress) {
                        prog = (inPix/n*100 >> 0) / 100;
                        if (prog > lastProg) {
                            lastProg = progress(prog);
                        }
                    }
                }
            }
        },
        
        fliph : function(inData, outData, width, height, options, progress) {
            var inPix, outPix,
                n = width * height * 4,
                prog, lastProg = 0,
                x, y;
            for (y=0;y<height;++y) {
                for (x=0;x<width;++x) {
                    inPix = (y * width + x) * 4;
                    outPix = ((height - y - 1) * width + x) * 4;
                    
                    outData[outPix] = inData[inPix];
                    outData[outPix+1] = inData[inPix+1];
                    outData[outPix+2] = inData[inPix+2];
                    outData[outPix+3] = inData[inPix+3];
                    
                    if (progress) {
                        prog = (inPix/n*100 >> 0) / 100;
                        if (prog > lastProg) {
                            lastProg = progress(prog);
                        }
                    }
                }
            }
        },

        blur : function(inData, outData, width, height, options, progress) {
            gaussian(inData, outData, width, height, options.kernelSize, progress);
        },

        glow : function(inData, outData, width, height, options, progress) {
            var n = width * height * 4,
                i, r, g, b,
                amount = options.amount,
                tmpData = [],
                gaussProgress,
                prog, lastProg = 0;

            if (progress) {
                gaussProgress = function(p) {
                    progress(p * 0.8);
                    return p;
                }
            }
            
            gaussian(inData, tmpData, width, height, options.kernelSize, gaussProgress);
            
            for (i=0;i<n;i+=4) {
                r = inData[i]   + tmpData[i]   * amount;
                g = inData[i+1] + tmpData[i+1] * amount;
                b = inData[i+2] + tmpData[i+2] * amount;
                if (r > 255) r = 255;
                if (g > 255) g = 255;
                if (b > 255) b = 255;
                outData[i] = r;
                outData[i+1] = g;
                outData[i+2] = b;
                outData[i+3] = inData[i+3];
                
                if (progress) {
                    prog = 0.8 + (i/n*100 >> 0) / 100 * 0.2;
                    if (prog > lastProg) {
                        lastProg = progress(prog);
                    }
                }
            }
        },

        convolve3x3 : function(inData, outData, width, height, options, progress) {
            convolve3x3(inData, outData, width, height, options.kernel, progress);
        },
        
        convolve5x5 : function(inData, outData, width, height, options, progress) {
            convolve3x3(inData, outData, width, height, options.kernel, progress);
        },
        
        // A 3x3 high-pass filter
        sharpen3x3 : function(inData, outData, width, height, options, progress) {
            var a = - clamp(options.strength, 0, 1);
            convolve3x3(
                inData, outData, width, height, 
                [[a,     a, a],
                 [a, 1-a*8, a],
                 [a,     a, a]],
                progress
            );
        },

        // A 5x5 high-pass filter
        sharpen5x5 : function(inData, outData, width, height, options, progress) {
            var a = - clamp(options.strength, 0, 1);
            convolve5x5(
                inData, outData, width, height, 
                [[a, a,      a, a, a],
                 [a, a,      a, a, a],
                 [a, a, 1-a*24, a, a],
                 [a, a,      a, a, a],
                 [a, a,      a, a, a]],
                progress
             );
        },

        // A 3x3 low-pass mean filter
        soften3x3 : function(inData, outData, width, height, options, progress) {
            var c = 1/9;
            convolve3x3(
                inData, outData, width, height, 
                [[c, c, c],
                 [c, c, c],
                 [c, c, c]],
                progress
            );
        },
        
        // A 5x5 low-pass mean filter
        soften5x5 : function(inData, outData, width, height, options, progress) {
            var c = 1/25;
            convolve5x5(
                inData, outData, width, height, 
                [[c, c, c, c, c],
                 [c, c, c, c, c],
                 [c, c, c, c, c],
                 [c, c, c, c, c],
                 [c, c, c, c, c]],
                progress
            );
        },
        
        // A 3x3 Cross edge-detect
        crossedges : function(inData, outData, width, height, options, progress) {
            var a = clamp(options.strength, 0, 1) * 5
            convolve3x3(
                inData, outData, width, height, 
                [[ 0, -a, 0],
                 [-a,  0, a],
                 [ 0,  a, 0]],
                progress,
                false, true
            );
        },
        
        // 3x3 directional emboss
        emboss : function(inData, outData, width, height, options, progress) {
            var amount = options.amount,
                angle = options.angle,
                x = Math.cos(-angle) * amount,
                y = Math.sin(-angle) * amount,
                n = width * height * 4,
                
                a00 = -x - y,
                a10 = -x,
                a20 = y - x,
                a01 = -y,
                a21 = y,
                a02 = -y + x,
                a12 = x,
                a22 = y + x,

                tmpData = [],
                
                prog, lastProg = 0,
                convProgress;
                
            if (progress) {
                convProgress = function(p) {
                    progress(p * 0.5)
                    return p;
                };
            }
            
            convolve3x3(
                inData, tmpData, width, height, 
                [[a00, a01, a02],
                 [a10,   0, a12],
                 [a20, a21, a22]]
            );
            
            for (var i=0;i<n;i+=4) {
                outData[i]   = 128 + tmpData[i];
                outData[i+1] = 128 + tmpData[i+1];
                outData[i+2] = 128 + tmpData[i+2];
                outData[i+3] = inData[i+3];
                
                if (progress) {
                    prog = 0.5 + (i/n*100 >> 0) / 100 * 0.5;
                    if (prog > lastProg) {
                        lastProg = progress(prog);
                    }
                }
            }
        },

        
        // A 3x3 Sobel edge detect (similar to Photoshop's)
        findedges : function(inData, outData, width, height, options, progress) {
            var n = width * height * 4,
                i,
                data1 = [], 
                data2 = [],
                gr1, gr2, gg1, gg2, gb1, gb2,
                prog, lastProg = 0,
                convProgress1, convProgress2;

            if (progress) {
                convProgress1 = function(p) {
                    progress(p * 0.4);
                    return p;
                };
                convProgress2 = function(p) {
                    progress(0.4 + p * 0.4);
                    return p;
                };
            }
            
            convolve3x3(inData, data1, width, height, 
                [[-1, 0, 1],
                 [-2, 0, 2],
                 [-1, 0, 1]]
            );
            convolve3x3(inData, data2, width, height, 
                [[-1, -2, -1],
                 [ 0,  0,  0],
                 [ 1,  2,  1]]
            );
            
            for (i=0;i<n;i+=4) {
                gr1 = data1[i];
                gr2 = data2[i];
                gg1 = data1[i+1];
                gg2 = data2[i+1];
                gb1 = data1[i+2];
                gb2 = data2[i+2];
                
                if (gr1 < 0) gr1 = -gr1;
                if (gr2 < 0) gr2 = -gr2;
                if (gg1 < 0) gg1 = -gg1;
                if (gg2 < 0) gg2 = -gg2;
                if (gb1 < 0) gb1 = -gb1;
                if (gb2 < 0) gb2 = -gb2;
            
                outData[i] = 255 - (gr1 + gr2) * 0.8;
                outData[i+1] = 255 - (gg1 + gg2) * 0.8;
                outData[i+2] = 255 - (gb1 + gb2) * 0.8;
                outData[i+3] = inData[i+3];
                
                if (progress) {
                    prog = 0.8 + (i/n*100 >> 0) / 100 * 0.2;
                    if (prog > lastProg) {
                        lastProg = progress(prog);
                    }
                }
            }
        },
        
        // A 3x3 edge enhance
        edgeenhance3x3 : function(inData, outData, width, height, options, progress) {
            convolve3x3(
                inData, outData, width, height, 
                [[-1/9, -1/9, -1/9],
                 [-1/9,  17/9, -1/9],
                 [-1/9, -1/9, -1/9]],
                progress
            );
        },
        
        // A 5x5 edge enhance
        edgeenhance5x5 : function(inData, outData, width, height, options, progress) {
            convolve5x5(
                inData, outData, width, height, 
                [[-1/25, -1/25, -1/25, -1/25, -1/25],
                 [-1/25, -1/25, -1/25, -1/25, -1/25],
                 [-1/25, -1/25, 49/25, -1/25, -1/25],
                 [-1/25, -1/25, -1/25, -1/25, -1/25],
                 [-1/25, -1/25, -1/25, -1/25, -1/25]],
                progress
            );
        },

        // A 3x3 Laplacian edge-detect
        laplace3x3 : function(inData, outData, width, height, options, progress) {
            convolve3x3(
                inData, outData, width, height, 
                [[-1, -1, -1],
                 [-1,  8, -1],
                 [-1, -1, -1]],
                progress,
                false, true, true
            );
        },
        
        // A 5x5 Laplacian edge-detect
        laplace5x5 : function(inData, outData, width, height, options, progress) {
            convolve5x5(
                inData, outData, width, height, 
                [[-1, -1, -1, -1, -1],
                 [-1, -1, -1, -1, -1],
                 [-1, -1, 24, -1, -1],
                 [-1, -1, -1, -1, -1],
                 [-1, -1, -1, -1, -1]],
                progress,
                false, true, true
            );
        },
        
        coloradjust : function(inData, outData, width, height, options, progress) {
            var n = width * height * 4,
                r, g, b,
                prog, lastProg = 0,
                ar = clamp(options.r, -1, 1) * 255,
                ag = clamp(options.g, -1, 1) * 255,
                ab = clamp(options.b, -1, 1) * 255;

            for (var i=0;i<n;i+=4) {
                r = inData[i] + ar;
                g = inData[i+1] + ag;
                b = inData[i+2] + ab;
                if (r < 0) r = 0;
                if (g < 0) g = 0;
                if (b < 0) b = 0;
                if (r > 255) r = 255;
                if (g > 255) g = 255;
                if (b > 255) b = 255;
                outData[i] = r;
                outData[i+1] = g;
                outData[i+2] = b;
                outData[i+3] = inData[i+3];
                
                if (progress) {
                    prog = (i/n*100 >> 0) / 100;
                    if (prog > lastProg) {
                        lastProg = progress(prog);
                    }
                }
            }
        },
        
        colorfilter : function(inData, outData, width, height, options, progress) {
            var n = width * height * 4,
                i, r, g, b,
                luminosity = !!options.luminosity,
                prog, lastProg = 0,
                min, max, h, l, h1, chroma, tmp, m,
                ar = clamp(options.r, 0, 1),
                ag = clamp(options.g, 0, 1),
                ab = clamp(options.b, 0, 1);
                
            for (i=0;i<n;i+=4) {
                r = inData[i] / 255;
                g = inData[i+1] / 255;
                b = inData[i+2] / 255;
                
                l = r * 0.3 + g * 0.59 + b * 0.11;
                    
                r = (r + r * ar) / 2;
                g = (g + g * ag) / 2;
                b = (b + b * ab) / 2;

                if (luminosity) {
                    min = max = r;
                    if (g > max) max = g;
                    if (b > max) max = b;
                    if (g < min) min = g;
                    if (b < min) min = b;
                    chroma = (max - min);

                    if (r == max) {
                        h = ((g - b) / chroma) % 6;
                    } else if (g == max) {
                        h = ((b - r) / chroma) + 2;
                    } else {
                        h = ((r - g) / chroma) + 4;
                    }

                    h1 = h >> 0;
                    tmp = chroma * (h - h1);
                    r = g = b = l - (r * 0.3 + g * 0.59 + b * 0.11);
                        
                    if (h1 == 0) {
                        r += chroma; 
                        g += tmp;
                    } else if (h1 == 1) {
                        r += chroma - tmp;
                        g += chroma;
                    } else if (h1 == 2) {
                        g += chroma;
                        b += tmp;
                    } else if (h1 == 3) {
                        g += chroma - tmp;
                        b += chroma;
                    } else if (h1 == 4) {
                        r += tmp;
                        b += chroma;
                    } else if (h1 == 5) {
                        r += chroma;
                        b += chroma - tmp;
                    }
                }

                outData[i] = r * 255;
                outData[i+1] = g * 255;
                outData[i+2] = b * 255;
                outData[i+3] = inData[i+3];
                
                if (progress) {
                    prog = (i/n*100 >> 0) / 100;
                    if (prog > lastProg) {
                        lastProg = progress(prog);
                    }
                }
            }
        },
        
        hsl : function(inData, outData, width, height, options, progress) {
            var n = width * height * 4,
                hue = clamp(options.hue, -1, 1),
                saturation = clamp(options.saturation, -1, 1),
                lightness = clamp(options.lightness, -1, 1),
                satMul = 1 + saturation * (saturation < 0 ? 1 : 2),
                lightMul = lightness < 0 ? 1 + lightness : 1 - lightness,
                lightAdd = lightness < 0 ? 0 : lightness * 255,
                vs, ms, vm, h, s, l, v, m, vmh, sextant,
                prog, lastProg = 0;

            hue = (hue * 6) % 6;
                    
            for (var i=0;i<n;i+=4) {

                r = inData[i];
                g = inData[i+1];
                b = inData[i+2];
                
                if (hue != 0 || saturation != 0) {
                    // ok, here comes rgb to hsl + adjust + hsl to rgb, all in one jumbled mess. 
                    // It's not so pretty, but it's been optimized to get somewhat decent performance.
                    // The transforms were originally adapted from the ones found in Graphics Gems, but have been heavily modified.
                    vs = r;
                    if (g > vs) vs = g;
                    if (b > vs) vs = b;
                    ms = r;
                    if (g < ms) ms = g;
                    if (b < ms) ms = b;
                    vm = (vs-ms);
                    l = (ms+vs)/510;
                    
                    if (l > 0 && vm > 0) {
                        if (l <= 0.5) {
                            s = vm / (vs+ms) * satMul;
                            if (s > 1) s = 1;
                            v = (l * (1+s));
                        } else {
                            s = vm / (510-vs-ms) * satMul;
                            if (s > 1) s = 1;
                            v = (l+s - l*s);
                        }
                        if (r == vs) {
                            if (g == ms) {
                                h = 5 + ((vs-b)/vm) + hue;
                            } else {
                                h = 1 - ((vs-g)/vm) + hue;
                            }
                        } else if (g == vs) {
                            if (b == ms) {
                                h = 1 + ((vs-r)/vm) + hue;
                            } else {
                                h = 3 - ((vs-b)/vm) + hue;
                            }
                        } else {
                            if (r == ms) {
                                h = 3 + ((vs-g)/vm) + hue;
                            } else {
                                h = 5 - ((vs-r)/vm) + hue;
                            }
                        }
                        if (h < 0) h += 6;
                        if (h >= 6) h -= 6;
                        m = (l + l - v);
                        sextant = h >> 0;
                        vmh = (v - m) * (h - sextant);
                        if (sextant == 0) {
                            r = v; 
                            g = m + vmh;
                            b = m;
                        } else if (sextant == 1) {
                            r = v - vmh;
                            g = v;
                            b = m;
                        } else if (sextant == 2) {
                            r = m;
                            g = v;
                            b = m + vmh;
                        } else if (sextant == 3) {
                            r = m;
                            g = v - vmh;
                            b = v;
                        } else if (sextant == 4) {
                            r = m + vmh;
                            g = m;
                            b = v;
                        } else if (sextant == 5) {
                            r = v;
                            g = m;
                            b = v - vmh;
                        }
                        
                        r *= 255;
                        g *= 255;
                        b *= 255;
                    }
                }
                
                r = r * lightMul + lightAdd;
                g = g * lightMul + lightAdd;
                b = b * lightMul + lightAdd;
                
                if (r < 0) r = 0;
                if (g < 0) g = 0;
                if (b < 0) b = 0;
                if (r > 255) r = 255;
                if (g > 255) g = 255;
                if (b > 255) b = 255;
                
                outData[i] = r;
                outData[i+1] = g;
                outData[i+2] = b;
                outData[i+3] = inData[i+3];
                
                if (progress) {
                    prog = (i/n*100 >> 0) / 100;
                    if (prog > lastProg) {
                        lastProg = progress(prog);
                    }
                }
            }
        },
        
        posterize : function(inData, outData, width, height, options, progress) {
            var numLevels = clamp(options.levels, 2, 256),
                numAreas = 256 / numLevels,
                numValues = 256 / (numLevels-1),
                r, g, b,
                n = width * height * 4,
                prog, lastProg = 0;

            for (i=0;i<n;i+=4) {
            
                outData[i] = numValues * ((inData[i] / numAreas)>>0);
                outData[i+1] = numValues * ((inData[i+1] / numAreas)>>0); 
                outData[i+2] = numValues * ((inData[i+2] / numAreas)>>0); 
            
                outData[i+3] = inData[i+3];

                if (progress) {
                    prog = (i/n*100 >> 0) / 100;
                    if (prog > lastProg) {
                        lastProg = progress(prog);
                    }
                }
            }
            
        },
        
        removenoise : function(inData, outData, width, height, options, progress) {
            var r, g, b, c, y, x, idx,
                pyc, pyp, pyn,
                pxc, pxp, pxn,
                minR, minG, minB, maxR, maxG, maxB,
                n, prog, lastProg = 0;
                
            n = width * height * 4;
                
            for (y=0;y<height;++y) {
                pyc = y * width * 4;
                pyp = pyc - width * 4;
                pyn = pyc + width * 4;

                if (y < 1) pyp = pyc;
                if (y >= width-1) pyn = pyc;
                
                for (x=0;x<width;++x) {
                    idx = (y * width + x) * 4;
                    
                    pxc = x * 4;
                    pxp = pxc - 4;
                    pxn = pxc + 4;
              
                    if (x < 1) pxp = pxc;
                    if (x >= width-1) pxn = pxc;
                    
                    minR = maxR = inData[pyc + pxp];
                    c = inData[pyc + pxn];
                    if (c < minR) minR = c;
                    if (c > maxR) maxR = c;
                    c = inData[pyp + pxc];
                    if (c < minR) minR = c;
                    if (c > maxR) maxR = c;
                    c = inData[pyn + pxc];
                    if (c < minR) minR = c;
                    if (c > maxR) maxR = c;

                    minG = inData[pyc + pxp + 1];
                    c = inData[pyc + pxn + 1];
                    if (c < minG) minG = c;
                    c = inData[pyp + pxc + 1];
                    if (c < minG) minG = c;
                    c = inData[pyn + pxc + 1];
                    if (c < minG) minG = c;
                    
                    minB = inData[pyc + pxp + 2];
                    c = inData[pyc + pxn + 2];
                    if (c < minB) minB = c;
                    c = inData[pyp + pxc + 2];
                    if (c < minB) minB = c;
                    c = inData[pyn + pxc + 2];
                    if (c < minB) minB = c;

                    r = inData[idx]
                    g = inData[idx + 1]
                    b = inData[idx + 2]
                    
                    if (r < minR) r = minR;
                    if (r > maxR) r = maxR;
                    if (g < minG) g = minG;
                    if (g > maxG) g = maxG;
                    if (b < minB) b = minB;
                    if (b > maxB) b = maxB;
                    
                    outData[idx] = r;
                    outData[idx+1] = g;
                    outData[idx+2] = b;
                    outData[idx+3] = inData[idx+3];
                    
                    if (progress) {
                        prog = (idx/n*100 >> 0) / 100;
                        if (prog > lastProg) {
                            lastProg = progress(prog);
                        }
                    }
                }
            }
        }
        
    };

})();
