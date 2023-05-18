console.log( "window loaded" );

$( document ).ready(function() {







    function showAlert(text){
        $('#alert_simple').empty().append(text).css("visibility", "visible").show().delay(2000).fadeOut(3000);
    }
    function showAlertLong(text){
        $('#alert_simple').empty().append(text).css("visibility", "visible").show().delay(8000).fadeOut(3000);
    }



    function showError(){
        var error_text = "";
        var userLang = window.navigator.language;
        var lang = userLang.split("-")[0];

        if (main_data === "") {
            switch (lang){
                case 'ru':
                    error_text = " Если Вы видете это окно, то видимо возникли какие-то трудности :(\n" +
                        "        <br><br>Попробуйте следующие шаги в такой последовательности:\n" +
                        "        <br>1. Проверьте подключение к интернету\n" +
                        "        <br>2. Если интернет работает, но вы все ещё видите это - очистите кэш и файлы cookies браузера (или переустановите его)\n" +
                        "        <br>3. Если п1,2. не сработали - пишите @aashesh(Telegram)<br>. К сообщению сразу прикрепляйте свою почту\n";

                    break;
                case 'en':
                    error_text = "If you see this window, apparently you've experienced some difficulty.\n" +
                        "         <br> <br> Try the following steps in this sequence:\n" +
                        "         <br> 1. Check your internet connection.\n" +
                        "         <br> 2. If internet works, but you still see it, clear the browser cache and cookies (or reinstall it).\n" +
                        "         <br> 3. If step 1 and 2 didn't work, write @aashesh (Telegram) or +38 097 314 3889 (Viber, WhatsApp). Attach your email to the message.";
                    break;

                default:
                    error_text = "If you see this window, apparently you've experienced some difficulty.\n" +
                        "         <br> <br> Try the following steps in this sequence:\n" +
                        "         <br> 1. Check your internet connection.\n" +
                        "         <br> 2. If internet works, but you still see it, clear the browser cache and cookies (or reinstall it).\n" +
                        "         <br> 3. If step 1 and 2 didn't work, write @aashesh (Telegram) or +38 097 314 3889 (Viber, WhatsApp). Attach your email to the message.";

                    break;
            }

            $('#div_error').empty().append(error_text).show();

        }

    }

    function parse_query_string() {
        var hashParams = {};
        var e,
            a = /\+/g,  // Regex for replacing addition symbol with a space
            r = /([^&;=]+)=?([^&;]*)/g,
            d = function (s) { return decodeURIComponent(s.replace(a, " ")); },
            q = window.location.hash.substring(1);

        while (e = r.exec(q))
            hashParams[d(e[1])] = d(e[2]);

        return hashParams;

        // if((navigator.userAgent.indexOf("MSIE") != -1 ) || (!!document.documentMode == true )){
//
        //     var key = false, res = {}, itm = null;
        //     // get the query string without the ?
        //     var qs = location.search.substring(1);
        //     // check for the key as an argument
        //     if (arguments.length > 0 && arguments[0].length > 1)
        //         key = arguments[0];
        //     // make a regex pattern to grab key/value
        //     var pattern = /([^&=]+)=([^&]*)/g;
        //     // loop the items in the query string, either
        //     // find a match to the argument, or build an object
        //     // with key/value pairs
        //     while (itm = pattern.exec(qs)) {
        //         if (key !== false && decodeURIComponent(itm[1]) === key)
        //             return decodeURIComponent(itm[2]);
        //         else if (key === false)
        //             res[decodeURIComponent(itm[1])] = decodeURIComponent(itm[2]);
        //     }
//
        //     return key === false ? res : null;
        // } else {
//
        //     var url_string = window.location.href; //window.location.href
        //     var url = new URL(url_string);
        //     var query = url.hash.replace('#', '');
        //     var vars = query.split("&");
        //     var query_string = {};
        //     for (var i = 0; i < vars.length; i++) {
        //         var pair = vars[i].split("=");
        //         var key = decodeURIComponent(pair[0]);
        //         var value = decodeURIComponent(pair[1]);
        //         // If first entry with this name
        //         if (typeof query_string[key] === "undefined") {
        //             query_string[key] = decodeURIComponent(value);
        //             // If second entry with this name
        //         } else if (typeof query_string[key] === "string") {
        //             var arr = [query_string[key], decodeURIComponent(value)];
        //             query_string[key] = arr;
        //             // If third or later entry with this name
        //         } else {
        //             query_string[key].push(decodeURIComponent(value));
        //         }
        //     }
        //     return query_string;
        // }


    }



    function shuffle(a) {
        for (let i = a.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [a[i], a[j]] = [a[j], a[i]];
        }
        return a;
    }



    function checkOS() {
        var userAgent = window.navigator.userAgent,
            platform = window.navigator.platform,
            macosPlatforms = ['Macintosh', 'MacIntel', 'MacPPC', 'Mac68K'],
            windowsPlatforms = ['Win32', 'Win64', 'Windows', 'WinCE'],
            iosPlatforms = ['iPhone', 'iPad', 'iPod'],
            os = null;

        if (macosPlatforms.indexOf(platform) !== -1) {
            os = 'Mac OS';
            showAlert('На технике Apple пока работает не весь функционал');
        } else if (iosPlatforms.indexOf(platform) !== -1) {
            os = 'iOS';
            showAlert('На технике Apple пока работает не весь функционал');
        } else if (windowsPlatforms.indexOf(platform) !== -1) {
            os = 'Windows';
        } else if (/Android/.test(userAgent)) {
            os = 'Android';
        } else if (!os && /Linux/.test(platform)) {
            os = 'Linux';
        }

        return os;
    }

    function setCookie(name, value, days = 1600) {
        var expires = "";
        if (days) {
            var date = new Date();
            date.setTime(date.getTime() + (days*24*60*60*1000));
            expires = "; expires=" + date.toUTCString();
        }
        document.cookie = name + "=" + (value || "")  + expires + "; path=/";
    }
    function getCookie(name) {
        var matches = document.cookie.match(new RegExp(
            "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
        ));
        return matches ? decodeURIComponent(matches[1]) : undefined;
    }

    function deleteCookie( name ) {
        document.cookie = name + '=undefined; expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/';
    }
    //window.addEventListener("hashchange", function(e) {
    //    if(e.oldURL.length > e.newURL.length)
    //        $('#logo').click();
    //});



    $.ajaxSetup({
        error: function (data, textStatus, jqXHR) {
            console.log("ajaxSetup");
            console.log(data);

            if (data.status == 401) {
                console.log("Error 401");
                $('#page_login').show();
                $('.wrapper_top_bar').hide();
                $("#page_user_main") .hide();
                $('#page_admin_main').hide();
                //  console.log(data.responseText.includes("Incorrect credentials"));

                if (data.responseText.includes("Incorrect credentials")) {
                    showAlert(alert_error_login);
                }
                if (data.responseText.includes("Bad Token")) {
                    cookie_token = getCookie(cookie_name_token);
                }
            }

            if (data.status == 500) {
                console.log("Error 500 ");
            }
        }
    });
    if (!navigator.cookieEnabled) {
        showAlert(alert_enable_cookies);
    }

    function copyToClipboard(text) {
        if (window.clipboardData && window.clipboardData.setData) {
            // IE specific code path to prevent textarea being shown while dialog is visible.
            return clipboardData.setData("Text", text);

        } else if (document.queryCommandSupported && document.queryCommandSupported("copy")) {
            var textarea = document.createElement("textarea");
            textarea.textContent = text;
            textarea.style.position = "fixed";  // Prevent scrolling to bottom of page in MS Edge.
            document.body.appendChild(textarea);
            textarea.select();
            try {
                return document.execCommand("copy");  // Security exception may be thrown by some browsers.
            } catch (ex) {
                console.warn("Copy to clipboard failed.", ex);
                return false;
            } finally {
                document.body.removeChild(textarea);
            }
        }
    }


    function getOS() {
        var userAgent = window.navigator.userAgent,
            platform = window.navigator.platform,
            macosPlatforms = ['Macintosh', 'MacIntel', 'MacPPC', 'Mac68K'],
            windowsPlatforms = ['Win32', 'Win64', 'Windows', 'WinCE'],
            iosPlatforms = ['iPhone', 'iPad', 'iPod'],
            os = null;

        if (macosPlatforms.indexOf(platform) !== -1) {
            os = 'Mac OS';
        } else if (iosPlatforms.indexOf(platform) !== -1) {
            os = 'iOS';
        } else if (windowsPlatforms.indexOf(platform) !== -1) {
            os = 'Windows';
        } else if (/Android/.test(userAgent)) {
            os = 'Android';
        } else if (!os && /Linux/.test(platform)) {
            os = 'Linux';
        }

        return os;
    }

});
