
$("#name").on("change paste keyup", function() {
    let answer = $(this).val();
    console.log(answer);

    appendResult(answer)
});

async function appendResult(answer) {
    let possibleAnswers = await getPossibleAnswers(answer);

    let answerSuggestions = '';
    for (let i in possibleAnswers) {
        answerSuggestions = '<div class="col-md-12 form-control answer-suggestion">';
        answerSuggestions += '<span>blah blah - '+ possibleAnswers[i] +'</span>';
        answerSuggestions += '</div>';
    }

    $('#answer-suggestions').append(answerSuggestions);
}

async function getPossibleAnswers(answer) {
    let possibleAnswers = [];



    return possibleAnswers;
}