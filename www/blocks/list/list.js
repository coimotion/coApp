ctrl.onDisplayed = function()  {};

ctrl.sidebar = function(cmd)  {
    ctrl.r('.sidebar').sidebar(cmd);
};

ctrl.viewPage = function(ngID)  {
    ctrl.r('.dimmer').dimmer('show');
    _wf.loadPage('view', {id: ngID, effect:'nextDisp'});
};

ctrl.logout = function()  {
    if (confirm('確定要登出嗎?'))  {
        coim.logout(function(result) {
            _wf.loadPage('login');
        });
    }
};
