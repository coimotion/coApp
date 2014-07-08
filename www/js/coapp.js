/*!
 * coApp
 * authors: Ben Lue
 * license: MIT
 * Copyright(c) 2014 Gocharm Inc.
 */
var  _wfRoot = '../www/blocks/';

var  _wf = (function() {

    var  pageMap = {},
         curId;

    function  _wf()  {};

    _wf.initialize = function(pages)  {
        document.addEventListener('deviceready', function() {
            // setup all pages
            if (pages && pages.length > 0)  {
                // detect device dimensiton
                var  sw = window.screen.width,
                     sw10 = sw + 10;

                if ( /iPhone|iPad|iPod/i.test(navigator.userAgent) )  {
                    $('body').css('margin-top', '20px');
                }

                var style = document.createElement('style');
                style.type = 'text/css';
                style.innerHTML = '.mpage { width: ' + sw + 'px; height: 100%;}\n' +
                                  '.gotoDisp {left: ' + sw10 + 'px;}\n' +
                                  '.nextDisp {left: ' + -sw10 + 'px;}';
                document.getElementsByTagName('head')[0].appendChild(style);

                var  html = '';
                for (var i in pages)
                    html += '<div id="' + pages[i].id + '" />';
                $('body').append( html );

                for (var i in pages)
                    _wf.addPage( pages[i] );

                _wf.loadPage( pages[0].id );
            }
            else
                console.log('Missing page info.');
        }, false);

        window.addEventListener('load', function() {
            document.body.addEventListener('touchmove', function(e) {
                e.preventDefault();
            }, false);
        }, false);
    };

    _wf.addPage = function addPage(pgInfo)  {
        var  pgID = pgInfo.id;

        pgInfo.curEffect = pgInfo.effect = pgInfo.effect || 'gotoDisp';
        pgInfo.refresh = true;
        pgInfo.path = pgInfo.path || pgID;

        $('#' + pgID).addClass('mpage');
        $('#' + pgID).addClass(pgInfo.effect);
        pageMap[pgID] = pgInfo;
    }

    _wf.loadPage = function loadPage(id, options)  {
        var  pgInfo = pageMap[id],
             dftData = {};

        if (pgInfo)  {
            options = options || {};
            var  refresh = options.hasOwnProperty('refresh')  ?  options.refresh : pgInfo.refresh;

            if (pgInfo.remote && refresh)  {
                var  reqURL = pgInfo.remote,
                     params = {};

                if (pgInfo.params)
                    for (var k in pgInfo.params)
                        params[k] = pgInfo.params[k];

                if (options)  {
                    if (options.id)  {
                        dftData.id = options.id;
                        reqURL += '/' + options.id;
                    }

                    if (options.params)
                        for (var k in options.params)
                            params[k] = options.params[k];
                }

                coimPlugin.send(reqURL, params,
                    function(rtnData) {
                        rtnData.id = dftData.id;
                        pgInfo.rtnData = rtnData;    // store the result, so when the network connection is broken we'll still have something to show
                        dspPage(pgInfo, options, rtnData);
                    },
                    function(err)  {
                        dspPage( pgInfo, options, dftData );
                    }
                );
            }
            else
                dspPage( pgInfo, options, pgInfo.rtnData );
        }
        else
            alert('No such page (' + id + ')');
    };

    _wf.ctrl = function getCtrl(id)  {
        return  pageMap[id].ctrl;
    };

    function  dspPage(pgInfo, options, result)  {
        var  id = pgInfo.id,
             fpath = _wfRoot + pgInfo.path + '/',
             htmlF = fpath + pgInfo.path + '.html',
             jsF = fpath + pgInfo.path + '.js';

        $.post( htmlF, function(html) {
            if (result)  {
                var  template = Handlebars.compile( html );
                html = template(result);
            }

            options = options || {};

            $('#' + id).html( html );
            showPage(id, options);
            loadScript(id, pgInfo, jsF);
        });
    };

    function  showPage(id, options, callback)  {
        var  oldId = curId,
             curPage = $('#' + id),
             movEffect = options.effect;

        curPage.on('webkitTransitionEnd', function(event) {
            if (callback)
                callback();

            if (oldId)
                hidePage(oldId, movEffect);
            curPage.off('webkitTransitionEnd');
        });

        if (oldId)
            $('#' + oldId).css('z-index', '0');
        curPage.css('z-index', '10');

        curPage.removeClass(pageMap[id].curEffect);
        curPage.addClass('onDisp');
        curId = id;
    };

    function  loadScript(pgID, pgInfo, jsF)  {
        if (pgInfo.ctrl === undefined)  {
            $.ajax({
                url: jsF,
                success: function(jsCode)  {
                    if (jsCode)  {
                        jsCode = '(function()  {var  ctrl = new _ctrl("#' + pgID + '");' + jsCode + 'return ctrl;})();';
                        pgInfo.ctrl = eval( jsCode );
                        pgInfo.ctrl.onDisplayed();
                    }
                    else
                        pgInfo.ctrl = null;
                }
            });
        }
        else  if (pgInfo.ctrl !== null)  {
            pgInfo.ctrl.onDisplayed();
        }
    };

    function  hidePage(pageID, movEffect)  {
        pageMap[pageID].curEffect = movEffect = movEffect || pageMap[pageID].effect;
        //console.log('hide page [%s], set effect to %s, page effect is %s', pageID, movEffect, pageMap[pageID].effect);

        $('#' + pageID).removeClass('onDisp');
        $('#' + pageID).addClass(movEffect);
    };

    return  _wf;
})();


var  _ctrl = (function()  {
	var  _ctrl = function _ctrl(target, opURI)  {
		this.dspTarget = target;
		this.evtMap = {};
		this.opURI = opURI;

		this.getTarget = function()  {
			return  this.dspTarget;
		};
	};

    _ctrl.prototype.r = function(rule)  {
        return  $(this.dspTarget).find(rule);
    };

    return  _ctrl;
})();
