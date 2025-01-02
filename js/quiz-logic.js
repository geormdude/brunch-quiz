let currentQuestion = 0;
let answers = {};

function renderQuestion(index) {
    const question = QUESTIONS[index];
    const container = document.getElementById('quiz-container');
    
    let html = `
        <div class="mb-6">
            <h2 class="text-xl font-semibold mb-4">${question.title}</h2>
    `;

    if (question.type === 'radio') {
        html += question.options.map(option => `
            <div class="mb-2">
                <input type="radio" 
                       id="${option.value}" 
                       name="${question.id}" 
                       value="${option.value}"
                       ${answers[question.id] === option.value ? 'checked' : ''}>
                <label for="${option.value}" class="ml-2">${option.label}</label>
            </div>
        `).join('');
    } else if (question.type === 'checkbox') {
        html += question.options.map(option => `
            <div class="mb-2">
                <input type="checkbox" 
                       id="${option.value}" 
                       name="${question.id}" 
                       value="${option.value}"
                       ${(answers[question.id] || []).includes(option.value) ? 'checked' : ''}>
                <label for="${option.value}" class="ml-2">${option.label}</label>
            </div>
        `).join('');
    }

    html += '</div>';
    container.innerHTML = html;
    updateProgress();
}

function updateProgress() {
    const progress = ((currentQuestion + 1) / QUESTIONS.length) * 100;
    document.getElementById('progress-bar').style.width = `${progress}%`;
}

// Event Listeners
document.getElementById('next-btn').addEventListener('click', () => {
    const currentQ = QUESTIONS[currentQuestion];
    
    if (currentQ.type === 'radio') {
        const selected = document.querySelector(`input[name="${currentQ.id}"]:checked`);
        
        if (currentQ.validation?.required && !selected) {
            alert('Please answer the question before proceeding.');
            return;
        }

        if (selected) {
            answers[currentQ.id] = selected.value;
        }
    } else if (currentQ.type === 'checkbox') {
        const selected = Array.from(document.querySelectorAll(`input[name="${currentQ.id}"]:checked`))
            .map(input => input.value);
        answers[currentQ.id] = selected;
    }

    if (currentQuestion < QUESTIONS.length - 1) {
        currentQuestion++;
        renderQuestion(currentQuestion);
        document.getElementById('prev-btn').classList.remove('hidden');
    } else {
        showResults();
    }
});

document.getElementById('prev-btn').addEventListener('click', () => {
    if (currentQuestion > 0) {
        currentQuestion--;
        renderQuestion(currentQuestion);
        if (currentQuestion === 0) {
            document.getElementById('prev-btn').classList.add('hidden');
        }
    }
});

// Initialize the quiz
renderQuestion(0);

function calculateScore(answers) {
    // Early exit if it's a dinner/late meal
    if (answers.initialFilter === 'yes') {
        return {
            total: 0,
            breakdown: {
                time: 0,
                food: 0,
                drinks: 0,
                weekend: 0,
                social: 0,
                duration: 0
            },
            message: "That's dinner! Not brunch."
        };
    }

    let breakdown = {
        time: 0,
        food: 0,
        drinks: 0,
        weekend: 0,
        social: 0,
        duration: 0
    };

    // Time scoring (max 30)
    breakdown.time = SCORING_WEIGHTS.TIME_OF_DAY[answers.timeOfDay] || 0;

    // Weekend scoring (max 10)
    breakdown.weekend = SCORING_WEIGHTS.WEEKEND[answers.isWeekend] || 0;

    // Food scoring (max 30)
    const breakfastCount = (answers.breakfastItems || []).length;
    const lunchCount = (answers.lunchItems || []).length;
    
    if (breakfastCount > 0) breakdown.food += SCORING_WEIGHTS.FOOD_MIX.HAS_BREAKFAST;
    if (lunchCount > 0) breakdown.food += SCORING_WEIGHTS.FOOD_MIX.HAS_LUNCH;
    if (breakfastCount > 1) breakdown.food += SCORING_WEIGHTS.FOOD_MIX.MULTIPLE_BREAKFAST;
    if (lunchCount > 1) breakdown.food += SCORING_WEIGHTS.FOOD_MIX.MULTIPLE_LUNCH;

    // Drinks scoring (max 20)
    const hasMorningDrinks = (answers.morningDrinks || []).length > 0;
    const hasCelebratoryDrinks = (answers.celebratoryDrinks || []).length > 0;
    
    if (hasMorningDrinks) breakdown.drinks += SCORING_WEIGHTS.DRINKS.MORNING;
    if (hasCelebratoryDrinks) breakdown.drinks += SCORING_WEIGHTS.DRINKS.CELEBRATORY;
    if (answers.hasHydration === 'yes') breakdown.drinks += SCORING_WEIGHTS.DRINKS.HYDRATION;

    // Social scoring (max 5)
    const socialMap = { 'solo': 1, 'two': 2, 'small': 4, 'large': 5 };
    breakdown.social = Math.min(
        SCORING_WEIGHTS.SOCIAL.MAX,
        socialMap[answers.peopleCount] * SCORING_WEIGHTS.SOCIAL.PER_PERSON
    );

    // Duration scoring (max 5)
    breakdown.duration = SCORING_WEIGHTS.DURATION[answers.duration] || 0;

    const total = Object.values(breakdown).reduce((sum, value) => sum + value, 0);

    return {
        total,
        breakdown,
        message: getBrunchMessage(total)
    };
}

function getBrunchMessage(score) {
    if (score >= 90) return "That's peak brunch! 🥂";
    if (score >= 75) return "Definitely brunch! 🍳";
    if (score >= 60) return "Brunch-ish. We'll allow it. 👌";
    if (score >= 40) return "More like a late breakfast... 🤔";
    return "Not really brunch. Sorry! 🤷‍♀️";
}

function showResults() {
    const score = calculateScore(answers);
    const container = document.getElementById('quiz-container');
    const resultsHtml = `
        <div class="text-center">
            <h2 class="text-2xl font-bold mb-4">Your Brunch Score: ${score.total}/100</h2>
            <p class="text-xl mb-6">${score.message}</p>
            
            <div class="mb-6">
                <div class="w-full bg-gray-200 rounded-full h-4">
                    <div class="bg-blue-500 h-4 rounded-full transition-all duration-1000" 
                         style="width: ${score.total}%"></div>
                </div>
            </div>

            <div class="text-left">
                <h3 class="font-semibold mb-2">Score Breakdown:</h3>
                <ul class="space-y-2">
                    <li>⏰ Timing: ${score.breakdown.time}/30</li>
                    <li>🍽️ Food Mix: ${score.breakdown.food}/30</li>
                    <li>🥂 Drinks: ${score.breakdown.drinks}/20</li>
                    <li>📅 Weekend Factor: ${score.breakdown.weekend}/10</li>
                    <li>👥 Social: ${score.breakdown.social}/5</li>
                    <li>⌛ Duration: ${score.breakdown.duration}/5</li>
                </ul>
            </div>

            <button id="restart-btn" class="mt-6 px-4 py-2 bg-blue-500 text-white rounded">
                Try Again
            </button>
        </div>
    `;

    container.innerHTML = resultsHtml;
    document.getElementById('next-btn').style.display = 'none';
    document.getElementById('prev-btn').style.display = 'none';
    
    document.getElementById('restart-btn').addEventListener('click', () => {
        currentQuestion = 0;
        answers = {};
        renderQuestion(0);
        document.getElementById('next-btn').style.display = 'block';
        document.getElementById('prev-btn').classList.add('hidden');
    });
}
