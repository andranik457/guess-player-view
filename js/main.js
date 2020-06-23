/**
 *
 */

let currentQuestionId = '';
let pastQuestions = [];
let possibleHints = 0;
let currentShape = null;

$('#question-image').hide();
$('#question-answer').hide();
$('#answer-suggestions').hide();
$('#answer-result').hide();
$('#check-answer').hide();

$( document ).ready(async function() {
    // showLevels();

    startGame();
});

/**
 *
 * @param currentLevel
 * @returns {Promise<void>}
 */
async function appendQuestion(currentLevel) {
    let question = await getQuestion(currentLevel);

    if (Object.keys(question).length === 0 && question.constructor === Object) {
        $('#question-image')
            .empty()
            .append('<h2 style="color: green; text-align: center">Congrats!!!</h2><h3 style="color: green; text-align: center">We are working to create new levels. Come back soon:)</h3>');

        $('#question-header').hide();
        $('#question-answer').hide();
        $('#answer-result').hide();
    }
    else {
        currentQuestionId = ''+ question.questionId;
        possibleHints = question.possibleHintsCount;
        currentShape = question.shape;

        $('#question-image')
            .empty()
            .append('<img class="col-sm-12 img-rounded" src="'+ question.questionImageUrl +'"/>');

        $('#question-answer')
            .empty()
            .append('<input type="text" class="form-control" id="answer-input" autocomplete="off">');

        if (possibleHints > 0) {
            $('#question-header')
                .empty()
                .append('<button type="button" class="btn btn-info" onClick="appendEasyHintData()">Hint</button>');
        }

        $('#question-image').show();
        $('#question-answer').show();
        $('#answer-result').hide();
    }


    // catch answer-input area change event
    $("#answer-input").on("change paste keyup", function() {
        let answer = $(this).val();

        appendSuggest(answer);

        $('#answer-suggestions').show();
    });

}

async function appendEasyHintData() {
    const easyImage = await hintEasyImage();

    possibleHints = easyImage.possibleHintsCount;

    $('#question-image')
        .empty()
        .append('<img class="col-sm-12 img-rounded" src="'+ easyImage.imageUrl +'"/>');

    if (possibleHints === 0) {
        $('#question-header').empty();
    }

}

$("#check-answer").on("click", '#submit-answer', async function() {
    let answer = $('#answer-input').val();

    let questionInfo = await questionAnswer(currentQuestionId, answer);

    let answerResult = '';
    if (questionInfo.answer) {
        answerResult = '<div class="row" id="correct-answer">' +
                '<div class="col-3 col-sm-3"><button type="button" class="btn btn-info" id="give-up">Home</button></div>' +
                '<div class="col-6 col-sm-6"><h3 style="color:green; text-align: center;">Congrats!</h3></div>' +
                '<div class="col-3 col-sm-3"><button type="button" class="btn btn-success float-right" id="next-level">Next Level</button></div>' +
            '</div>';

        $('#question-image').find('img').attr('src', questionInfo.result.imageUrl);

    }
    else {
        answerResult = '<div class="row" id="correct-answer">' +
            '<div class="col-3 col-sm-3"><button type="button" class="btn btn-info" id="give-up">Home</button></div>' +
            '<div class="col-6 col-sm-6"><h3 style="color:red; text-align: center;">Incorrect answer!</h3></div>' +
            '<div class="col-3 col-sm-3"><button type="button" class="btn btn-success float-right" id="tray-again">Tray again</button></div>' +
            '</div>';
    }

    $('#answer-result')
        .empty()
        .append(answerResult)
        .show();

    $('#question-answer')
        // .empty()
        .hide();
    $('#answer-suggestions')
        .empty()
        .hide();
    $('#check-answer')
        .empty()
        .hide();

});

$("#answer-suggestions").mouseover(function() {
    $('#answer-input').blur();
});
$("#answer-suggestions").mouseout(function() {
    $('#answer-input').focus();
});

/**
 *
 * @param answer
 * @returns {Promise<void>}
 */
async function appendSuggest(answer) {
    let possibleAnswers = await getPossibleAnswers(answer);

    let answerSuggestions = '';
    for (let i in possibleAnswers) {
        answerSuggestions += '<div class="col-md-12 form-control answer-suggestion">';
        answerSuggestions += '<span onClick="appendAnswer(this)">'+ possibleAnswers[i] +'</span>';
        answerSuggestions += '</div>';
    }

    $('#answer-suggestions')
        .empty()
        .append(answerSuggestions);
}

async function getPossibleAnswers(answer) {
    let possibleAnswers = [];

    let url = "http://local-guess-player.com/backend/search/suggest?q="+ answer;

    $.ajax({
        url: url,
        global: false,
        type: 'GET',
        // data: {},
        async: false, //blocks window close
        success: function (data) {
            for (let i in data.result.items) {
                possibleAnswers.push(data.result.items[i])
            }
        }
    });

    return possibleAnswers;
}

function appendAnswer(_this) {
    let answer = $(_this).text();

    $('#answer-input').val(answer);

    $('#answer-suggestions')
        .empty()
        .hide();

    $('#check-answer')
        .empty()
        .append('<button type="button" class="btn btn-info" id="submit-answer">Check Answer</button>')
        .show();
}

/**
 *
 * @param questionId
 * @param possibleAnswer
 * @returns {Promise<{result: {}, answer: boolean}>}
 */
async function questionAnswer(questionId, possibleAnswer) {
    let answer = false;
    let result = {};

    let url = "http://local-guess-player.com/backend/check/answer";

    $.ajax({
        url: url,
        global: false,
        type: 'POST',
        data: {
            questionId: questionId,
            answer: possibleAnswer
        },
        async: false, //blocks window close
        success: function (data) {
            result = data.result;

            if (undefined !== result.imageUrl) {
                answer = true;
            }
            else {
                answer = false;
            }
        }
    });

    return {
        result: result,
        answer: answer
    };
}

/**
 *
 * @param level
 * @returns {Promise<{}>}
 */
async function getQuestion(level) {
    let question = {};

    level = 1;
    let url = "http://local-guess-player.com/backend/question/"+ level;

    $.ajax({
        url: url,
        global: false,
        type: 'POST',
        data: {
            pastQuestions: JSON.stringify(pastQuestions)
        },
        async: false,
        success: function (data) {
            question = data.result;
        }
    });

    return question;
}

/**
 *
 * @returns {Promise<*>}
 */
async function hintEasyImage() {
    let url = "http://local-guess-player.com/backend/hint/easy-image/"+ currentQuestionId +"/"+ currentShape +"/"+ possibleHints;

    let hintData = null;

    $.ajax({
        url: url,
        global: false,
        type: 'GET',
        data: null,
        async: false,
        success: function (data) {
            hintData = data.result;
        }
    });

    return hintData;
}
