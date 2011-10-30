var eksigator = {};

eksigator.onDeviceReady = function () {
    document.addEventListener("deviceready", eksigator.init, true);
};

eksigator.checkUsernameAndApiKey = function () {
    var username = localStorage.getItem("username");
    var apiKey = localStorage.getItem("apiKey");
    if (username && apiKey) {
        eksigator.getList();
    }
    else {
        eksigator.showLoginForm();
    }
};

eksigator.showLoginForm = function () {
    var username = localStorage.getItem("username");
    var apiKey = localStorage.getItem("apiKey");

    var $form = $("<form>").attr("id", "loginForm");

    var $usernameLabel = $('<label>').html("Kullanıcı Adı").appendTo($form);
    var $username = $('<input>').attr("type", "text").val(username).appendTo($form);
    var $apiKeyLabel = $('<label>').html("API Anahtarı").appendTo($form);
    var $apiKey = $('<input>').attr("type", "text").val(apiKey).appendTo($form);
    var $submit = $('<input>').attr("type", "submit").val("Kaydet").appendTo($form);

    $("#content").html($form);
    //too uglu
    setTimeout(function () {
        $("#btn_settings").removeClass("hover");
    }, 250);

    $form.submit(function (e) {
        e.preventDefault();
        eksigator.validateUsernameAndApiKey($username.val(), $apiKey.val(), function () {
            alert('Kullanıcı adı ve API anahtarınızı başarıyla kaydedildi');
        }, function () {
            alert('HATA: Kullanıcı adı veya API anahtarınız geçersiz!');
        });
    });
};


eksigator.JSONP = function (uri, callback, errorCallback) {
    eksigator.loading.init();
    var url = "http://api.eksigator.com/" + uri + "?jsoncallback=?";
    $.getJSON(url, function (response) {
        eksigator.loading.end();
        if (response.message == "AUTH_FAILED") {
            errorCallback(response);
        }
        else {
            callback(response);
        }
    });
};


eksigator.apiCall = function (action, param, callback) {
    var username = localStorage.getItem("username");
    var apiKey = localStorage.getItem("apiKey");

    var uri = username + "/" + apiKey + "/" + action + "/" + param;
    eksigator.JSONP(uri, callback);
};




eksigator.validateUsernameAndApiKey = function (username, apiKey, validatedCallback, notValidatedCallback) {
    localStorage.setItem("username", username);
    localStorage.setItem("apiKey", apiKey);

    eksigator.JSONP(username+"/"+apiKey+"/getList", function (d) {
        validatedCallback();
        localStorage.setItem("validated", true);
    }, function () {
        localStorage.setItem("validated", false);
        notValidatedCallback();
    });
};


eksigator.reload = function () {
    eksigator.getList();
    /*
    //$("#content").html("Yükleniyor");
    setTimeout(function () {
        window.location.reload();
    },1000);
    */
};


eksigator.toggleFooter = function () {
    $("#footer").slideToggle(250);
    $("#content").toggleClass("footerShown");
};

eksigator.onMenuButton = function () {
    eksigator.toggleFooter();
    //eksigator.reload();
};

eksigator.setContainerHeight = function () {
    var height = $(window).height();
    var footerHeight = 37;

    //$("#container").css("height", (height - footerHeight) + "px");
};


eksigator.getList = function () {
    eksigator.apiCall("getList", undefined, function (response) {
        var updated = [];
        var notUpdated = [];

        for (var i = 0; i < response.length; i++) {
            if (response[i].status == 1) {
                updated.push(response[i]);
            }
            else {
                notUpdated.push(response[i]);
            }
        }

        eksigator.drawList(updated, notUpdated);
    });
};

eksigator.drawList = function (updated, notUpdated) {

    var fixUriChars = function (text) {
        text = text.replace(/\+/g, "%2B");
        return text;
    }

    var i = 0;
    var href;
    var $result = $("<div>").attr("id", "result");

    var $updated = $("<div>").attr("id", "updatedList").appendTo($result);
    var $updatedHeader = $("<h1>").html("Güncellenen başlıklar").appendTo($updated);
    var $updatedContainer = $("<div>").addClass("listContainer").appendTo($updated);    

    $updatedHeader.click(function () {
        $updated.toggleClass("hidden");
    });


    var $notUpdated = $("<div>").attr("id", "notUpdatedList").addClass("hidden").appendTo($result);
    var $notUpdatedHeader = $("<h1>").html("Diğer başlıklar").appendTo($notUpdated);
    var $notUpdatedContainer = $("<div>").addClass("listContainer").appendTo($notUpdated);    


    $notUpdatedHeader.click(function () {
        $notUpdated.toggleClass("hidden");
    });


    var url = "http://www.eksisozluk.com/show.asp?t=";

    //+fixUriChars(title)+"&i="+lastId;

    for(i = 0; i < updated.length; i++) {
        href = url + fixUriChars(updated[i].title)+"&i="+updated[i].lastId;
        $("<a>").html(updated[i].title).attr("href", href).appendTo($updatedContainer);
    }
    for(i = 0; i < notUpdated.length; i++) {
        href = url + fixUriChars(notUpdated[i].title)+"&i="+notUpdated[i].lastId;
        $("<a>").html(notUpdated[i].title).attr("href", href).appendTo($notUpdatedContainer);
    }

    $("#content").html($result);
    //too ugly
    setTimeout(function () {
        $("#btn_reload").removeClass("hover");
    }, 200);
};


eksigator.bindEvents = function () {
    $("#btn_reload").click(function () {
        $(this).addClass("hover");
        eksigator.reload(); 
    });

    $("#btn_settings").click(function () {
        $(this).addClass("hover");
        eksigator.showLoginForm(); 
    });
};


eksigator.loading = {};

eksigator.loading.timer = undefined;

eksigator.loading.init = function () {
    $("#loading").show();
    this.timer = setInterval(function () {
        $("#loading span").fadeOut(function () {
            $("#loading span").fadeIn();
        });
    }, 1000);
};

eksigator.loading.end = function () {
    $("#loading").hide();
};

eksigator.init = function () {
    document.addEventListener("menubutton", eksigator.onMenuButton, false);
    eksigator.bindEvents();
    eksigator.setContainerHeight();
    eksigator.checkUsernameAndApiKey();

};
