'use strict';
!function(){

    var request = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame
        || function(cb) { return setTimeout(cb, 30) };

    Math.TAU = Math.PI * 2;

    var Fogs = function()
    {
        var me = this;

        var canvas     = document.getElementById('fogs');
        var engine     = canvas.getContext('2d');

        var starCanvas     = document.createElement('canvas');
        var starEngine     = starCanvas.getContext('2d');

        var layer        = [];
        var maxLayer     = 5;

        var layerTick         = 0;
        var layerMaxTick      = 10;
        var layerMaxSuperTick = layerMaxTick * maxLayer;
        var layerCount        = 0;

        var minStars = 20;
        var maxStars = 100;

        var minFogs  = 10;
        var maxFogs  = 30;

        var minFogLayer = 3;
        var maxFogLayer = 5;

        var baseTicker = 0;

        var mouse = {
            x : window.innerWidth / 2,
            y : window.innerWidth / 2
        };

        var paralaxSize = 50;

        var colorMin = 200;
        var colorMax = 340;
        var color    = 280;

        var paralax = {
            x : 0,
            y : 0
        };

        this.run = function()
        {
            canvas.setAttribute('width', window.innerWidth);
            canvas.setAttribute('height', window.innerHeight);

            starCanvas.setAttribute('width', window.innerWidth);
            starCanvas.setAttribute('height', window.innerHeight);

            //chrome
            window.addEventListener('mousewheel', function(e) {
                wheel(e.wheelDelta > 0);
            });

            //firefox
            window.addEventListener('wheel', function(e) {
                wheel(e.deltaY < 0);
            });

            canvas.addEventListener('mousemove', function(e) {
                mouse.x = e.clientX;
                mouse.y = e.clientY;

                paralax.x = solveRange(paralaxSize / 2, 0 - paralaxSize / 2, 1 / window.innerWidth * mouse.x);
                paralax.y = solveRange(paralaxSize / 2, 0 - paralaxSize / 2, 1 / window.innerHeight * mouse.y);
            });

            build();
            tick();
        };


        var wheel = function(up)
        {
            if (up) {
                layerCount += layerMaxTick;
            } else {
                layerCount -= layerMaxTick;
            }
        };

        var solveRange = function(min, max, percentage)
        {
            return min + (max - min) * percentage;
        };

        var solveRangeExpo = function(min, max, percentage, expo)
        {
            var maxExpo = Math.pow(2, expo);
            var check   = max * percentage;

            return min + (max - min) / maxExpo * check;
        };

        var build = function()
        {
            for (var i = 0; i < maxLayer; i++) {
                layer.push(buildPackage());
            }

            buildBgStars();
        };

        var buildBgStars = function()
        {
            starEngine.clearRect(0, 0, window.innerWidth, window.innerHeight);

            for (var i = 0, max = rand(minStars, maxStars); i < max; i++) {
                var r = rand(1, 4);
                var x = rand(0, window.innerWidth);
                var y = rand(0, window.innerHeight);

                var g = starEngine.createRadialGradient(x, y, 0, x, y, r);
                g.addColorStop(0, 'rgba(255, 255, 255, ' + rand(0.2, 1) + ')');
                g.addColorStop(1, 'rgba(255, 255, 255, 0)');
                starEngine.fillStyle = g;

                starEngine.beginPath();
                starEngine.arc(x, y, r, 0, Math.TAU);
                starEngine.fill();
                starEngine.closePath();
            }
        };

        var buildPackage = function()
        {
            var pack = {
                stars : [],
                fogs  : []
            };

            for (var i = 0, maxLayer = rand(minFogLayer, maxFogLayer); i < maxLayer; i++) {
                var width  = rand(window.innerWidth / 5, window.innerWidth / 2);
                var height = width; //rand(window.innerHeight / 5, window.innerHeight / 1.5);
                var left   = rand(-200, window.innerWidth - width + 400);
                var top    = rand(-200, window.innerHeight - height + 400);

                var helperCanvas = document.createElement('canvas');
                helperCanvas.setAttribute('width', width);
                helperCanvas.setAttribute('height', height);

                var helperEngine = helperCanvas.getContext('2d');
                helperEngine.globalCompositeOperation = 'xor';

                pack.fogs.push({
                    canvas : helperCanvas,
                    width  : width,
                    height : height,
                    x      : left,
                    y      : top
                });


                var color = [
                    [207, 34, 50, 0.7],
                    [207, 34, 10, 0]
                ];

                if (Math.random() < 0.5) {
                    color = [
                        [350, 10, 50, 0.7],
                        [350, 10, 10, 0]
                    ];
                }

                //fogs
                for (var j = 0, maxFog = rand(minFogs, maxFogs); j < maxFog; j++) {
                    var r = rand(height / 6, height / 3);
                    var x = rand(r, width - r);
                    var y = rand(r, height - r);

                    var g = helperEngine.createRadialGradient(x, y, 1, x, y, r);
                    g.addColorStop(0, hsl(color[0]));
                    g.addColorStop(1, hsl(color[1]));
                    helperEngine.fillStyle = g;

                    helperEngine.beginPath();
                    helperEngine.arc(x, y, r, 0, Math.TAU);
                    helperEngine.fill();
                    helperEngine.closePath();
                }

                //stars
                for (var j = 0, maxStar = rand(minStars, maxStars); j < maxStar; j++) {
                    var r = rand(1, 4);
                    var x = rand(height / 6, width - height / 6);
                    var y = rand(height / 6, height - height / 6);

                    var g   = helperEngine.createRadialGradient(x, y, 0, x, y, r);
                    var opa = rand(0.2, 1);

                    g.addColorStop(0.3, 'rgba(255, 255, 255, ' + opa + ')');
                    g.addColorStop(1, 'rgba(255, 255, 255, 0)');
                    helperEngine.fillStyle = g;

                    helperEngine.beginPath();
                    helperEngine.arc(x, y, r, 0, Math.TAU);
                    helperEngine.fill();
                    helperEngine.closePath();

                    if (Math.random() < 0.1) {
                        var starStuffCanvas = document.createElement('canvas');
                        var starStuffEngine = starStuffCanvas.getContext('2d');

                        starStuffCanvas.setAttribute('width', width);
                        starStuffCanvas.setAttribute('height', height);
                        starStuffEngine.fillStyle = 'rgba(255, 255, 255, ' + opa + ')';

                        r = Math.ceil(r / 3);

                        for (var d = 0; d < 2; d++) {
                            starStuffEngine.save();

                            var resizeX = 1;
                            var resizeY = 1;

                            if (d == 0) {
                                resizeY = 3;
                            } else {
                                resizeX = 3;
                            }

                            starStuffEngine.scale(resizeX, resizeY);

                            starStuffEngine.beginPath();
                            starStuffEngine.arc(x / resizeX, y / resizeY, r, 0, Math.TAU);
                            starStuffEngine.fill();
                            starStuffEngine.closePath();


                            helperEngine.drawImage(starStuffCanvas, 0, 0, width, height);
                            starStuffEngine.restore();
                        }
                    }
                }
            }



            return pack;
        };

        var hsl = function(colors)
        {
            if (colors.length == 4) {
                return 'hsla(' + colors[0] + ', ' + colors[1] + '%, ' + colors[2] + '%, ' + colors[3] + ')';
            }

            return 'hsl(' + colors[0] + ', ' + colors[1] + '%, ' + colors[2] + '%)';
        };

        var rand = function(min, max)
        {
            return min + Math.random() * (max - min);
        };

        var tick = function()
        {
            baseTicker++;

            tickLayer();
            clear();
            drawBg();

            for (var i = 0; i < layer.length; i++) {
                var l       = getLayer(i);
                var opacity = getLayerOpacity(i);
                engine.globalAlpha = opacity;

                var paraX = (i + 1) / (layer.length + 1) * paralax.x;
                var paraY = (i + 1) / (layer.length + 1) * paralax.y;

                for (var j = 0; j < l.fogs.length; j++) {
                    var fog = l.fogs[j];
                    engine.globalCompositeOperation = 'lighter';

                    var dim = getFogDimension(fog, i);

                    engine.drawImage(
                        fog.canvas,
                        dim.x + paraX,
                        dim.y + paraY,
                        dim.width,
                        dim.height
                    );
                }
            }

            engine.globalAlpha = 1;
            engine.drawImage(starCanvas, paralax.x / 10, paralax.y / 10, window.innerWidth, window.innerHeight);

            request(tick);
        };

        var getFogDimension = function(fog, iterator)
        {
            //var multiplier = solveRange(0.8, 2, (iterator + layerTick % layerMaxTick / layerMaxTick) / (layer.length - 1));
            var multiplier = solveRangeExpo(0.3, 4, (iterator + layerTick % layerMaxTick / layerMaxTick) / (layer.length - 1), 3);

            var width  = fog.width * multiplier;
            var height = fog.height * multiplier;

            var midRangeX = (fog.x - window.innerWidth / 2) * multiplier;
            var midRangeY = (fog.y - window.innerHeight / 2) * multiplier;

            var x = midRangeX + window.innerWidth / 2;
            var y = midRangeY + window.innerHeight / 2;

            return {
                x      : x,
                y      : y,
                width  : width,
                height : height
            };
        };

        var tickLayer = function()
        {
            var speedi = Math.ceil(layerCount / layerMaxTick);

            layerTick  += speedi;
            layerCount -= speedi;

            if (layerCount > 0) {
                color++;

                if (color > colorMax) {
                    color = colorMax;
                }
            } else if (layerCount < 0) {
                color--;

                if (color < colorMin) {
                    color = colorMin;
                }
            }

            while (layerTick < 0) {
                layerTick += layerMaxSuperTick * 10;
            }
        };

        var getLayerOpacity = function(iterator)
        {
            var opacity = 1;

            if (iterator == layer.length - 1) {
                opacity = 1 - layerTick % layerMaxTick / layerMaxTick;
            }

            if (iterator == 0) {
                opacity = layerTick % layerMaxTick / layerMaxTick;
            }

            return opacity;
        };

        var getLayer = function(iterator)
        {
            var move = layerTick % layerMaxSuperTick / layerMaxTick;

            var realIterator = iterator - parseInt(move);

            if (realIterator < 0) {
                realIterator = layer.length + realIterator;
            }

            return layer[realIterator];
        };

        var drawBg = function()
        {
            var g = engine.createRadialGradient(0, -200, 1, 0, -200, window.innerWidth + 200);
            g.addColorStop(0, hsl([color, 100, 30, 0.7]));
            g.addColorStop(1, hsl([color, 100, 10, 0.7]));
            engine.fillStyle = g;

            engine.fillRect(0, 0, window.innerWidth, window.innerHeight);
        };

        var clear = function()
        {
            engine.clearRect(0, 0, window.innerWidth, window.innerHeight);
        };
    };

    var f = new Fogs();
    f.run();
}();