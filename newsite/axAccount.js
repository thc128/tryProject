; (function () {
    $axshare.axAccountJsAvailable = true;
    $axshare.axAccountActions = {
        logout : 'logout', 
        loaded : 'loaded', 
    };

    $(document).ready(function () {
        //For IE - because it caches JSON
        $.ajaxSetup({ cache: false });

        $("head").append($("<link rel='stylesheet' href='" + ACCOUNT_SERVICE_SECURE_URL + "/Content/account/style.css' type='text/css' />"));

        // For cases where we don't need the dialog loaded, define this as false in the file.
        // NOTE: This was added because IE 9/10 locally was loading js in an async manner causing issues in the js.
        if($axshare.useAxAccountDialog === false) { return; }

        var d = $('<div></div>');
        d.load(ACCOUNT_SERVICE_SECURE_URL + "/Content/account/Dialogs.html", function () {
            $('body').append(d.children(0));

            // This is so hitting enter won't submit the form, must be done through ajax
            $('.axDummyForm').submit(function () { return false; });

            initChangeAccountDialog();
            initVerifyAccountDialog();

            $('#axResetPasswordDialog').axDialog();
            $('#axResetPasswordDialog .axCloseButton').click(function () {
                $('#axResetPasswordDialog').axDialog('hide');
            });
        });
    });

    function accountServiceSubmit(options) {
        options.type = "GET";
        options.dataType = "jsonp";
        options.data.isAjax = true;

        options.url = window.ACCOUNT_SERVICE_SECURE_URL + options.url;

        $.ajax(options);
    };

    function initChangeAccountDialog() {
        $('#axChangeAccountDialog').axDialog();
        $('#axSavePass').click(function () {
            var errors = $axshare.updateAccount(
                $('#axNewEmail').val(),
                $('#axPassword').val(),
                $('#axNewPassword').val(),
                $('#axConfirmNewPassword').val(),
                function (result) {
                    if (!result.success)
                        displayMessage([].concat(result.message));
                    else {
                        $('#axChangeAccountDialog').axDialog('hide');
                        displayMessage([]);
                    }
                    if ($axshare.updateAccountSuccess) $axshare.updateAccountSuccess(result);

                }
            );

            displayMessage(errors);
        });

        $('#axChangeAccountDialog #axCancelPass').click(function () {
            $('#axChangeAccountDialog').axDialog('hide');
        });
    }

    function initVerifyAccountDialog() {
        $('#axVerifyAccountDialog').axDialog();
        $('#axVerifyAccountDialog .axCloseButton').click(function () {
            $('#axVerifyAccountDialog').axDialog('hide');
        });
    }

    function displayMessage(messages) {
        var fullMessage = "";
        var first = true;
        for (var index in messages) {
            if (!first) fullMessage += "<br />\n";

            fullMessage += messages[index];
            first = false;
        }
        if(first) $("#axMessage").html("");
        else $("#axMessage").html(fullMessage);
    }

    $axshare.displayMessage = displayMessage;

    var _auth = function (success) {
        accountServiceSubmit({
            url: '/user/auth',
            data: {},
            success: success
        });
    };
    $axshare.auth = _auth;

    var isSafari = navigator.userAgent.indexOf('Safari') != -1 && navigator.userAgent.indexOf('Chrome') == -1;
    //Safari 5.1.4+ on mac broke hashing, send clear instead of hashed
    var isSafari5or6 = typeof navigator.userAgent != 'undefined' && isSafari
        && navigator.userAgent.indexOf("Macintosh") != -1
        && (navigator.userAgent.indexOf("Version/5.") != -1 || navigator.userAgent.indexOf("Version/6.") != -1);

    function preparePassword(clearPassword) {
        var salt = 'axure';
        var saltedPassword = hex_sha512(salt + clearPassword);
        return isSafari5or6 ? clearPassword:saltedPassword;
    }

    var _loginFunc = function (userEmail, password, staySignedIn, success, ldapEnabled) {
        var saltedPassword = preparePassword(password);
        var onPremLdapAuthentication = (ldapEnabled == "true");
        var useClearPassword = isSafari5or6 || onPremLdapAuthentication;
        var passwordBlank = password ? false : true;

        accountServiceSubmit({
            url: '/user/dologin',
            data: {
                loginEmail: userEmail,
                loginPassword: saltedPassword,
                altPassword: onPremLdapAuthentication ? password : '',
                staySignedIn: staySignedIn,
                clearPass: useClearPassword,
                passwordBlank: passwordBlank,
                accountService: true,
            },
            success: success
        });
    };
    $axshare.login = _loginFunc;

    $axshare.createAccount = function (userEmail, password, agreedToTerms, callerId, success, error) {
        var emailRegex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        var isValidEmail = emailRegex.test(userEmail);

        if (!isValidEmail) {
            error('Email address is not valid.');
            return;
        }

        if (password.length < 4) {
            error('The password must be at least 4 characters.');
            return;
        }

        if (!agreedToTerms) {
            error('Please agree to the AxShare terms to proceed.');
            return;
        }

        accountServiceSubmit({
            url: '/user/create',
            data: {
                email: userEmail,
                password: password,
                callerId: callerId
            },
            success: success
        });
    };

    $axshare.forgotPassword = function (userEmail, target) {
        $axshare.forgotPassword(userEmail, target, function (response) {
            if (response.success != true) {
                displayMessage(response.message);
            }
        });
    }

    $axshare.forgotPasswordDialog = function (userEmail, target, success) {
        $('#axResetPasswordDialog #axEmail').text(userEmail);

        $axshare.forgotPassword(userEmail, target, function (response) {
            if (response.success) $('#axResetPasswordDialog').axDialog('show');
            success(response);
        });

    };

    $axshare.forgotPassword = function (userEmail, target, success) {
        accountServiceSubmit({
            url: '/user/forgotpassword',
            data: {
                email: userEmail,
                target: target 
            },
            success: success
        });
    };

    $axshare.updateAccount = function (email, currentPassword, newPassword, confirmNewPassword, success) {
        var error = [];

        if (currentPassword.length == 0)
            error = error.concat(["Current password required"]);

        if (email.length == 0)
            error = error.concat(["Email required"]);

        var passLen = newPassword.length;
        var trimmedPassLen = $.trim(newPassword).length;
        if (passLen != 0 && trimmedPassLen < 4)
            error = error.concat(["New password must be at least 4 characters."]);

        if (passLen > trimmedPassLen)
            error = error.concat(["Leading and trailing spaces are not allowed in password."]);

        if (error.length == 0 && newPassword != confirmNewPassword) {
            error = error.concat(["Confirm password doesn't match New password."]);
        }

        if (error.length != 0) {
            return error;
        }

        accountServiceSubmit({
            url: '/user/changeAccountInfo',
            data: {
                currentEmail: email,
                currentPassword: currentPassword,
                newEmail: email,
                newPassword: newPassword,
            },
            success: success
        });

        return error;
    }

    $axshare.showUpdateAccountDialog = function (email) {
        $('#axNewEmail').val(email);
        $('#axPassword').val('');
        $('#axNewPassword').val(''),
        $('#axConfirmNewPassword').val(''),
        displayMessage([]);

        $('#axChangeAccountDialog').axDialog('show');
    }


    $axshare.showVerifyAccountDialog = function (email, target, success) {
        $('#axVerifyAccountDialog #axEmail').text(email);

        accountServiceSubmit({
            url: '/user/requestVerification',
            data: {
                email: email,
                target: target
            },
            success: function (response) {
                if (response.success) $('#axVerifyAccountDialog').axDialog('show');
                success(response);
            }
        });
    }

    $axshare.logout = function (success) {
        accountServiceSubmit({
            url: '/user/logout',
            data: {},
            success: success
        });
    };

    $axshare.addAccountControl = function (email, container, eventHandler) {
        container.load(ACCOUNT_SERVICE_SECURE_URL + "/Content/account/AccountControl.html", function () {
            $axshare.updateAccountControl(email);
            $('#axUserEmailLink').click(function () {
                $axshare.showUpdateAccountDialog($("#axUserEmail").text());
            });
            $('#axLogout').click(function () {
                $axshare.logout(function () {
                    if (eventHandler) eventHandler($axshare.axAccountActions.logout);
                    else location.reload();
                });
            });

            if (eventHandler) eventHandler($axshare.axAccountActions.loaded);
        });
    };

    $axshare.updateAccountControl = function (email) {
        $("#axUserEmail").text(email);
    };


    $axshare.updateUserProfileName = function(name, success) {
        var error = [];

        var newName = name.trim();

        accountServiceSubmit({
            url: '/user/UpdateUserProfileName',
            data: {
                name: newName
            },
            success: success
        });

        return error;
    };

    $axshare.updateUserProfileBio = function(bio, success) {
        var error = [];

        var newBio = bio.trim();

        accountServiceSubmit({
            url: '/user/UpdateUserProfileBio',
            data: {
                bio: newBio
            },
            success: success
        });

        return error;
    };

    $axshare.updateUserProfileImg = function(img, success, fail) {
        var error = [];

        var formData = new FormData();
        formData.append("isAjax", true);
        formData.append("fileToUpload", img);

        $.ajax({
            type: "POST",
            dataType: "json",
            cache: false,
            contentType: false,
            processData: false,
            crossDomain: true,
            xhrFields: {
                withCredentials: true
            },
            url: window.ACCOUNT_SERVICE_SECURE_URL + '/user/UploadUserProfileImg',
            data: formData,
            success: success
        }).fail(fail);

        return error;
    };

    $axshare.deleteUserProfileImg = function(success) {
        var error = [];

        accountServiceSubmit({
            url: '/user/DeleteUserProfileImg',
            data: {},
            success: success
        });

        return error;
    };
})();
