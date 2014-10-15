ctrl.onDisplayed = function()  {
    // first check if the user has been login with a FB account
    coim.sws.checkFB('public_profile', function(result) {
        alert( JSON.stringify(result) );
        if (result.errCode === 0)
            _wf.loadPage( nextPage );
        else
            custLogin();
    },
    function(err) {
        alert( JSON.stringify(err) );
        custLogin();
    });
};

/**
 * Check if the user is registered with our own login scheme.
 * If so, allow the user to proceed. Otherwise, redirect to the 'login' page.
 */
function  custLogin()  {
    coim.send('core/user/profile', {}, function(rtnData) {
        var  nextPage = 'login';
        if (rtnData.errCode === 0 && rtnData.value.isGuest != 1)
                nextPage = 'list';

        _wf.loadPage( nextPage );
    },
    function(err) {
        _wf.loadPage( 'login' );
    });
};
