ctrl.onDisplayed = function()  {
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
