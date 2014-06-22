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

        pgInfo.effect = 'gotoDisp';
        pgInfo.refresh = true;
        pgInfo.path = pgInfo.path || pgID;

        $('#' + pgID).addClass('page');
        $('#' + pgID).addClass('gotoDisp');
        pageMap[pgID] = pgInfo;
    }

    _wf.loadPage = function loadPage(id, options)  {
        var  pgInfo = pageMap[id],
             dftData = {};

        if (pgInfo)  {
            if (pgInfo.remote && pgInfo.refresh)  {
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
                        dspPage(pgInfo, options, rtnData);
                    },
                    function(err)  {
                        dspPage( pgInfo, options, dftData );
                    }
                );
            }
            else
                dspPage( pgInfo, options );
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

            $('#' + id).html( html );
            showPage(id, options);
            loadScript(id, pgInfo, jsF);
        });
    };

    function  showPage(id, options, callback)  {
        var  oldId = curId,
             curPage = $('#' + id),
             movEffect = 'gotoDisp';

        if (options && options.effect)
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
        curPage.css('z-index', '100');

        var  curEffect = pageMap[id].effect;
        curPage.removeClass(curEffect);
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
        $('#' + pageID).removeClass('onDisp');
        $('#' + pageID).addClass(movEffect);
        pageMap[pageID].effect = movEffect;
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
