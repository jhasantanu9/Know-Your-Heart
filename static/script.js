
const questions = [
    { key: "age", text: "What is your age?", type: "number", min: 1, max: 120 },
    { key: "sex", text: "What is your biological sex?", type: "select", options: [
        { value: "1", text: "Male" },
        { value: "0", text: "Female" }
    ]},
    { key: "cp", text: "What type of chest pain do you experience?", type: "select", options: [
        { value: "0", text: "Typical angina" },
        { value: "1", text: "Atypical angina" },
        { value: "2", text: "Non-anginal pain" },
        { value: "3", text: "Asymptomatic" }
    ]},
    { key: "trestbps", text: "What is your resting blood pressure (in mm Hg)?", type: "number", min: 60, max: 250 },
    { key: "chol", text: "What is your serum cholesterol level (in mg/dl)?", type: "number", min: 100, max: 600 },
    { key: "fbs", text: "Is your fasting blood sugar > 120 mg/dl?", type: "select", options: [
        { value: "1", text: "Yes" },
        { value: "0", text: "No" }
    ]},
    { key: "restecg", text: "What are your resting electrocardiographic results?", type: "select", options: [
        { value: "0", text: "Normal" },
        { value: "1", text: "Having ST-T wave abnormality" },
        { value: "2", text: "Showing probable or definite left ventricular hypertrophy" }
    ]},
    { key: "thalach", text: "What is your maximum heart rate achieved?", type: "number", min: 60, max: 250 },
    { key: "exang", text: "Do you have exercise-induced angina?", type: "select", options: [
        { value: "1", text: "Yes" },
        { value: "0", text: "No" }
    ]},
    { key: "oldpeak", text: "What is your ST depression induced by exercise relative to rest?", type: "number", min: 0, max: 10, step: 0.1 },
    { key: "slope", text: "What is the slope of your peak exercise ST segment?", type: "select", options: [
        { value: "0", text: "Upsloping" },
        { value: "1", text: "Flat" },
        { value: "2", text: "Downsloping" }
    ]},
    { key: "ca", text: "Number of major vessels colored by fluoroscopy?", type: "select", options: [
        { value: "0", text: "0" },
        { value: "1", text: "1" },
        { value: "2", text: "2" },
        { value: "3", text: "3" }
    ]},
    { key: "thal", text: "What is your thalassemia status?", type: "select", options: [
        { value: "0", text: "Normal" },
        { value: "1", text: "Fixed defect" },
        { value: "2", text: "Reversible defect" }
    ]}
];

let currentQuestion = 0;
const answers = {};


// Event listeners
document.addEventListener('DOMContentLoaded', (event) => {
    const aiUserInput = document.getElementById("ai-user-input");
    if (aiUserInput) {
        aiUserInput.addEventListener("keypress", function(event) {
            if (event.key === "Enter") {
                event.preventDefault();
                sendAIMessage();
            }
        });
    }

    const sendButton = document.querySelector("#ai-input-container-yes button");
    if (sendButton) {
        sendButton.onclick = sendAIMessage;
    }

    const startChatButton = document.getElementById("start-chat");
    if (startChatButton) {
        startChatButton.addEventListener("click", startChat);
    }

    const userInput = document.getElementById("user-input");
    if (userInput) {
        userInput.addEventListener("keypress", function(event) {
            if (event.key === "Enter") {
                event.preventDefault();
                handleAIConversation();
            }
        });
    }
});

window.addEventListener('beforeunload', function (e) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', '/clear_session', false);
    xhr.send();
});

// Functions
let chatStarted = false;

function startChat() {
    if (chatStarted) return;
    chatStarted = true;

    document.getElementById('app-description').style.display = 'none';
    document.getElementById('start-chat').style.display = 'none';
    document.getElementById('features-description').style.display = 'none';
    document.getElementById('back-btn-assessment').style.display = 'block';
    document.getElementById('main-buttons').style.display = 'none';
    document.getElementById('chat-container').style.display = 'block';

    // Reset currentQuestion to ensure we start from the beginning
    currentQuestion = 0;

    // Use Promise to ensure sequential execution
    Promise.resolve()
        .then(() => addBotMessage("Hello! Let's start with a few questions."))
        .then(() => new Promise(resolve => setTimeout(resolve, 1000))) // Wait for 1 second
        .then(() => askQuestion());
}

