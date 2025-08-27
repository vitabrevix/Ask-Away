// Spiciness level names
const spicinessNames = ['', 'Mild', 'Medium', 'Hot', 'Spicy', 'Smut'];
// Kinkiness level names
const kinkinessNames = ['', 'Vanilla', 'Newbie', 'Perverted', 'Degenerate', 'Freak'];

// Category descriptions for tooltips
const categoryDescriptions = {
	'introduction': 'Mild, basic, sometimes filtration, sometimes funny. Just to know each other, not sexually.',
    'lusty': 'Generatic horny questions. From flirty or less flirty, but still.',
    'bdsm': 'Questions specifcially for Dom/Sub or Sadist/Masochists and such.',
    'banana': 'Questions in case you have a... well a dick, a cock, a gock, a cum cannon, a crotch crowbar, pudding stirrer, a moisture missile, a beef bayonet, a beaver basher, a-.',
    'shell': 'Questions in case you have a... well a pussy, a vagina, a meat wallet, a tuna trench, a pudding pouch, a snatch hatch, a pink portal, a whispering eye, a groin garage, a-',
    'couple': 'Questions in case you are currently in a romantic relationship. Especially if you are playing with them rn.',
    'petplay': 'Questions specifically related to petplay.',
    'wouldyourather': 'Choice-based questions.',
};

// Tooltip css
const style = document.createElement('style');
style.textContent = `
.tooltip-active {
    transition: all 0.3s ease !important;
}

/* Arrow direction for flipped tooltips */
.tooltip[style*="--arrow-direction: up"]::before,
.category-tooltip[style*="--arrow-direction: up"]::before {
    top: -16px;
    bottom: auto;
    border-top: none;
    border-bottom: 8px solid #2d3748;
}

body.dark-mode .tooltip[style*="--arrow-direction: up"]::before,
body.dark-mode .category-tooltip[style*="--arrow-direction: up"]::before {
    border-bottom-color: #1a202c;
}

/* Question display styles */
.question-header {
    text-align: center;
    font-size: 0.9rem;
    color: #718096;
    margin-bottom: 10px;
}

body.dark-mode .question-header {
    color: #a0aec0;
}

.question-text {
    text-align: center;
    font-size: 1.1rem;
    line-height: 1.4;
}
`;
document.head.appendChild(style);

// Track used questions, selected categories, and spiciness level
let usedQuestions = new Set();
let selectedCategories = new Set();
let minSpiciness = 1;
let maxSpiciness = 5;
let minKinkiness = 1;
let maxKinkiness = 5;

// Function to save selected categories to localStorage
function saveSelectedCategories() {
    localStorage.setItem('selectedCategories', JSON.stringify([...selectedCategories]));
}

// Function to load selected categories from localStorage
function loadSelectedCategories() {
    const saved = localStorage.getItem('selectedCategories');
    if (saved) {
        selectedCategories = new Set(JSON.parse(saved));
    } else {
        // If no saved state, select all categories by default
        selectedCategories = new Set(Object.keys(questionDatabase));
    }
}

// Initialize the application
function initializeApp() {
    loadSelectedCategories();
    createCategoryCheckboxes();
    setupSpicinessSlider();
    setupKinkinessSlider();
    initializeSelectionMode();
    updateQuestionInputRange();
    
    // Load URL settings AFTER everything is created
    const urlSettings = decodeSettingsFromURL();
    if (urlSettings) {
        applySettingsFromURL(urlSettings);
    }
    
    updateStats();
    
    // Clean URL after loading settings (optional)
    if (urlSettings) {
        const cleanURL = new URL(window.location.href);
        cleanURL.searchParams.delete('s');
        window.history.replaceState({}, document.title, cleanURL.toString());
    }
}

