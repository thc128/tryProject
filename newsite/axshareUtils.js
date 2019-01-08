(function() {
    if (!window.$axshare) window.$axshare = { };

    var _secureSubmit = function(options) {
        options.type = "GET";
        options.dataType = "jsonp";
        options.data.isAjax = true;

        //options.url starts as a relative url
        options.url = window.AXSHARE_HOST_SECURE_URL + options.url;

        $.ajax(options);
    };

    $axshare.secureSubmit = _secureSubmit;

    var _getCookieValue = function(cookieName) {
        var fullCookieName = "" + cookieName + "=";
        var cookieValue = '';

        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') c = c.substring(1, c.length);
            if (c.indexOf(fullCookieName) == 0) cookieValue = c.substring(fullCookieName.length, c.length);
        }

        return cookieValue;
    }

    $axshare.getCookieValue = _getCookieValue;

    $axshare.setAuthCookie = function(authToken) {
        document.cookie = 'utoken=' + authToken + '; path=/';
    }

    $axshare.getQueryVariable = function(variable) {
        var query = window.location.search.substring(1);
        var vars = query.split("&");
        for (var i = 0; i < vars.length; i++) {
            var pair = vars[i].split("=");
            if (pair[0] == variable) { return pair[1]; }
        }
        return false;
    }

    $axshare.urlPaths = {
        fsmanage: "/fs/manage",
        logout : "/user/logout"
    }
})();
