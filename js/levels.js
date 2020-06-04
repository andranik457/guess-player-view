
let levelMax = 150;
let selectedLevel = 0;

$("#start-game").on("click", 'button', async function() {
    $('#start-game').empty();

    appendQuestion(selectedLevel);
});

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

$("#answer-result").on("click", '#give-up', async function() {
    $('#question-image').hide();
    $('#question-answer').hide();
    $('#answer-suggestions').hide();
    $('#answer-result').hide();
    $('#check-answer').hide();

    // showLevels();
    startGame();
});

$("#answer-result").on("click", '#tray-again', async function() {
    $('#answer-result').hide();
    $('#question-answer').show();
});

$("#answer-result").on("click", '#next-level', async function() {
    selectedLevel += 1;

    // get already answered question
    pastQuestions.push(currentQuestionId);

    appendQuestion(selectedLevel);
});

/**
 * Show Levels
 */
function showLevels() {
    let levelsData = '<div class="col-sm-12 col-md-12">';

    levelsData += '<div class="row"><div class="col-sm-12 col-md-12"><h3>Select Level</h3></div></div>';

    levelsData += '<div class="row">';


    let currentLevel = 9;

    for (let i = 1; i <= levelMax; i++) {
        if (i < currentLevel) {
            levelsData += '<div class="col-sm-2 col-md-2 item past-level"><span>'+ i +'</span></div>'
        }
        else if (i === currentLevel) {
            levelsData += '<div class="col-sm-2 col-md-2 item current-level"><span>'+ i +'</span></div>'
        }
        else {
            levelsData += '<div class="col-sm-2 col-md-2 item locked-level"><span>Locked</span></div>'
        }
    }
    levelsData += '</div></div>';

    $('#levels')
        .empty()
        .append(levelsData);
}


$("#levels").on("mouseenter", ".locked-level", function() {
    $( this ).addClass("locked-level-hover");
});

$("#levels").on("mouseleave", ".locked-level", function() {
    $( this ).removeClass("locked-level-hover");
});

function startGame() {
    $("#start-game")
        .empty()
        .append('<div class="col-4 col-sm-4 col-md-2 offset-sm-4 offset-md-5"><button type="button" class="btn btn-light">Start Game</button></div>')
}