function addBotMessage(message) {
    const chatContainer = document.getElementById("chat-container");
    const botMessageDiv = document.createElement("div");
    botMessageDiv.className = "bot-message clearfix";
    botMessageDiv.innerHTML = message; 
    chatContainer.appendChild(botMessageDiv);
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

let isAskingQuestion = false;

function askQuestion() {
    if (isAskingQuestion) return;
    isAskingQuestion = true;

    console.log(`Asking question ${currentQuestion}`);

    if (currentQuestion >= questions.length) {
        addBotMessage("Thank you for providing your details. Based on your responses, we'll assess your heart health now.");
        sendDataToServer();
        isAskingQuestion = false;
        return;
    }

    const question = questions[currentQuestion];
    const inputId = `user-input-${currentQuestion}`;

    Promise.resolve()
        .then(() => addBotMessage(question.text))
        .then(() => {
            let inputHtml;
            if (question.type === "select") {
                inputHtml = `<select id="${inputId}" class="border p-2 rounded text-right">`;
                question.options.forEach(option => {
                    inputHtml += `<option value="${option.value}">${option.text}</option>`;
                });
                inputHtml += '</select>';
            } else {
                inputHtml = `<input type="${question.type}" id="${inputId}" class="border p-2 rounded text-right" min="${question.min}" max="${question.max}" step="${question.step || 1}" />`;
            }

            const inputContainer = document.createElement('div');
            inputContainer.className = "input-container p-4";
            inputContainer.innerHTML = `
                ${inputHtml}
                <button class="submit-answer bg-blue-500 text-white p-2 rounded ml-2" onclick="submitAnswer('${inputId}')">Send</button>
            `;

            const chatContainer = document.getElementById("chat-container");
            chatContainer.appendChild(inputContainer);
            chatContainer.scrollTop = chatContainer.scrollHeight;
        })
        .then(() => {
            isAskingQuestion = false;
        });
}

function clearPreviousMessages() {
    const chatContainer = document.getElementById("chat-container");
    const errorMessages = chatContainer.querySelectorAll('.bot-message');
    
    errorMessages.forEach(message => {
        if (message.innerText.startsWith("Please")) {
            message.remove();
        }
    });
}

function addUserMessage(message) {
    const chatContainer = document.getElementById("chat-container");
    const userMessageDiv = document.createElement("div");
    userMessageDiv.className = "user-message clearfix";
    userMessageDiv.textContent = message;
    chatContainer.appendChild(userMessageDiv);
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

function sendDataToServer() {
    fetch('/predict', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(answers),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(result => {
        predictionResult = result;
        displayResult(result);
    })
    .catch(error => {
        addBotMessage('An error occurred while processing your request. Please try again.');
        console.error('Error:', error);
    });
}

function displayResult(result) {
    let resultMessage;
    if (result.prediction === 1) {
        resultMessage = `Based on your responses, <strong> there's a ${result.probability.toFixed(2)}% chance that you may have a higher risk of heart disease </strong>. It's important to consult with a healthcare professional for a thorough evaluation.`;
    } else {
        resultMessage = `Based on your responses, <strong> your risk of heart disease appears to be lower, with a ${(100 - result.probability).toFixed(2)}% chance of not having heart disease </strong>. However, it's always good to maintain a healthy lifestyle and consult with a healthcare professional regularly.`;
    }
    addBotMessage(resultMessage);
    setTimeout(askToContinue, 1000);
}

function submitAnswer(inputId) {
    console.log(`Submitting answer for question ${currentQuestion}`);
    const question = questions[currentQuestion];
    const userInput = document.getElementById(inputId);

    clearPreviousMessages();

    if (!userInput.value) {
        addBotMessage("Please provide a valid response.");
        return;
    }

    if (question.type === "number") {
        const value = parseFloat(userInput.value);
        if (value < question.min || value > question.max) {
            addBotMessage(`Please provide a value between ${question.min} and ${question.max}.`);
            return;
        }
    }

    let userAnswerText;
    if (question.type === 'select') {
        const selectedOption = question.options.find(option => option.value === userInput.value);
        userAnswerText = selectedOption ? selectedOption.text : userInput.value;
    } else {
        userAnswerText = userInput.value;
    }

    answers[question.key] = userInput.value;
    addUserMessage(userAnswerText);

    userInput.parentElement.remove();

    currentQuestion++;
    
    // Use Promise to ensure sequential execution
    Promise.resolve().then(() => askQuestion());
}

function askToContinue() {
    addBotMessage("Would you like to continue and want to talk to our AI?");
    
    const continueButtonsHtml = `
        <div class="input-container p-4" id="continue-buttons">
            <button class="submit-answer bg-green-500 text-white p-2 rounded ml-2" onclick="handleContinueResponse('yes')">Yes</button>
            <button class="submit-answer bg-red-500 text-white p-2 rounded ml-2" onclick="handleContinueResponse('no')">No</button>
        </div>
    `;
    
    const chatContainer = document.getElementById("chat-container");
    const inputContainer = document.createElement('div');
    inputContainer.innerHTML = continueButtonsHtml;
    
    chatContainer.appendChild(inputContainer);
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

function handleContinueResponse(response) {
    if (response === 'yes') {
        const inputContainerYes = document.getElementById("ai-input-container-yes");
        if (inputContainerYes) {
            inputContainerYes.style.display = "flex";
        }
        addBotMessage("I have your assessment results with me. Do you want to know more about that or do you have a specific question in mind?");
    } else if (response === 'no') {
        addBotMessage("Thank you for using the app. Feel free to start a new session.");
    }

    const buttonsContainer = document.getElementById("continue-buttons");
    if (buttonsContainer) {
        buttonsContainer.remove();
    }
}

function sendAIMessage() {
    const userInput = document.getElementById("ai-user-input");
    const message = userInput.value.trim();
    if (message) {
        addUserMessage(message);
        userInput.value = "";
        
        fetch('/ai_chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({user_input: message, assessment_data: predictionResult}),
        })
        .then(response => response.json())
        .then(data => {
            addBotMessage(data.response);
        })
        .catch(error => {
            console.error('Error:', error);
            addBotMessage("I'm sorry, I'm having trouble responding right now. Please try again later.");
        });
    }
}

function startAIChat() {
    document.getElementById('app-description').style.display = 'none';
    document.getElementById('start-chat').style.display = 'none';
    document.getElementById('features-description').style.display = 'none';
    document.getElementById('chat-container').style.display = 'none';
    document.getElementById('back-btn-ai').style.display = 'block';
    document.getElementById('main-buttons').style.display = 'none';

    const chatContainer = document.getElementById('ai-chat-container');
    const inputContainer = document.getElementById('ai-input-container');
    
    chatContainer.style.display = 'block';
    inputContainer.style.display = 'flex'; 

    document.getElementById('user-input').focus();

    const chatMessages = document.getElementById('ai-chat-messages');
    chatMessages.innerHTML = '';

    const initialMessage = document.createElement('div');
    initialMessage.className = 'ai-message';
    initialMessage.textContent = "Hi there! I'm your heart health assistant. How can I help you today?";
    chatMessages.appendChild(initialMessage);

    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function handleAIConversation() {
    const userInput = document.getElementById('user-input');
    const chatMessages = document.getElementById('ai-chat-messages');

    if (userInput.value.trim() !== "") {
        const userMessage = document.createElement('div');
        userMessage.className = 'user-message';
        userMessage.textContent = userInput.value;
        chatMessages.appendChild(userMessage);

        userInput.value = '';
        userInput.disabled = true;

        chatMessages.scrollTop = chatMessages.scrollHeight;

        const typingMessage = document.createElement('div');
        typingMessage.className = 'ai-message typing-indicator';
        typingMessage.textContent = 'AI is thinking...';
        chatMessages.appendChild(typingMessage);

        fetch('/ai_chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ user_input: userMessage.textContent })
        })
        .then(response => response.json())
        .then(data => {
            chatMessages.removeChild(typingMessage);

            const aiMessage = document.createElement('div');
            aiMessage.className = 'ai-message';
            aiMessage.textContent = data.response;
            chatMessages.appendChild(aiMessage);

            chatMessages.scrollTop = chatMessages.scrollHeight;

            userInput.disabled = false;
            userInput.focus();
        })
        .catch(error => {
            console.error('Error:', error);
            chatMessages.removeChild(typingMessage);

            const errorMessage = document.createElement('div');
            errorMessage.className = 'ai-message error-message';
            errorMessage.textContent = 'Something went wrong. Please try again.';
            chatMessages.appendChild(errorMessage);

            userInput.disabled = false;
        });
    }
}

function resetUI() {
    // Check for the elements first
    const aiChatContainer = document.getElementById('ai-chat-container');
    const aiInputContainer = document.getElementById('ai-input-container');
    const aiInputContainerYes = document.getElementById('ai-input-container-yes');
    const backBtnAssessment = document.getElementById('back-btn-assessment');
    const backBtnAI = document.getElementById('back-btn-ai');
    const mainButtons = document.getElementById('main-buttons');
    const chatContainer = document.getElementById('chat-container');
    const appDescription = document.getElementById('app-description');

    // Hide all containers
    if (aiChatContainer) aiChatContainer.style.display = 'none';
    if (aiInputContainer) aiInputContainer.style.display = 'none';
    if (aiInputContainerYes) aiInputContainerYes.style.display = 'none';
    
    // Hide back buttons
    if (backBtnAssessment) backBtnAssessment.style.display = 'none';
    if (backBtnAI) backBtnAI.style.display = 'none';
    
    // Show main buttons
    if (mainButtons) mainButtons.style.display = 'flex';
    
    // Clear AI chat messages
    if (document.getElementById('ai-chat-messages')) {
        document.getElementById('ai-chat-messages').innerHTML = '';
    }

    // Show main UI elements
    if (chatContainer) chatContainer.style.display = 'block';
    if (appDescription) appDescription.style.display = 'block';

    // Clear previous content from chat-container
    Array.from(chatContainer.children).forEach(child => {
        if (child.id !== 'app-description') {
            child.remove();
        }
    });

    // Show initial elements
    if (document.getElementById('start-chat')) {
        document.getElementById('start-chat').style.display = 'inline-block';
    }
    if (document.getElementById('features-description')) {
        document.getElementById('features-description').style.display = 'inline-block';
    }
}

// Main function to navigate back
function backToMain() {
    resetUI(); // Reset the UI to the initial state

    // Reset global variables
    currentQuestion = 0; // Assuming this variable exists in your logic
    Object.keys(answers).forEach(key => delete answers[key]); // Clear answers
    predictionResult = null; // Reset prediction result
}