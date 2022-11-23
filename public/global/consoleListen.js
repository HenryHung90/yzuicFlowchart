let logger = window.top.document.getElementById('testingCode');

console.log = function (message) {
    logger.innerHTML += '<div class="consoleErrorArea_logCode">' + message + '</div>';
}
console.trace = function (message) {
    if (typeof message == 'object') {
        logger.innerHTML += '<div class="consoleErrorArea_errorCode">' + (JSON && JSON.stringify ? JSON.stringify(message) : message) + '<div>';
    } else {
        logger.innerHTML += message + '<br />';
    }
}
console.error = function (message) {
    logger.innerHTML += '<div class="consoleErrorArea_errorCode">' + message + '</div>';
}
console.warn = function (message) {
    if (typeof message == 'object') {
        logger.innerHTML += (JSON && JSON.stringify ? JSON.stringify(message) : message) + '<br />';
    } else {
        logger.innerHTML += message + '<br />';
    }
}
console.assert = function (message) {
    if (typeof message == 'object') {
        logger.innerHTML += (JSON && JSON.stringify ? JSON.stringify(message) : message) + '<br />';
    } else {
        logger.innerHTML += message + '<br />';
    }
}
var TypeError = function(message){
    console.error(message.stack)   
}