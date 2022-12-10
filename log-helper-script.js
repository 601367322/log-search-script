// ==UserScript==
// @name         local-log-helper
// @namespace    https://github.com/601367322/log-search-script/blob/main/log-helper-script.js
// @version      0.0.1
// @description
// @author       Sen
// @match        http://monitor.yy.isd.com/trtc/monitor/*
// @match        https://txtools-china.woa.com/trtc/trtc/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @require http://ajax.aspnetcdn.com/ajax/jQuery/jquery-1.8.0.js
// ==/UserScript==

(async function () {
    "use strict";
    console.log(location.href)
    var script = document.createElement("script");
    script.type = "text/javascript";

    script.text = start;
    document.head.appendChild(script);
    setTimeout(() => {
        //1秒后执行脚本，因为有元素是异步加载的，如果立即执行就获取不到。如果网速差，时间还需要设置更长。
        start();
    }, 1000)
})();

async function start() {
    await loadJS("https://ajax.aspnetcdn.com/ajax/jQuery/jquery-1.8.0.js");
    if (location.href.indexOf('txtools-china.woa.com') > -1) {
        var inputs = $('input');
        inputs[0].value = GM_getValue('sdkAppId')
        inputs[1].value = GM_getValue('userId')
        var time = GM_getValue('time')
        // inputs[4].value = time.split('～')[0]
        // inputs[5].value = time.split('～')[1]

        inputs[0].dispatchEvent(new Event('input'));
        inputs[1].dispatchEvent(new Event('input'));
        // inputs[4].dispatchEvent(new Event('input'));
        // inputs[5].dispatchEvent(new Event('input'));
        console.log($('.trtc-log-overseas'))
        console.log($('.trtc-log-overseas').find('button')[0])
        $('.trtc-log-overseas').find('button')[0].click();
    } else {
        var uesrContainer = $(".call-details-user-container")[0]
        var headerSend = uesrContainer.getElementsByClassName("header-send")[0]
        var headerReceive = uesrContainer.getElementsByClassName("header-receive")[0]
        var btnSend = document.createElement("div")
        btnSend.style = 'min-width:auto'
        btnSend.setAttribute("class", "tea-btn tea-btn--weak");
        btnSend.innerHTML = "本地日志"
        btnSend.onclick = () => {
            requestLocalLog(headerSend.getElementsByTagName('span')[0].getAttribute('title'))
        }
        headerSend.appendChild(btnSend);

        if (headerReceive) {
            var btnReceive = document.createElement("div")
            btnReceive.style = 'min-width:auto'
            btnReceive.setAttribute("class", "tea-btn tea-btn--weak");
            btnReceive.innerHTML = "本地日志"
            btnReceive.onclick = () => {
                requestLocalLog(headerReceive.getElementsByTagName('span')[0].getAttribute('title'))
            }
            headerReceive.appendChild(btnReceive);
        }

        function requestLocalLog(userId) {
            var sdkAppId = $('.tea-text-overflow')[6].getAttribute('title')
            var time = $('.tea-text-overflow')[8].getAttribute('title')
            console.log(userId + "\t" + sdkAppId)
            GM_setValue('userId', userId);
            GM_setValue('sdkAppId', sdkAppId);
            GM_setValue('time', time);

            window.open('https://txtools-china.woa.com/trtc/trtc/trtc-log-inland');
        }
    }
    function loadJS(url) {
        return new Promise((resolve) => {
            var script = document.createElement("script"),
                fn = resolve || function () {
                };
            script.type = "text/javascript";
            if (script.readyState) {
                script.onreadystatechange = function () {
                    if (script.readyState == "loaded" || script.readyState == "complete") {
                        script.onreadystatechange = null;

                        fn();
                    }
                };
            } else {
                //其他浏览器
                script.onload = function () {
                    fn();
                };
            }

            script.src = url;

            document.getElementsByTagName("head")[0].appendChild(script);
        });
    }
}

window.start = start;