// Setup spiciness slider
function setupSpicinessSlider() {
    const minSlider = document.getElementById('minSpicinessSlider');
    const maxSlider = document.getElementById('maxSpicinessSlider');
    const minValueDisplay = document.getElementById('minSpicinessValue');
    const maxValueDisplay = document.getElementById('maxSpicinessValue');
    
    // Initialize values from slider positions (handles page reload state)
    minSpiciness = parseInt(minSlider.value);
    maxSpiciness = parseInt(maxSlider.value);
    
    function updateSliders() {
        let newMinSpiciness = parseInt(minSlider.value);
        let newMaxSpiciness = parseInt(maxSlider.value);
        
        // Determine which slider changed and enforce constraints
        if (newMinSpiciness !== minSpiciness) {
            // Min slider changed - ensure max is not less than min
            if (newMaxSpiciness < newMinSpiciness) {
                newMaxSpiciness = newMinSpiciness;
                maxSlider.value = newMaxSpiciness;
            }
        } else if (newMaxSpiciness !== maxSpiciness) {
            // Max slider changed - ensure min is not greater than max
            if (newMinSpiciness > newMaxSpiciness) {
                newMinSpiciness = newMaxSpiciness;
                minSlider.value = newMinSpiciness;
            }
        }
        
        minSpiciness = newMinSpiciness;
        maxSpiciness = newMaxSpiciness;
        
        minValueDisplay.textContent = spicinessNames[minSpiciness];
        maxValueDisplay.textContent = spicinessNames[maxSpiciness];
        updateStats();
    }
    
    minSlider.addEventListener('input', updateSliders);
    maxSlider.addEventListener('input', updateSliders);
    
    // Initial update to sync display with current slider positions
    updateSliders();
}

// Setup kinkiness slider
function setupKinkinessSlider() {
    const minSlider = document.getElementById('minKinkinessSlider');
    const maxSlider = document.getElementById('maxKinkinessSlider');
    const minValueDisplay = document.getElementById('minKinkinessValue');
    const maxValueDisplay = document.getElementById('maxKinkinessValue');
    
    // Initialize values from slider positions (handles page reload state)
    minKinkiness = parseInt(minSlider.value);
    maxKinkiness = parseInt(maxSlider.value);
    
    function updateSliders() {
        let newMinKinkiness = parseInt(minSlider.value);
        let newMaxKinkiness = parseInt(maxSlider.value);
        
        // Determine which slider changed and enforce constraints
        if (newMinKinkiness !== minKinkiness) {
            // Min slider changed - ensure max is not less than min
            if (newMaxKinkiness < newMinKinkiness) {
                newMaxKinkiness = newMinKinkiness;
                maxSlider.value = newMaxKinkiness;
            }
        } else if (newMaxKinkiness !== maxKinkiness) {
            // Max slider changed - ensure min is not greater than max
            if (newMinKinkiness > newMaxKinkiness) {
                newMinKinkiness = newMaxKinkiness;
                minSlider.value = newMinKinkiness;
            }
        }
        
        minKinkiness = newMinKinkiness;
        maxKinkiness = newMaxKinkiness;
        
        minValueDisplay.textContent = kinkinessNames[minKinkiness];
        maxValueDisplay.textContent = kinkinessNames[maxKinkiness];
        updateStats();
    }
    
    minSlider.addEventListener('input', updateSliders);
    maxSlider.addEventListener('input', updateSliders);
    
    // Initial update to sync display with current slider positions
    updateSliders();
}

// Create category checkboxes dynamically
function createCategoryCheckboxes() {
	const categoriesContainer = document.getElementById('categories');
	
	Object.keys(questionDatabase).forEach(category => {
		const categoryDiv = document.createElement('div');
		categoryDiv.className = 'category-item';
		
		// Check if this category should be selected based on loaded state
		const isSelected = selectedCategories.has(category);
		if (isSelected) {
			categoryDiv.classList.add('selected');
		}
		
		categoryDiv.onclick = (e) => {
			// Don't toggle if clicking on tooltip
			if (!e.target.closest('.category-tooltip-trigger')) {
				toggleCategory(category, categoryDiv);
			}
		};
		
		const checkbox = document.createElement('input');
		checkbox.type = 'checkbox';
		checkbox.id = category;
		checkbox.checked = isSelected; // Set initial state based on loaded data
		checkbox.onchange = (e) => {
			e.stopPropagation();
			if (checkbox.checked) {
				selectedCategories.add(category);
				categoryDiv.classList.add('selected');
			} else {
				selectedCategories.delete(category);
				categoryDiv.classList.remove('selected');
			}
			saveSelectedCategories(); // Save state whenever it changes
			updateStats();
		};
		
		const label = document.createElement('label');
		label.htmlFor = category;
		label.textContent = category.charAt(0).toUpperCase() + category.slice(1);
		
		// Create tooltip for category
		const tooltipTrigger = document.createElement('div');
		tooltipTrigger.className = 'category-tooltip-trigger';
		tooltipTrigger.innerHTML = 'i';
		
		const tooltip = document.createElement('div');
		tooltip.className = 'category-tooltip';
		tooltip.innerHTML = `
			<h4>${category.charAt(0).toUpperCase() + category.slice(1)}</h4>
			<p>${categoryDescriptions[category] || 'Questions in this category.'}</p>
		`;
		
		tooltipTrigger.appendChild(tooltip);
		
		categoryDiv.appendChild(checkbox);
		categoryDiv.appendChild(label);
		categoryDiv.appendChild(tooltipTrigger);
		categoriesContainer.appendChild(categoryDiv);
	});
	
	// Reinitialize tooltips after creating categories
	if (typeof reinitializeTooltips === 'function') {
		reinitializeTooltips();
	}
}

