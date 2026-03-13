// Dark Mode Toggle
const themeToggle = document.getElementById('themeToggle');
const body = document.body;

// Check for saved theme preference
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
    body.classList.add('dark-mode');
    themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
}

themeToggle.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    
    if (body.classList.contains('dark-mode')) {
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        localStorage.setItem('theme', 'dark');
    } else {
        themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        localStorage.setItem('theme', 'light');
    }
});

// Mobile Menu Toggle
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');

menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('show');
    
    // Change icon based on menu state
    const icon = menuToggle.querySelector('i');
    if (navLinks.classList.contains('show')) {
        icon.classList.remove('fa-bars');
        icon.classList.add('fa-times');
    } else {
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
    }
});

// Close menu when clicking a link (for mobile)
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('show');
        const icon = menuToggle.querySelector('i');
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
    });
});

// Question Paper Maker Logic
let questionCount = 0;

// Add initial questions
function addInitialQuestions() {
    for (let i = 1; i <= 3; i++) {
        addQuestion();
    }
}

// Function to add a new question
function addQuestion() {
    questionCount++;
    const container = document.getElementById('questionsContainer');
    
    const questionDiv = document.createElement('div');
    questionDiv.className = 'question-item';
    questionDiv.id = `question-${questionCount}`;
    
    questionDiv.innerHTML = `
        <div class="question-header">
            <span class="question-number">Question ${questionCount}</span>
            <button type="button" class="btn-remove" onclick="removeQuestion(${questionCount})">
                <i class="fas fa-trash"></i>
            </button>
        </div>
        <input type="text" class="question-input" placeholder="Enter your question here..." value="Sample Question ${questionCount}">
        <div class="question-options">
            <div>
                <label>Marks:</label>
                <input type="number" value="5" min="1" max="20">
            </div>
            <div>
                <label>Type:</label>
                <select>
                    <option value="short">Short Answer</option>
                    <option value="long">Long Answer</option>
                    <option value="mcq">MCQ</option>
                    <option value="very-short">Very Short</option>
                </select>
            </div>
        </div>
    `;
    
    container.appendChild(questionDiv);
}

// Function to remove a question
window.removeQuestion = function(id) {
    const question = document.getElementById(`question-${id}`);
    if (question) {
        question.remove();
        updateQuestionNumbers();
    }
};

// Update question numbers after removal
function updateQuestionNumbers() {
    const questions = document.querySelectorAll('.question-item');
    questionCount = questions.length;
    
    questions.forEach((question, index) => {
        const numberSpan = question.querySelector('.question-number');
        numberSpan.textContent = `Question ${index + 1}`;
        question.id = `question-${index + 1}`;
        
        // Update remove button onclick
        const removeBtn = question.querySelector('.btn-remove');
        removeBtn.setAttribute('onclick', `removeQuestion(${index + 1})`);
    });
}

// Add question button event listener
document.getElementById('addQuestionBtn').addEventListener('click', addQuestion);

// Preview functionality
const previewBtn = document.getElementById('previewBtn');
const previewSection = document.getElementById('previewSection');
const closePreview = document.getElementById('closePreview');
const paperPreview = document.getElementById('paperPreview');

previewBtn.addEventListener('click', () => {
    generatePreview();
    previewSection.classList.add('show');
    
    // Scroll to preview on mobile
    if (window.innerWidth <= 768) {
        previewSection.scrollIntoView({ behavior: 'smooth' });
    }
});

closePreview.addEventListener('click', () => {
    previewSection.classList.remove('show');
});

// Generate preview content
function generatePreview() {
    const schoolName = document.getElementById('schoolName').value;
    const subject = document.getElementById('subject').value;
    const className = document.getElementById('class').value;
    const time = document.getElementById('time').value;
    const maxMarks = document.getElementById('maxMarks').value;
    const date = document.getElementById('date').value;
    const instructions = document.getElementById('instructions').value;
    
    let questionsHTML = '';
    const questions = document.querySelectorAll('.question-item');
    
    questions.forEach((question, index) => {
        const questionText = question.querySelector('.question-input').value;
        const marks = question.querySelector('.question-options input').value;
        const type = question.querySelector('.question-options select').value;
        
        let typeText = '';
        switch(type) {
            case 'short': typeText = 'Short Answer'; break;
            case 'long': typeText = 'Long Answer'; break;
            case 'mcq': typeText = 'Multiple Choice'; break;
            case 'very-short': typeText = 'Very Short Answer'; break;
        }
        
        questionsHTML += `
            <div style="margin-bottom: 20px; padding: 10px; border-left: 3px solid var(--accent-color);">
                <p><strong>Q${index + 1}.</strong> ${questionText}</p>
                <p style="color: var(--text-secondary); font-size: 0.9rem;">
                    [${marks} marks] [${typeText}]
                </p>
            </div>
        `;
    });
    
    const previewHTML = `
        <div style="text-align: center; margin-bottom: 30px;">
            <h2 style="color: var(--accent-color);">${schoolName}</h2>
            <h3>${subject} - Class ${className}</h3>
            <p>Time: ${time} | Max Marks: ${maxMarks}</p>
            <p>Date: ${new Date(date).toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            })}</p>
        </div>
        
        <div style="margin-bottom: 30px;">
            <h4 style="color: var(--accent-color);">General Instructions:</h4>
            <p style="white-space: pre-line;">${instructions}</p>
        </div>
        
        <div>
            <h4 style="color: var(--accent-color); margin-bottom: 20px;">SECTION A: Answer the following questions</h4>
            ${questionsHTML}
        </div>
        
        <div style="margin-top: 40px; text-align: right;">
            <p>_______________</p>
            <p>Examiner's Signature</p>
        </div>
    `;
    
    paperPreview.innerHTML = previewHTML;
}

// Save as PDF functionality (simulated)
document.getElementById('saveBtn').addEventListener('click', () => {
    generatePreview();
    
    // Show success message
    alert('Paper saved successfully! (PDF download feature can be added with libraries like jsPDF)');
    
    // In a real application, you would use a library like jsPDF
    // Example: const { jsPDF } = window.jspdf;
});

// Initialize with sample questions
addInitialQuestions();

// Handle window resize for mobile menu
window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
        navLinks.classList.remove('show');
        const icon = menuToggle.querySelector('i');
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
    }
});

// Active link highlighting
const sections = document.querySelectorAll('section');
const navItems = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= sectionTop - 60) {
            current = section.getAttribute('id');
        }
    });
    
    navItems.forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('href').slice(1) === current) {
            item.classList.add('active');
        }
    });
});

// Form validation
document.getElementById('paperForm').addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Basic validation
    const schoolName = document.getElementById('schoolName').value;
    const subject = document.getElementById('subject').value;
    
    if (!schoolName || !subject) {
        alert('Please fill in all required fields');
        return;
    }
    
    // Show preview on successful validation
    generatePreview();
    previewSection.classList.add('show');
});
