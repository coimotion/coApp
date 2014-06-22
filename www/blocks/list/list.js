ctrl.onDisplayed = function()  {};

ctrl.viewPage = function(ngID)  {
    _wf.loadPage('view', {id: ngID, effect:'nextDisp'});
};