// Toggle category selection
function toggleCategory(category, element) {
	const checkbox = element.querySelector('input[type="checkbox"]');
	checkbox.checked = !checkbox.checked;
	
	if (checkbox.checked) {
		selectedCategories.add(category);
		element.classList.add('selected');
	} else {
		selectedCategories.delete(category);
		element.classList.remove('selected');
	}
	saveSelectedCategories(); // Save state whenever it changes
	updateStats();
}

// Get specific question by ID
function getSpecificQuestion() {
    const input = document.getElementById('questionIdInput');
    const questionId = parseInt(input.value);
    const highestId = getHighestQuestionId();
    
    if (!questionId || questionId < 1 || questionId > highestId) {
        alert(`Please enter a valid question ID between 1 and ${highestId}!`);
        return;
    }
    
    // Find the question across all categories
    let foundQuestion = null;
    
    for (const [category, questions] of Object.entries(questionDatabase)) {
        const question = questions.find(q => q.id === questionId);
        if (question) {
            foundQuestion = {
                id: question.id,
                spiciness: question.spiciness,
                kinkiness: question.kinkiness,
                question: question.question,
                category
            };
            break;
        }
    }
    
    if (!foundQuestion) {
        alert(`Question #${questionId} not found!`);
        return;
    }
    
    // Display the question
    displayQuestion(foundQuestion);
    
    // Clear the input
    input.value = '';
    
    // Note: We don't mark this question as "used" since it was specifically requested
}

// Helper function to display questions with consistent formatting
function displayQuestion(questionObj) {
    const questionElement = document.getElementById('question');
    
    // Clear any existing content and styling
    questionElement.innerHTML = '';
    questionElement.classList.remove('no-question');
    
    // Remove any existing category info
    const existingCategoryInfo = questionElement.parentNode.querySelector('.category-info');
    if (existingCategoryInfo) {
        existingCategoryInfo.remove();
    }
    
    // Create header with ID, spiciness, and kinkiness
    const header = document.createElement('div');
    header.className = 'question-header';
    
    const spicinessIndicator = '🌶️'.repeat(questionObj.spiciness);
    const kinkinessIndicator = '⛓️'.repeat(questionObj.kinkiness);
    
    header.textContent = `#${questionObj.id} - ${spicinessIndicator} ${spicinessNames[questionObj.spiciness]} | ${kinkinessIndicator} ${kinkinessNames[questionObj.kinkiness]}`;
    
    // Create question text
    const questionText = document.createElement('div');
    questionText.className = 'question-text';
    questionText.textContent = questionObj.question;
    
    // Append both elements to the question container
    questionElement.appendChild(header);
    questionElement.appendChild(questionText);
    
    // Trigger animation
    const container = document.querySelector('.question-container');
    container.style.animation = 'none';
    container.offsetHeight; // Trigger reflow
    container.style.animation = 'slideIn 0.5s ease-out';
}

// Update statistics
function updateStats() {
    const totalUsed = usedQuestions.size;
    
    let totalAvailable = 0;
    selectedCategories.forEach(category => {
        if (questionDatabase[category]) {
            // Count questions within both spiciness and kinkiness ranges
            totalAvailable += questionDatabase[category].filter(q => 
                q.spiciness >= minSpiciness && q.spiciness <= maxSpiciness &&
                q.kinkiness >= minKinkiness && q.kinkiness <= maxKinkiness
            ).length;
        }
    });

    document.getElementById('questionsUsed').textContent = `Questions used: ${totalUsed}`;
    
    const spicinessRangeText = minSpiciness === maxSpiciness 
        ? `${spicinessNames[minSpiciness]} only`
        : `${spicinessNames[minSpiciness]} to ${spicinessNames[maxSpiciness]}`;
        
    const kinkinessRangeText = minKinkiness === maxKinkiness 
        ? `${kinkinessNames[minKinkiness]} only`
        : `${kinkinessNames[minKinkiness]} to ${kinkinessNames[maxKinkiness]}`;
    
    document.getElementById('questionsAvailable').textContent = `Available questions: ${totalAvailable} (🌶️ ${spicinessRangeText}, ⛓️ ${kinkinessRangeText})`;
}

