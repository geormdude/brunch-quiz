// Initialize variables
let currentQuestion = 0;
let answers = {};

// Add debugging logs
console.log('Quiz logic loaded');
console.log('QUESTIONS array available:', QUESTIONS);

// Initialize the quiz when the page loads
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing quiz');
    renderQuestion(0);
});

function renderQuestion(index) {
    console.log('Rendering question:', index);
    console.log('Question data:', QUESTIONS[index]);
    
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
    console.log('Generated HTML:', html);
    container.innerHTML = html;
    updateProgress();
}

function updateProgress() {
    const progress = ((currentQuestion + 1) / QUESTIONS.length) * 100;
    document.getElementById('progress-bar').style.width = `${progress}%`;
}

function calculateBrunchScore(answers) {
    let score = 0;
    let maxScore = 100;
    let feedback = '';

    // Initial filter - if it's dinner/late night, very low score
    if (answers.initialFilter === 'yes') {
        return {
            score: 5,
            feedback: "This is definitely not brunch. It's dinner or a late night meal! 🌙"
        };
    }

    // Time of day scoring (max 40 points)
    switch (answers.timeOfDay) {
        case 'before10':
            score += 10; // Too early for brunch
            feedback = "That's breakfast territory! 🌅";
            break;
        case 'early':
            score += 30; // Good brunch time
            feedback = "Perfect brunch timing! 🎯";
            break;
        case 'prime':
            score += 40; // Prime brunch time
            feedback = "Prime brunch hours! 🌟";
            break;
        case 'acceptable':
            score += 20; // Late but acceptable
            feedback = "A bit late, but still brunch-worthy! ⏰";
            break;
        case 'after3':
            score += 5; // Too late
            feedback = "That's getting into late lunch territory... 🌆";
            break;
    }

    // Weekend bonus (max 20 points)
    if (answers.isWeekend === 'yes') {
        score += 20;
        feedback += " Weekend brunch is a classic! 📅";
    }

    // Breakfast items scoring (max 40 points)
    const breakfastItems = answers.breakfastItems || [];
    const itemScore = Math.min(40, breakfastItems.length * 10);
    score += itemScore;
    
    if (breakfastItems.length > 0) {
        feedback += ` Great selection of breakfast items! 🍳`;
    }

    // Final score calculation
    score = Math.min(100, score);

    // Overall rating
    let rating;
    if (score >= 90) {
        rating = "Ultimate Brunch! 🎉";
    } else if (score >= 70) {
        rating = "Solid Brunch 👍";
    } else if (score >= 50) {
        rating = "Brunch-ish 🤔";
    } else if (score >= 30) {
        rating = "More like breakfast/lunch... 🥪";
    } else {
        rating = "Not really brunch 🚫";
    }

    return {
        score,
        rating,
        feedback
    };
}

function showResults() {
    const container = document.getElementById('quiz-container');
    const resultsContainer = document.getElementById('results-container');
    
    // Hide the quiz container and show results
    container.classList.add('hidden');
    resultsContainer.classList.remove('hidden');
    
    // Hide navigation buttons
    document.getElementById('next-btn').classList.add('hidden');
    document.getElementById('prev-btn').classList.add('hidden');
    
    // Calculate results
    const results = calculateBrunchScore(answers);
    
    // Generate results HTML
    let html = `
        <div class="text-center">
            <h2 class="text-2xl font-bold mb-4">Your Brunch Score: ${results.score}%</h2>
            <div class="w-full bg-gray-200 rounded-full h-4 mb-4">
                <div class="bg-blue-500 h-4 rounded-full transition-all duration-1000" style="width: ${results.score}%"></div>
            </div>
            <h3 class="text-xl font-semibold mb-2">${results.rating}</h3>
            <p class="text-gray-600 mb-6">${results.feedback}</p>
            
            <div class="mt-6 p-4 bg-gray-50 rounded-lg">
                <h4 class="font-semibold mb-2">Your Answers:</h4>
                <div class="text-left space-y-2">
    `;

    // Add answers summary
    Object.entries(answers).forEach(([questionId, answer]) => {
        const question = QUESTIONS.find(q => q.id === questionId);
        html += `
            <div class="mb-2">
                <p class="font-medium">${question.title}</p>
                <p class="text-gray-600">${Array.isArray(answer) ? answer.join(', ') : answer}</p>
            </div>
        `;
    });

    html += `
                </div>
            </div>
            <button onclick="location.reload()" class="mt-6 px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">
                Try Again
            </button>
        </div>
    `;

    resultsContainer.innerHTML = html;
}

// Event Listeners
document.getElementById('next-btn').addEventListener('click', () => {
    console.log('Next button clicked');
    const currentQ = QUESTIONS[currentQuestion];
    console.log('Current question:', currentQ);
    
    if (currentQ.type === 'radio') {
        const selected = document.querySelector(`input[name="${currentQ.id}"]:checked`);
        console.log('Selected radio value:', selected?.value);
        
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
