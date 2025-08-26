// question-selector.js - Question Selection Logic

// Selection mode constants
const SELECTION_MODES = {
    RANDOM: 0,
    INCREASING: 1,
    UP_DOWN: 2
};

const MODE_NAMES = ['Random', 'Increasing', 'Up & Down'];
const MODE_DESCRIPTIONS = [
    'Questions are selected completely at random',
    'Gradually increases chance of higher spiciness levels as you answer more questions',
    'Cycles between increasing and decreasing spiciness levels quickly'
];

// Question selection state
let currentSelectionMode = SELECTION_MODES.RANDOM;
let questionsAnswered = 0;
let upDownCycle = 0; // For tracking up/down cycle position

// Initialize selection mode functionality
function initializeSelectionMode() {
    const modeSlider = document.getElementById('modeSlider');
    const modeDescription = document.getElementById('modeDescription');
    
    if (!modeSlider || !modeDescription) {
        console.error('Mode slider elements not found');
        return;
    }
    
    // Initialize from slider value
    currentSelectionMode = parseInt(modeSlider.value);
    updateModeDisplay();
    
    // Add event listeners
    modeSlider.addEventListener('input', function(e) {
        currentSelectionMode = parseInt(e.target.value);
        updateModeDisplay();
    });
    
    modeSlider.addEventListener('change', function(e) {
        currentSelectionMode = parseInt(e.target.value);
        updateModeDisplay();
    });
    
    // For better mobile support
    modeSlider.addEventListener('touchend', function(e) {
        currentSelectionMode = parseInt(e.target.value);
        updateModeDisplay();
    });
    
    function updateModeDisplay() {
        // Update description text based on current mode
        modeDescription.textContent = MODE_DESCRIPTIONS[currentSelectionMode];
    }
}

// Get all available questions based on current filters
function getAvailableQuestions() {
    let availableQuestions = [];
    selectedCategories.forEach(category => {
        if (questionDatabase[category]) {
            questionDatabase[category].forEach(questionObj => {
                // Only include questions within both spiciness and kinkiness ranges
                if (questionObj.spiciness >= minSpiciness && questionObj.spiciness <= maxSpiciness &&
                    questionObj.kinkiness >= minKinkiness && questionObj.kinkiness <= maxKinkiness) {
                    const questionKey = questionObj.id.toString();
                    if (!usedQuestions.has(questionKey)) {
                        availableQuestions.push({
                            id: questionObj.id,
                            spiciness: questionObj.spiciness,
                            kinkiness: questionObj.kinkiness,
                            question: questionObj.question,
                            category,
                            key: questionKey
                        });
                    }
                }
            });
        }
    });
    return availableQuestions;
}

// Select question based on current mode
function selectQuestionByMode(availableQuestions) {
    switch(currentSelectionMode) {
        case SELECTION_MODES.RANDOM:
            return selectRandomQuestion(availableQuestions);
        case SELECTION_MODES.INCREASING:
            return selectIncreasingQuestion(availableQuestions);
        case SELECTION_MODES.UP_DOWN:
            return selectUpDownQuestion(availableQuestions);
        default:
            return selectRandomQuestion(availableQuestions);
    }
}

// Random selection (original logic)
function selectRandomQuestion(availableQuestions) {
    const randomIndex = Math.floor(Math.random() * availableQuestions.length);
    return availableQuestions[randomIndex];
}

// Increasing selection - higher chance of higher spiciness as questions answered increases
function selectIncreasingQuestion(availableQuestions) {
    if (availableQuestions.length === 0) return null;
    
    // Calculate bias factor based on questions answered (0 to 1, increases gradually)
    const maxBias = 0.8; // Maximum bias towards higher spiciness
    const biasGrowthRate = 0.1; // How quickly bias grows per question
    const biasFactor = Math.min(maxBias, questionsAnswered * biasGrowthRate);
    
    // Group questions by spiciness level
    const questionsBySpiciness = {};
    let maxSpiciness = 0;
    
    availableQuestions.forEach(q => {
        if (!questionsBySpiciness[q.spiciness]) {
            questionsBySpiciness[q.spiciness] = [];
        }
        questionsBySpiciness[q.spiciness].push(q);
        maxSpiciness = Math.max(maxSpiciness, q.spiciness);
    });
    
    // Calculate weighted selection based on spiciness level
    const weights = [];
    const spicinessLevels = Object.keys(questionsBySpiciness).map(Number).sort((a, b) => a - b);
    
    spicinessLevels.forEach(level => {
        // Base weight is 1, increased by bias factor for higher levels
        const normalizedLevel = (level - 1) / (maxSpiciness - 1); // 0 to 1
        const weight = 1 + (biasFactor * normalizedLevel * 3); // Multiply by 3 for stronger effect
        weights.push({ level, weight, questions: questionsBySpiciness[level] });
    });
    
    // Select based on weights
    const totalWeight = weights.reduce((sum, w) => sum + w.weight * w.questions.length, 0);
    let random = Math.random() * totalWeight;
    
    for (const weightData of weights) {
        const sectionWeight = weightData.weight * weightData.questions.length;
        if (random <= sectionWeight) {
            const randomIndex = Math.floor(Math.random() * weightData.questions.length);
            return weightData.questions[randomIndex];
        }
        random -= sectionWeight;
    }
    
    // Fallback to random selection
    return selectRandomQuestion(availableQuestions);
}