// Initialize the app when the page loads
document.addEventListener('DOMContentLoaded', initializeApp);

// Dark mode functionality
document.addEventListener('DOMContentLoaded', function() {
    const darkModeToggle = document.getElementById('darkModeToggle');
    const body = document.body;
    
    // Check for saved dark mode preference
    if (localStorage.getItem('darkMode') === 'enabled') {
        body.classList.add('dark-mode');
        darkModeToggle.checked = true;
    }
    
    darkModeToggle.addEventListener('change', function() {
        if (this.checked) {
            body.classList.add('dark-mode');
            localStorage.setItem('darkMode', 'enabled');
        } else {
            body.classList.remove('dark-mode');
            localStorage.setItem('darkMode', 'disabled');
        }
    });
});

function initializeTooltips() {
    const tooltipTriggers = document.querySelectorAll('.tooltip-trigger, .category-tooltip-trigger');
    let activeTooltip = null;
    
    tooltipTriggers.forEach(trigger => {
        const tooltip = trigger.querySelector('.tooltip, .category-tooltip');
        
        // Enhanced touch/click behavior
        trigger.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            // If this tooltip is already active, hide it
            if (activeTooltip === tooltip) {
                hideTooltip(tooltip);
                activeTooltip = null;
                return;
            }
            
            // Hide any currently active tooltip
            if (activeTooltip) {
                hideTooltip(activeTooltip);
            }
            
            // Show this tooltip
            showTooltip(tooltip);
            activeTooltip = tooltip;
        });
        
        // Enhanced hover behavior for desktop
        if (!isTouchDevice()) {
            let hoverTimeout;
            
            trigger.addEventListener('mouseenter', function() {
                clearTimeout(hoverTimeout);
                if (activeTooltip && activeTooltip !== tooltip) {
                    hideTooltip(activeTooltip);
                }
                showTooltip(tooltip);
                activeTooltip = tooltip;
            });
            
            trigger.addEventListener('mouseleave', function() {
                hoverTimeout = setTimeout(() => {
                    if (!tooltip.matches(':hover')) {
                        hideTooltip(tooltip);
                        if (activeTooltip === tooltip) {
                            activeTooltip = null;
                        }
                    }
                }, 100);
            });
            
            // Keep tooltip open when hovering over it
            tooltip.addEventListener('mouseenter', function() {
                clearTimeout(hoverTimeout);
            });
            
            tooltip.addEventListener('mouseleave', function() {
                hideTooltip(tooltip);
                if (activeTooltip === tooltip) {
                    activeTooltip = null;
                }
            });
        }
    });
    
    // Hide tooltip when clicking outside
    document.addEventListener('click', function(e) {
        if (activeTooltip && !e.target.closest('.tooltip-trigger') && !e.target.closest('.category-tooltip-trigger')) {
            hideTooltip(activeTooltip);
            activeTooltip = null;
        }
    });
    
    // Hide tooltip on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && activeTooltip) {
            hideTooltip(activeTooltip);
            activeTooltip = null;
        }
    });
}

function showTooltip(tooltip) {
    if (tooltip) {
        tooltip.style.opacity = '1';
        tooltip.style.visibility = 'visible';
        tooltip.style.pointerEvents = 'auto';
        
        // Add a class for any additional styling
        tooltip.classList.add('tooltip-active');
        
        // Ensure tooltip stays within viewport on mobile
        if (isTouchDevice()) {
            adjustTooltipPosition(tooltip);
        }
    }
}

function hideTooltip(tooltip) {
    if (tooltip) {
        tooltip.style.opacity = '0';
        tooltip.style.visibility = 'hidden';
        tooltip.style.pointerEvents = 'none';
        tooltip.classList.remove('tooltip-active');
    }
}

