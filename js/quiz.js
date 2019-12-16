let correctAnswer,
    correctNumber = (localStorage.getItem('quiz_game_correct')? localStorage.getItem('quiz_game_correct') : 0),
    incorrectNumber = (localStorage.getItem('quiz_game_incorrect')? localStorage.getItem('quiz_game_incorrect') : 0)
document.addEventListener('DOMContentLoaded', function() {
    loadQuestion()
    eventListeners()
})

eventListeners = () => {
    document.querySelector('#check-answer').addEventListener('click', validateAnswer)
    document.getElementById('clear-storage').addEventListener('click', clearResults)
}

loadQuestion = () => {
    const url = 'https://opentdb.com/api.php?amount=1'
    fetch(url)
    .then(data => data.json())
    .then(result => displayQuestion(result.results))
}

displayQuestion = questions => {

     const questionHTML = document.createElement('div')
     questionHTML.classList.add('col-12')
     questions.forEach(question => {

        correctAnswer = question.correct_answer
        let possibleAnswers = question.incorrect_answers
         possibleAnswers.splice(Math.floor(Math.random()*3), 0, correctAnswer)

         questionHTML.innerHTML = `
         <div class="row justify-content-between headin">
         <p class="category"> Category: ${question.category}</p>
         <div class="totals">
         <span class="badge badge-success">${correctNumber}</span>
         <span class="badge badge-danger">${incorrectNumber}</span>
         </div>
         </div>
         <h2 class="text-center">${question.question}</h2>
         `
        
        const answerDiv = document.createElement('div')
        answerDiv.classList.add('questions', 'row', 'justify-content-around', 'mt-4')
         possibleAnswers.forEach(answer => {
            const answerHTML = document.createElement('li')
            answerHTML.classList.add('col-12', 'col-md-5')
            answerHTML.textContent = answer

            answerHTML.onclick = selectAnswer


            answerDiv.appendChild(answerHTML)
         })
         questionHTML.appendChild(answerDiv)

         document.querySelector('#app').appendChild(questionHTML)
     })
}

selectAnswer = (e) => {
    if(document.querySelector('.active')) {
        const activeAnswer = document.querySelector('.active')
        activeAnswer.classList.remove('active')
    }
    e.target.classList.add('active')
}

// Checks if the answer is correct and 1 answer is selected 
validateAnswer = () => {
    if(document.querySelector('.questions .active')) {
        
        checkAnswer()

    } else {
        const errorDiv = document.createElement('div')
        errorDiv.classList.add('alert', 'alert-danger', 'col-md-6')
        errorDiv.textContent = 'Please select one answer'
        const questionsDiv = document.querySelector('.questions')
        questionsDiv.appendChild(errorDiv)
        setTimeout(() => {
            document.querySelector('.alert-danger').remove()
        }, 3000);
    }
}

checkAnswer = () => {
    const userAnswer = document.querySelector('.questions .active')

    if(userAnswer.textContent === correctAnswer) {
        correctNumber++
    } else {
        incorrectNumber++
    }
    // Save into local storage
    saveIntoStorage()


    const app = document.querySelector('#app')
    while(app.firstChild) {
        app.removeChild(app.firstChild)
    }
    // load a new question
    loadQuestion()
}

saveIntoStorage = () => {
    localStorage.setItem('quiz_game_correct', correctNumber)
    localStorage.setItem('quiz_game_incorrect', incorrectNumber)

}

clearResults = () => {
    localStorage.setItem('quiz_game_correct', 0)
    localStorage.setItem('quiz_game_incorrect', 0)
    setTimeout(() => {
        window.location.reload()
    }, 500);
}