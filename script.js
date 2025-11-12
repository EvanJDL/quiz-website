// Quiz questions data
const quizQuestions = [
    {
        question: "What is the capital of France?",
        answers: ["London", "Berlin", "Paris", "Madrid"],
        correct: 2,
        explanation: "Paris is the capital and largest city of France. It has been the capital since 987 AD and is one of the world's major cultural and commercial centers."
    },
    {
        question: "Which planet is known as the Red Planet?",
        answers: ["Venus", "Mars", "Jupiter", "Saturn"],
        correct: 1,
        explanation: "Mars is called the Red Planet because of the iron oxide (rust) on its surface, which gives it a reddish appearance. It's the fourth planet from the Sun."
    },
    {
        question: "What is 2 + 2?",
        answers: ["3", "4", "5", "6"],
        correct: 1,
        explanation: "The sum of 2 and 2 equals 4. This is basic arithmetic addition."
    },
    {
        question: "Which programming language is known as the 'language of the web'?",
        answers: ["Python", "Java", "JavaScript", "C++"],
        correct: 2,
        explanation: "JavaScript is the primary programming language of the web. It runs in web browsers and enables interactive web pages. It's supported by all modern browsers."
    },
    {
        question: "What is the largest ocean on Earth?",
        answers: ["Atlantic Ocean", "Indian Ocean", "Arctic Ocean", "Pacific Ocean"],
        correct: 3,
        explanation: "The Pacific Ocean is the largest and deepest ocean on Earth, covering approximately 63 million square miles (165 million square kilometers) and containing more than half of the world's free water."
    }
];

// Quiz state
let currentQuestionIndex = 0;
let score = 0;
let userAnswers = [];
let answerSelected = false;
let nextQuestionTimeout = null;
let randomizedQuestions = [];

// DOM elements
const questionText = document.getElementById('questionText');
const answersContainer = document.getElementById('answersContainer');
const questionCounter = document.getElementById('questionCounter');
const progressBar = document.getElementById('progressBar');
const feedback = document.getElementById('feedback');
const questionContainer = document.getElementById('questionContainer');
const resultContainer = document.getElementById('resultContainer');
const scoreValue = document.getElementById('scoreValue');
const scorePercentage = document.getElementById('scorePercentage');
const restartBtn = document.getElementById('restartBtn');

// Initialize quiz
function initQuiz() {
    // Randomize questions and answers each time quiz starts
    randomizeQuestions();
    
    currentQuestionIndex = 0;
    score = 0;
    userAnswers = [];
    answerSelected = false;
    if (nextQuestionTimeout) {
        clearTimeout(nextQuestionTimeout);
        nextQuestionTimeout = null;
    }
    resultContainer.style.display = 'none';
    questionContainer.style.display = 'block';
    loadQuestion();
}

// Shuffle array using Fisher-Yates algorithm
function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

// Randomize questions and their answer options
function randomizeQuestions() {
    // Shuffle the order of questions
    const shuffledQuestions = shuffleArray(quizQuestions);
    
    // For each question, shuffle the answers and update the correct index
    randomizedQuestions = shuffledQuestions.map(question => {
        // Get the correct answer text
        const correctAnswer = question.answers[question.correct];
        
        // Shuffle the answers array
        const shuffledAnswers = shuffleArray(question.answers);
        
        // Find the new index of the correct answer
        const newCorrectIndex = shuffledAnswers.indexOf(correctAnswer);
        
        // Return the question with shuffled answers and updated correct index
        return {
            question: question.question,
            answers: shuffledAnswers,
            correct: newCorrectIndex,
            explanation: question.explanation
        };
    });
}

// Update progress bar with smooth animation
function updateProgressBar() {
    const progress = ((currentQuestionIndex + 1) / randomizedQuestions.length) * 100;
    // Use requestAnimationFrame for smoother animation
    requestAnimationFrame(() => {
        progressBar.style.width = `${progress}%`;
    });
}