function adjustTooltipPosition(tooltip) {
    const rect = tooltip.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    // Adjust horizontal position if tooltip goes off-screen
    if (rect.left < 10) {
        tooltip.style.left = '10px';
        tooltip.style.transform = 'none';
    } else if (rect.right > viewportWidth - 10) {
        tooltip.style.left = 'auto';
        tooltip.style.right = '10px';
        tooltip.style.transform = 'none';
    }
    
    // Adjust vertical position if tooltip goes off-screen
    if (rect.top < 10) {
        tooltip.style.bottom = 'auto';
        tooltip.style.top = '100%';
        tooltip.style.marginTop = '10px';
        
        // Flip arrow to point up
        const arrow = tooltip.querySelector('::before');
        if (arrow) {
            tooltip.style.setProperty('--arrow-direction', 'up');
        }
    }
}

function isTouchDevice() {
    return ('ontouchstart' in window) || 
           (navigator.maxTouchPoints > 0) || 
           (navigator.msMaxTouchPoints > 0);
}

// Initialize tooltips when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Wait a bit for the dynamic content to be created
    setTimeout(initializeTooltips, 100);
});

// Re-initialize tooltips when categories are dynamically added
function reinitializeTooltips() {
    setTimeout(initializeTooltips, 50);
}

function getHighestQuestionId() {
    let highestId = 0;
    Object.values(questionDatabase).forEach(category => {
        category.forEach(question => {
            if (question.id > highestId) {
                highestId = question.id;
            }
        });
    });
    return highestId;
}

function updateQuestionInputRange() {
    const questionInput = document.getElementById('questionIdInput');
    const highestId = getHighestQuestionId();
    
    // Update the input's max attribute
    questionInput.max = highestId;
    
    // Update the placeholder text
    questionInput.placeholder = `Enter question ID (1-${highestId})`;
}

// Function to encode current settings to URL parameters
function encodeSettingsToURL() {
    // Category mapping to single letters
    const categoryMap = {
        'introduction': 'i',
        'lusty': 'l',
        'bdsm': 'b',
        'banana': 'n',
        'shell': 's',
        'couple': 'c',
        'wouldyourather': 'w'
    };
    
    // Build compact string: categories + spiciness range + kinkiness range + mode
    let compact = '';
    
    // Categories (7 characters max, 1 for each category)
    Object.keys(categoryMap).forEach(category => {
        compact += selectedCategories.has(category) ? categoryMap[category] : '-';
    });
    
    // Add ranges and mode (5 digits: minSpicy, maxSpicy, minKinky, maxKinky, mode)
    compact += minSpiciness.toString();
    compact += maxSpiciness.toString();  
    compact += minKinkiness.toString();
    compact += maxKinkiness.toString();
    compact += (currentSelectionMode || 0).toString();
    
    const currentURL = new URL(window.location.href);
    currentURL.searchParams.set('s', compact);
    
    return currentURL.toString();
}

// Function to decode settings from URL parameters
function decodeSettingsFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    const compact = urlParams.get('s');
    
    if (!compact || compact.length < 12) {
        console.log('Invalid or missing compact string'); // Debug log
        return null;
    }
    
    try {
        // Category mapping (reverse)
        const categoryMap = {
            'i': 'introduction',
            'l': 'lusty', 
            'b': 'bdsm',
            'n': 'banana',
            's': 'shell',
            'c': 'couple',
            'w': 'wouldyourather'
        };
        
        // Parse categories (first 7 characters)
        const categories = [];
        for (let i = 0; i < 7 && i < compact.length; i++) {
            const char = compact[i];
            if (char !== '-' && categoryMap[char]) {
                categories.push(categoryMap[char]);
            }
        }
        
        // Parse ranges and mode (characters 7-11)
        const minSpiciness = parseInt(compact[7]) || 1;
        const maxSpiciness = parseInt(compact[8]) || 5;
        const minKinkiness = parseInt(compact[9]) || 1;
        const maxKinkiness = parseInt(compact[10]) || 5;
        const selectionMode = parseInt(compact[11]) || 0;
        
        const decoded = {
            categories,
            minSpiciness,
            maxSpiciness,
            minKinkiness,
            maxKinkiness,
            selectionMode
        };
        
        return decoded;
        
    } catch (error) {
        console.warn('Failed to decode settings from URL:', error);
        return null;
    }
}

