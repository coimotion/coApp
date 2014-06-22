var  capturedPath;

ctrl.onDisplayed = function()  {
    capturedPath = null;
};

ctrl.capture = function capturePhoto() {
    var  options = {
        sourceType: Camera.PictureSourceType.CAMERA,
        targetWidth: 640,
        targetHeight: 640,
        quality:40
    };
    navigator.camera.getPicture(showPhoto, null, options);
};

ctrl.save = function()  {
    var  params = {
        title: ctrl.r('input[name="title"]').val()
    };

    if (!params.title)  {
        alert('請填上標題');
        return;
    }

    coim.send('WireNotes/notes/create', params, function(rtnData) {
        if (rtnData.errCode === 0)  {
            //var  imgPath = ctrl.r('#cameraPic').attr('src');
            //alert('imgpath: ' + imgPath);
            if (capturedPath)  {
                var  imgPath = capturedPath.substring('file://'.length);

                var  ngID = rtnData.value,
                     files = [];
                params.nType = 3;
                files.push( imgPath );

                coim.attach('WireNotes/notes/attach/'+ ngID, params, files, function(rtnData) {
                    if (rtnData.errCode === 0)  {
                        navigator.camera.cleanup(function()  {
                            _wf.loadPage('list');
                        }, function() {
                            _wf.loadPage('list');
                        });
                    }
                    else
                        alert('上傳照片失敗');
                });
            }
            else
                _wf.loadPage('list');
        }
        else
            alert('新增筆記失敗');
    });
};

function  showPhoto(imgData)  {
    // PhoneGap recommended quirk fix
    setTimeout( function()  {
        ctrl.r('#cameraPic').attr('src', capturedPath = imgData);
    }, 0);
};
