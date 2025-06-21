// Array of sentences for the typing test
const sentences = [
    "The quick brown fox jumps over the lazy dog.",
    "Never underestimate the power of a good book.",
    "The early bird catches the worm, but the second mouse gets the cheese.",
    "Innovation distinguishes between a leader and a follower.",
    "The only way to do great work is to love what you do.",
    "Programming is like building a puzzle, one line of code at a time.",
    "The sun always shines brightest after the rain.",
    "Life is what happens when you're busy making other plans.",
    "The future belongs to those who believe in the beauty of their dreams.",
    "The journey of a thousand miles begins with a single step."
];

// DOM element references
const textDisplay = document.getElementById('text-display');
const textInput = document.getElementById('text-input');
const startButton = document.getElementById('start-button');
const resultsDiv = document.getElementById('results');
const wpmSpan = document.getElementById('wpm');
const accuracySpan = document.getElementById('accuracy');

// Test state variables
let currentSentence = ''; // The sentence currently being typed
let startTime = 0; // Timestamp when the test starts
let timer = null; // Interval ID for the timer (not used for display, but for potential future use)
let typedCharacters = 0; // Total characters typed by the user
let correctCharacters = 0; // Total correct characters typed
let mistakes = 0; // Total incorrect characters typed
let testStarted = false; // Flag to check if the test is active

/**
 * Loads a random sentence into the text display.
 */
function loadSentence() {
    // Pick a random sentence from the array
    currentSentence = sentences[Math.floor(Math.random() * sentences.length)];
    
    // Populate the text display with each character wrapped in a span
    // This allows individual character styling (e.g., for correct/incorrect feedback)
    textDisplay.innerHTML = currentSentence.split('').map(char => {
        return `<span class="char">${char}</span>`;
    }).join('');
}

/**
 * Initializes the typing test.
 */
function startTest() {
    resetTest(); // Reset any previous test state
    loadSentence(); // Load a new sentence
    textInput.value = ''; // Clear the input field
    textInput.disabled = false; // Enable the input field
    textInput.focus(); // Focus the input field for immediate typing
    startButton.textContent = 'Restart Test'; // Change button text
    resultsDiv.classList.add('hidden'); // Hide results until completion

    startTime = new Date().getTime(); // Record the start time in milliseconds
    testStarted = true;
}

/**
 * Handles user input in the textarea.
 * Compares typed characters with the target sentence and provides feedback.
 */
function handleInput() {
    if (!testStarted) return; // Do nothing if test hasn't started

    const typedText = textInput.value;
    const sentenceChars = textDisplay.querySelectorAll('.char'); // Get all character spans

    typedCharacters = typedText.length;
    correctCharacters = 0;
    mistakes = 0;

    // Iterate through each character in the displayed sentence
    sentenceChars.forEach((charSpan, index) => {
        const charInSentence = currentSentence[index]; // The correct character
        const charTyped = typedText[index]; // The character typed by the user

        // Reset classes for current character to ensure proper feedback on backspace
        charSpan.classList.remove('correct', 'incorrect');

        if (charTyped === undefined) {
            // If the user hasn't typed this far yet
            charSpan.classList.remove('correct', 'incorrect');
        } else if (charTyped === charInSentence) {
            // Correct character typed
            charSpan.classList.add('correct');
            correctCharacters++;
        } else {
            // Incorrect character typed
            charSpan.classList.add('incorrect');
            mistakes++;
        }
    });

    // Auto-scroll the text display to keep the current typing position visible
    // This is a basic implementation and might need refinement for very long sentences.
    const typedTextWidth = textInput.scrollWidth;
    const textDisplayWidth = textDisplay.clientWidth;
    if (typedTextWidth > textDisplayWidth) {
        textDisplay.scrollLeft = typedTextWidth - textDisplayWidth;
    }


    // Check if the user has finished typing the entire sentence
    if (typedText.length === currentSentence.length) {
        // Check if all typed characters match the sentence.
        // If there are no mistakes and the length matches, the test is complete.
        if (mistakes === 0) {
            endTest();
        } else {
            // If there are mistakes at the end, allow correcting before ending.
            // Or, you could decide to end the test immediately if a mistake is made at the end.
            // For now, we allow correction.
        }
    }
}

/**
 * Ends the test and calculates WPM and accuracy.
 */
function endTest() {
    testStarted = false; // Stop the test
    textInput.disabled = true; // Disable input
    startButton.textContent = 'Start New Test'; // Prompt for a new test

    const endTime = new Date().getTime(); // Record end time
    const timeElapsedSeconds = (endTime - startTime) / 1000; // Time in seconds

    // Calculate WPM (Words Per Minute)
    // A "word" is typically considered 5 characters (including spaces)
    const wordsTyped = typedCharacters / 5;
    const wpm = timeElapsedSeconds > 0 ? Math.round((wordsTyped / timeElapsedSeconds) * 60) : 0;

    // Calculate Accuracy
    const accuracy = typedCharacters > 0 ? ((correctCharacters - mistakes) / typedCharacters) * 100 : 0;
    const finalAccuracy = Math.max(0, Math.round(accuracy)); // Ensure accuracy is not negative

    // Display results
    wpmSpan.textContent = wpm;
    accuracySpan.textContent = `${finalAccuracy}%`;
    resultsDiv.classList.remove('hidden'); // Show results
}

/**
 * Resets all test-related variables and prepares for a new test.
 */
function resetTest() {
    currentSentence = '';
    startTime = 0;
    typedCharacters = 0;
    correctCharacters = 0;
    mistakes = 0;
    testStarted = false;
    textInput.value = '';
    textInput.disabled = true;
    textDisplay.innerHTML = 'Click "Start Test" to begin!'; // Reset display text
    textDisplay.scrollLeft = 0; // Reset scroll position
    resultsDiv.classList.add('hidden'); // Hide results
    startButton.textContent = 'Start Test';
}

// Add Event Listeners
startButton.addEventListener('click', startTest);
textInput.addEventListener('input', handleInput);

// Initial setup when the page loads
window.onload = resetTest; // Ensure everything is reset when page loads