// Load current question
function loadQuestion() {
    const question = randomizedQuestions[currentQuestionIndex];
    
    // Reset answer selected state
    answerSelected = false;
    
    // Update question text
    questionText.textContent = question.question;
    
    // Update question counter
    questionCounter.textContent = `Question ${currentQuestionIndex + 1} of ${randomizedQuestions.length}`;
    
    // Update progress bar
    updateProgressBar();
    
    // Clear previous answers
    answersContainer.innerHTML = '';
    
    // Hide feedback and explanation
    feedback.style.display = 'none';
    const explanationElement = document.getElementById('explanation');
    if (explanationElement) {
        explanationElement.style.display = 'none';
    }
    
    // Create answer buttons
    question.answers.forEach((answer, index) => {
        const button = document.createElement('button');
        button.className = 'answer-btn';
        button.textContent = `${index + 1}. ${answer}`;
        button.addEventListener('click', () => selectAnswer(index));
        answersContainer.appendChild(button);
    });
}

// Handle answer selection
function selectAnswer(selectedIndex) {
    // Prevent multiple selections
    if (answerSelected) return;
    
    answerSelected = true;
    const question = randomizedQuestions[currentQuestionIndex];
    const buttons = answersContainer.querySelectorAll('.answer-btn');
    
    // Disable all buttons
    buttons.forEach(btn => btn.disabled = true);
    
    // Check if answer is correct
    const isCorrect = selectedIndex === question.correct;
    
    // Store user answer
    userAnswers.push({
        questionIndex: currentQuestionIndex,
        selectedIndex: selectedIndex,
        isCorrect: isCorrect
    });
    
    // Update score
    if (isCorrect) {
        score++;
    }
    
    // Update progress bar immediately after answer selection (for next question)
    const nextProgress = Math.min(((currentQuestionIndex + 2) / randomizedQuestions.length) * 100, 100);
    requestAnimationFrame(() => {
        progressBar.style.width = `${nextProgress}%`;
    });
    
    // Show visual feedback on buttons
    buttons[question.correct].classList.add('correct');
    if (!isCorrect) {
        buttons[selectedIndex].classList.add('incorrect');
    }
    
    // Show feedback message
    showFeedback(isCorrect);
    
    // Move to next question after delay
    nextQuestionTimeout = setTimeout(() => {
        moveToNextQuestion();
    }, 2000);
}

// Move to next question
function moveToNextQuestion() {
    currentQuestionIndex++;
    if (currentQuestionIndex < randomizedQuestions.length) {
        loadQuestion();
    } else {
        showResults();
    }
}

// Show feedback message
function showFeedback(isCorrect) {
    const question = randomizedQuestions[currentQuestionIndex];
    
    feedback.style.display = 'block';
    feedback.textContent = isCorrect ? '✓ Correct!' : '✗ Incorrect!';
    feedback.className = `feedback ${isCorrect ? 'correct' : 'incorrect'}`;
    
    // Show explanation
    const explanationElement = document.getElementById('explanation');
    if (explanationElement && question.explanation) {
        explanationElement.style.display = 'block';
        explanationElement.textContent = question.explanation;
    }
}

// Show final results
function showResults() {
    questionContainer.style.display = 'none';
    resultContainer.style.display = 'block';
    
    const percentage = Math.round((score / randomizedQuestions.length) * 100);
    scoreValue.textContent = `${score} / ${randomizedQuestions.length}`;
    scorePercentage.textContent = `${percentage}%`;
    
    // Animate progress bar to 100% with a smooth transition
    requestAnimationFrame(() => {
        progressBar.style.width = '100%';
    });
}

// Handle keyboard input
function handleKeyboardInput(event) {
    // Check if we're on the results screen
    if (resultContainer.style.display === 'block') {
        if (event.key === 'Enter') {
            initQuiz();
        }
        return;
    }
    
    // If answer is selected and Enter is pressed, skip delay and move to next
    if (answerSelected && event.key === 'Enter') {
        if (nextQuestionTimeout) {
            clearTimeout(nextQuestionTimeout);
            nextQuestionTimeout = null;
        }
        moveToNextQuestion();
        return;
    }
    
    // If answer not selected yet, handle number keys 1-4
    if (!answerSelected) {
        const key = event.key;
        if (key >= '1' && key <= '4') {
            const answerIndex = parseInt(key) - 1;
            const question = randomizedQuestions[currentQuestionIndex];
            // Only select if the index is valid for current question
            if (answerIndex < question.answers.length) {
                selectAnswer(answerIndex);
            }
        }
    }
}

// Add keyboard event listener
document.addEventListener('keydown', handleKeyboardInput);

// Restart quiz
restartBtn.addEventListener('click', initQuiz);

// Start the quiz when page loads
initQuiz();

