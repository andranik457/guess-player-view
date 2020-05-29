
let levelMax = 150;
let selectedLevel = 0;

/**
 *
 */
$("#levels").on("click", '.item', async function() {
    enableLoader();

    $('#levels').empty();

    let _this = this;

    selectedLevel = parseInt($(_this).find('span').text());

    appendQuestion(selectedLevel);

    disableLoader();
});

/**
 *
 */
function showLevels() {
    let levelsData = '<div class="col-md-6"><div class="row">';
    for (let i = 1; i <= levelMax; i++) {
        levelsData += '<div class="col-sm-2 item"><span>'+ i +'</span></div>'
    }
    levelsData += '</div></div>';

    $('#levels')
        .empty()
        .append(levelsData);
}