// Function to apply settings from decoded URL
function applySettingsFromURL(settings) {
    if (!settings) return;
    
    // Apply categories
    if (settings.categories && Array.isArray(settings.categories)) {
        // Validate that the categories exist in the database
        const validCategories = settings.categories.filter(cat => questionDatabase[cat]);
        selectedCategories = new Set(validCategories);
        saveSelectedCategories(); // Save the loaded settings
    }
    
    // Apply spiciness range - update both variables and sliders
    if (typeof settings.minSpiciness === 'number' && settings.minSpiciness >= 1 && settings.minSpiciness <= 5) {
        minSpiciness = settings.minSpiciness;
        const minSlider = document.getElementById('minSpicinessSlider');
        if (minSlider) {
            minSlider.value = minSpiciness;
        }
    }
    if (typeof settings.maxSpiciness === 'number' && settings.maxSpiciness >= 1 && settings.maxSpiciness <= 5) {
        maxSpiciness = settings.maxSpiciness;
        const maxSlider = document.getElementById('maxSpicinessSlider');
        if (maxSlider) {
            maxSlider.value = maxSpiciness;
        }
    }
    
    // Apply kinkiness range - update both variables and sliders
    if (typeof settings.minKinkiness === 'number' && settings.minKinkiness >= 1 && settings.minKinkiness <= 5) {
        minKinkiness = settings.minKinkiness;
        const minSlider = document.getElementById('minKinkinessSlider');
        if (minSlider) {
            minSlider.value = minKinkiness;
        }
    }
    if (typeof settings.maxKinkiness === 'number' && settings.maxKinkiness >= 1 && settings.maxKinkiness <= 5) {
        maxKinkiness = settings.maxKinkiness;
        const maxSlider = document.getElementById('maxKinkinessSlider');
        if (maxSlider) {
            maxSlider.value = maxKinkiness;
        }
    }
    
    // Apply selection mode
    if (typeof settings.selectionMode === 'number' && settings.selectionMode >= 0 && settings.selectionMode <= 2) {
        const modeSlider = document.getElementById('modeSlider');
        if (modeSlider) {
            modeSlider.value = settings.selectionMode;
        }
        // Update the current selection mode variable if it exists
        if (typeof currentSelectionMode !== 'undefined') {
            currentSelectionMode = settings.selectionMode;
        }
    }
    
    // Force update UI displays
    updateSlidersUI();
    updateCategoriesUI();
    updateSelectionModeUI();
}

function updateSlidersUI() {
    document.getElementById('minSpicinessValue').textContent = spicinessNames[minSpiciness];
    document.getElementById('maxSpicinessValue').textContent = spicinessNames[maxSpiciness];
    document.getElementById('minKinkinessValue').textContent = kinkinessNames[minKinkiness];
    document.getElementById('maxKinkinessValue').textContent = kinkinessNames[maxKinkiness];
}

function updateCategoriesUI() {
    Object.keys(questionDatabase).forEach(category => {
        const checkbox = document.getElementById(category);
        const categoryDiv = checkbox ? checkbox.parentElement : null;
        
        if (checkbox && categoryDiv) {
            if (selectedCategories.has(category)) {
                checkbox.checked = true;
                categoryDiv.classList.add('selected');
            } else {
                checkbox.checked = false;
                categoryDiv.classList.remove('selected');
            }
        }
    });
}

function updateSelectionModeUI() {
    if (typeof updateModeDescription === 'function') {
        updateModeDescription();
    }
}

async function shareSettings() {
    const shareURL = encodeSettingsToURL();
    
    try {
        await navigator.clipboard.writeText(shareURL);
        
        // Show feedback to user
        const button = event.target;
        const originalText = button.innerHTML;
        button.innerHTML = '✅ Copied!';
        button.disabled = true;
        
        setTimeout(() => {
            button.innerHTML = originalText;
            button.disabled = false;
        }, 2000);
        
    } catch (error) {
        // Fallback for browsers that don't support clipboard API
        console.warn('Clipboard API not available, using fallback');
        
        // Create a temporary input element
        const tempInput = document.createElement('input');
        tempInput.value = shareURL;
        document.body.appendChild(tempInput);
        tempInput.select();
        
        try {
            document.execCommand('copy');
            
            // Show feedback to user
            const button = event.target;
            const originalText = button.innerHTML;
            button.innerHTML = '✅ Copied!';
            button.disabled = true;
            
            setTimeout(() => {
                button.innerHTML = originalText;
                button.disabled = false;
            }, 2000);
            
        } catch (fallbackError) {
            alert('Failed to copy to clipboard. Please copy the URL manually:\n\n' + shareURL);
        }
        
        document.body.removeChild(tempInput);
    }
}

