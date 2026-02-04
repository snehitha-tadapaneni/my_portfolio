/**
 * Personal AI Assistant
 * Floating chat widget that answers questions using local JSON knowledge.
 */

let knowledgeBase = {};
const chatMessages = document.getElementById('chat-messages');
const chatInput = document.getElementById('chat-input');
const chatWidget = document.getElementById('chat-widget');
const chatToggleBtn = document.getElementById('chat-toggle-btn');
const closeChatBtn = document.getElementById('close-chat-btn');
const suggestionChips = document.querySelectorAll('.suggestion-chip');

// Initialize
async function initAssistant() {
    try {
        const response = await fetch('assets/data/portfolio_knowledge.json');
        if (!response.ok) throw new Error('Network response was not ok');
        knowledgeBase = await response.json();
    } catch (error) {
        console.error('Failed to load portfolio knowledge:', error);

        // Handle file:// protocol restriction
        if (window.location.protocol === 'file:') {
            addMessage('system', '<strong>Note:</strong> The AI brain cannot interpret the knowledge file when opened directly as a file (CORS restriction). <br>Please view this on a local server or GitHub Pages to enable the AI.');
        } else {
            addMessage('system', 'Sorry, I am having trouble accessing my memory right now.');
        }
    }
}

// Toggle Chat
if (chatToggleBtn && chatWidget) {
    chatToggleBtn.addEventListener('click', () => {
        chatWidget.classList.toggle('open');
        if (chatWidget.classList.contains('open') && Object.keys(knowledgeBase).length === 0) {
            initAssistant();
        }
    });
}

if (closeChatBtn) {
    closeChatBtn.addEventListener('click', () => {
        chatWidget.classList.remove('open');
    });
}

// Send Message Logic
async function handleUserMessage(message) {
    addMessage('user', message);

    // Simulate typing delay
    showTypingIndicator();

    setTimeout(() => {
        removeTypingIndicator();
        const response = generateResponse(message);
        addMessage('bot', response);
    }, 800);
}

// Input Handling
if (chatInput) {
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && chatInput.value.trim() !== "") {
            handleUserMessage(chatInput.value.trim());
            chatInput.value = "";
        }
    });
}

// Chips Handling
suggestionChips.forEach(chip => {
    chip.addEventListener('click', () => {
        const text = chip.getAttribute('data-question');
        handleUserMessage(text);
    });
});

// UI Helper: Add Message
function addMessage(sender, text) {
    const msgDiv = document.createElement('div');
    msgDiv.classList.add('message', sender);
    msgDiv.innerHTML = text; // Allow HTML for links
    chatMessages.appendChild(msgDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// UI Helper: Typing Indicator
function showTypingIndicator() {
    const indicator = document.createElement('div');
    indicator.id = 'typing-indicator';
    indicator.classList.add('message', 'bot', 'typing');
    indicator.innerHTML = '<span>.</span><span>.</span><span>.</span>';
    chatMessages.appendChild(indicator);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function removeTypingIndicator() {
    const indicator = document.getElementById('typing-indicator');
    if (indicator) indicator.remove();
}

// Logic: Generate Response
function generateResponse(input) {
    input = input.toLowerCase();

    // 1. Elevator Pitch / Summary
    if (input.includes('summarize') || input.includes('summary') || input.includes('about you') || input.includes('who are you') || input.includes('20 seconds')) {
        return knowledgeBase.bio.short + " <br><br><strong>Want the full elevator pitch?</strong>";
    }
    if (input.includes('elevator pitch') || input.includes('pitch')) {
        return knowledgeBase.bio.elevator_pitch;
    }

    // 2. Skills
    if (input.includes('skill') || input.includes('stack') || input.includes('technologies') || input.includes('strongest')) {
        return `My top skills are: <strong>${knowledgeBase.skills.top.join(', ')}</strong>. <br><br>I also work with ${knowledgeBase.skills.tools.join(', ')} and libraries like ${knowledgeBase.skills.libraries.slice(0, 5).join(', ')}.`;
    }

    // 3. Projects retrieval - IMPROVED
    if (input.includes('project') || input.includes('work') || input.includes('built')) {
        // Specific category searches
        if (input.includes('ml') || input.includes('machine learning')) {
            const matching = knowledgeBase.projects.filter(p => p.category === 'Machine Learning');
            return "Here are my <strong>Machine Learning</strong> projects:<br>" + formatProjectList(matching);
        }
        if (input.includes('genai') || input.includes('gen ai') || input.includes('llm') || input.includes('rag')) {
            const matching = knowledgeBase.projects.filter(p => p.category === 'GenAI');
            return "Here are my <strong>GenAI</strong> projects:<br>" + formatProjectList(matching);
        }
        if (input.includes('nlp') || input.includes('natural language')) {
            const matching = knowledgeBase.projects.filter(p => p.category === 'NLP');
            return "Here are my <strong>NLP</strong> projects:<br>" + formatProjectList(matching);
        }
        if (input.includes('viz') || input.includes('visual') || input.includes('dashboard') || input.includes('tableau')) {
            const matching = knowledgeBase.projects.filter(p => p.category === 'Visualization' || p.technologies.includes('Tableau'));
            return "Here are my <strong>Visualization</strong> projects:<br>" + formatProjectList(matching);
        }
        if (input.includes('deep learning') || input.includes('neural')) {
            const matching = knowledgeBase.projects.filter(p => p.category === 'Deep Learning');
            return "Here are my <strong>Deep Learning</strong> projects:<br>" + formatProjectList(matching);
        }

        // Default: list all
        return "Here are some of my key projects:<br>" + formatProjectList(knowledgeBase.projects.slice(0, 5)) + "<br><em>View all on the Projects page!</em>";
    }

    // 4. Experience
    if (input.includes('experience') || input.includes('work') || input.includes('job') || input.includes('intern')) {
        return "Here's my experience:<br>" + formatExperienceList(knowledgeBase.experience);
    }

    // 5. Education
    if (input.includes('education') || input.includes('degree') || input.includes('university') || input.includes('gpa')) {
        return "My education:<br>" + formatEducationList(knowledgeBase.education);
    }

    // 6. Contact
    if (input.includes('contact') || input.includes('email') || input.includes('reach')) {
        return "You can reach me at <strong>snehithat001@gmail.com</strong> or on <a href='https://www.linkedin.com/in/snehithatadapaneni/' target='_blank'>LinkedIn</a>.";
    }

    // Default Fallback
    return "I'm trained on Snehitha's professional background. Try asking about her <strong>skills</strong>, <strong>projects</strong>, <strong>experience</strong>, or for a <strong>summary</strong>!";
}

function formatProjectList(projects) {
    return projects.map(p => {
        const link = p.link ? `<a href="${p.link}" target="_blank">GitHub</a>` : 'Private';
        return `- <strong>${p.name}</strong>: ${p.summary} (${link})`;
    }).join('<br>');
}

function formatExperienceList(experiences) {
    return experiences.map(e =>
        `- <strong>${e.role}</strong> at ${e.company} (${e.dates})<br>&nbsp;&nbsp;${e.summary}`
    ).join('<br><br>');
}

function formatEducationList(education) {
    return education.map(e =>
        `- <strong>${e.degree}</strong> from ${e.school} (${e.year})<br>&nbsp;&nbsp;GPA: ${e.gpa}`
    ).join('<br><br>');
}
