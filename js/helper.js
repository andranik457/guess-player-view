
/**
 *
 * @param max
 * @returns {number}
 */
function getRandomInt(max) {
    return (Math.floor(Math.random() * Math.floor(max)) + 1);
}

function enableLoader() {
    $('body').append('<div id="loader"><img src="../img/loader.gif"></div>');
}

function disableLoader() {
    $('#loader').remove();
}