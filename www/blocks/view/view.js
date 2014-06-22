ctrl.onDisplayed = function()  {
    var  ngID = ctrl.r('#_params').attr('data-ngid');

    coim.getToken(function(token) {
        if (token)  {
            var  srcBase = 'http://wirenotes.coimapi.tw/cms/att/node/' + ngID +
                           '?maxw=240&token=' + token + '&path=';

            ctrl.r('#noteBody img').each(function(idx) {
                var  path = $(this).attr('data-path');
                $(this).attr('src', srcBase + path);
            });
        }
    });
};