// Up and Down selection - cycles between increasing and decreasing spiciness every 5 questions
function selectUpDownQuestion(availableQuestions) {
    if (availableQuestions.length === 0) return null;
    
    // Determine if we're in an "up" or "down" phase (5 questions each)
    const cyclePosition = questionsAnswered % 10; // 0-9 cycle
    const isUpPhase = cyclePosition < 5;
    const phasePosition = cyclePosition % 5; // 0-4 within the phase
    
    // Calculate bias (stronger than increasing mode for faster changes)
    let biasFactor;
    if (isUpPhase) {
        // Increasing phase: 0 -> 0.9 over 5 questions
        biasFactor = (phasePosition / 4) * 0.9;
    } else {
        // Decreasing phase: 0.9 -> 0 over 5 questions  
        biasFactor = ((4 - phasePosition) / 4) * 0.9;
    }
    
    // Group questions by spiciness level
    const questionsBySpiciness = {};
    let maxSpiciness = 0;
    
    availableQuestions.forEach(q => {
        if (!questionsBySpiciness[q.spiciness]) {
            questionsBySpiciness[q.spiciness] = [];
        }
        questionsBySpiciness[q.spiciness].push(q);
        maxSpiciness = Math.max(maxSpiciness, q.spiciness);
    });
    
    // Calculate weighted selection
    const weights = [];
    const spicinessLevels = Object.keys(questionsBySpiciness).map(Number).sort((a, b) => a - b);
    
    spicinessLevels.forEach(level => {
        const normalizedLevel = (level - 1) / (maxSpiciness - 1); // 0 to 1
        let weight;
        
        if (isUpPhase) {
            // Up phase: favor higher spiciness
            weight = 1 + (biasFactor * normalizedLevel * 4);
        } else {
            // Down phase: favor lower spiciness
            weight = 1 + (biasFactor * (1 - normalizedLevel) * 4);
        }
        
        weights.push({ level, weight, questions: questionsBySpiciness[level] });
    });
    
    // Select based on weights
    const totalWeight = weights.reduce((sum, w) => sum + w.weight * w.questions.length, 0);
    let random = Math.random() * totalWeight;
    
    for (const weightData of weights) {
        const sectionWeight = weightData.weight * weightData.questions.length;
        if (random <= sectionWeight) {
            const randomIndex = Math.floor(Math.random() * weightData.questions.length);
            return weightData.questions[randomIndex];
        }
        random -= sectionWeight;
    }
    
    // Fallback to random selection
    return selectRandomQuestion(availableQuestions);
}

// Main question generation function (replaces the one in app.js)
function generateQuestionWithMode() {
    if (selectedCategories.size === 0) {
        alert('Please select at least one category first!');
        return;
    }

    // Get all available questions
    const availableQuestions = getAvailableQuestions();

    // Check if any questions are available
    if (availableQuestions.length === 0) {
        document.getElementById('resetWarning').style.display = 'block';
        return;
    }

    // Hide reset warning
    document.getElementById('resetWarning').style.display = 'none';

    // Select question based on current mode
    const selectedQuestion = selectQuestionByMode(availableQuestions);
    
    if (!selectedQuestion) {
        document.getElementById('resetWarning').style.display = 'block';
        return;
    }

    // Mark question as used and increment counter
    usedQuestions.add(selectedQuestion.key);
    questionsAnswered++;

    // Display the question
    displayQuestion(selectedQuestion);

    updateStats();
}

// Reset function that also resets mode-specific counters
function resetQuestionsWithMode() {
    usedQuestions.clear();
    questionsAnswered = 0;
    upDownCycle = 0;
    
    document.getElementById('resetWarning').style.display = 'none';
    
    const questionElement = document.getElementById('question');
    questionElement.innerHTML = 'Questions reset! Click "Generate Question" for a new one.';
    questionElement.classList.add('no-question');
    
    // Remove any existing category info
    const existingCategoryInfo = questionElement.parentNode.querySelector('.category-info');
    if (existingCategoryInfo) {
        existingCategoryInfo.remove();
    }
    
    updateStats();
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Wait a bit for other scripts to initialize
    setTimeout(() => {
        if (document.getElementById('modeSlider')) {
            initializeSelectionMode();
        }
    }, 100);
});