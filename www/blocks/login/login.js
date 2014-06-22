ctrl.onDisplayed = function()  {
    ctrl.r("#start").click();
};

ctrl.doLogin = function()  {
    var  pdata = {accName: ctrl.r("input[name='accName']").val(), passwd: ctrl.r("input[name='passwd']").val()};
    login(pdata);
};


ctrl.doRegister = function()  {
    var  pdata = {accName: ctrl.r("input[name='accName']").val(),
                  passwd: ctrl.r("input[name='passwd']").val(),
                  passwd2: ctrl.r("input[name='passwd2']").val()
                  };

    if (pdata.passwd.length < 6)  {
        alert('密碼長度必須至少六碼');
        return;
    }
    if (pdata.passwd !== pdata.passwd2)  {
        alert('確認密碼和原密碼不相符');
        return;
    }

    coim.register(pdata, function(rtnData) {
        if (rtnData.errCode === 0) {
            delete  pdata.passwd2;
            login(pdata);
        }
        else
            alert('Register Failed.');
    });
};


ctrl.switchField = function(type) {
    if (type === 'log') {
        ctrl.r(".logField").show();
        ctrl.r(".regField").hide();
    } else {
        ctrl.r(".logField").hide();
        ctrl.r(".regField").show();
    }
};


function  login(pdata)  {
    coim.login('core/user/login', pdata, function(rtnData) {
        if (rtnData.errCode === 0)
            _wf.loadPage('list', {params: {pri:1}});
        else
            alert('Login failed.');
    });
};
