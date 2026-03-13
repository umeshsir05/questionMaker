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
    
    const icon = menuToggle.querySelector('i');
    if (navLinks.classList.contains('show')) {
        icon.classList.remove('fa-bars');
        icon.classList.add('fa-times');
    } else {
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
    }
});

// Close menu when clicking a link
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
    // Add sample questions with sub-questions
    addQuestion('short', [
        { text: 'What is the capital of India?', marks: 2 },
        { text: 'Name the national bird of India.', marks: 2 }
    ]);
    
    addQuestion('mcq', [
        { text: 'Which planet is known as the Red Planet?', marks: 1, options: ['Mars', 'Venus', 'Jupiter', 'Saturn'], correct: 0 },
        { text: 'What is the chemical symbol for water?', marks: 1, options: ['H2O', 'CO2', 'O2', 'NaCl'], correct: 0 }
    ]);
    
    addQuestion('long', [
        { text: 'Explain the process of photosynthesis.', marks: 5 },
        { text: 'Describe the water cycle.', marks: 5 }
    ]);
}

// Function to add a new question
function addQuestion(type = 'short', subQuestions = []) {
    questionCount++;
    const container = document.getElementById('questionsContainer');
    
    const questionDiv = document.createElement('div');
    questionDiv.className = 'question-item';
    questionDiv.id = `question-${questionCount}`;
    
    let questionHTML = `
        <div class="question-header">
            <span class="question-number">Question ${questionCount}</span>
            <div class="question-type-selector">
                <select onchange="changeQuestionType(${questionCount}, this.value)">
                    <option value="short" ${type === 'short' ? 'selected' : ''}>Short Answer</option>
                    <option value="long" ${type === 'long' ? 'selected' : ''}>Long Answer</option>
                    <option value="mcq" ${type === 'mcq' ? 'selected' : ''}>Multiple Choice Questions (MCQ)</option>
                    <option value="very-short" ${type === 'very-short' ? 'selected' : ''}>Very Short Answer</option>
                    <option value="fill-blanks" ${type === 'fill-blanks' ? 'selected' : ''}>Fill in the Blanks</option>
                    <option value="true-false" ${type === 'true-false' ? 'selected' : ''}>True/False</option>
                </select>
                <button type="button" class="btn-remove" onclick="removeQuestion(${questionCount})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `;
    
    // Add question input for main question (optional)
    if (type !== 'mcq') {
        questionHTML += `
            <input type="text" class="question-input" placeholder="Main question (optional)..." value="Section ${questionCount}">
        `;
    }
    
    // Add sub-questions section
    questionHTML += `
        <div class="subquestions-section" id="subquestions-${questionCount}">
            <div class="subquestions-header">
                <h4><i class="fas fa-list"></i> Sub-questions</h4>
                <button type="button" class="btn-add-subquestion" onclick="addSubQuestion(${questionCount})">
                    <i class="fas fa-plus"></i> Add Sub-question
                </button>
            </div>
            <div class="subquestions-container" id="subquestions-container-${questionCount}">
    `;
    
    // Add initial sub-questions if provided
    if (subQuestions.length > 0) {
        subQuestions.forEach((sq, index) => {
            if (type === 'mcq') {
                questionHTML += generateMCQSubQuestion(questionCount, index + 1, sq);
            } else {
                questionHTML += generateNormalSubQuestion(questionCount, index + 1, sq);
            }
        });
    } else {
        // Add one default sub-question
        if (type === 'mcq') {
            questionHTML += generateMCQSubQuestion(questionCount, 1, { text: 'Sample MCQ question?', marks: 1, options: ['Option 1', 'Option 2', 'Option 3', 'Option 4'], correct: 0 });
        } else {
            questionHTML += generateNormalSubQuestion(questionCount, 1, { text: 'Sample sub-question?', marks: 2 });
        }
    }
    
    questionHTML += `
            </div>
        </div>
    `;
    
    questionDiv.innerHTML = questionHTML;
    container.appendChild(questionDiv);
}

// Generate normal sub-question HTML
function generateNormalSubQuestion(questionId, subId, data = {}) {
    return `
        <div class="subquestion-item" id="subq-${questionId}-${subId}">
            <input type="text" placeholder="Sub-question ${subId}" value="${data.text || ''}">
            <input type="number" class="subquestion-marks" placeholder="Marks" value="${data.marks || 2}" min="0.5" step="0.5">
            <button type="button" class="subquestion-remove" onclick="removeSubQuestion(${questionId}, ${subId})">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
}

// Generate MCQ sub-question HTML
function generateMCQSubQuestion(questionId, subId, data = {}) {
    let options = data.options || ['', '', '', ''];
    let correctIndex = data.correct || 0;
    
    let optionsHTML = '';
    options.forEach((opt, idx) => {
        optionsHTML += `
            <div class="mcq-option-item">
                <input type="text" placeholder="Option ${idx + 1}" value="${opt}">
                <input type="radio" name="correct-${questionId}-${subId}" value="${idx}" ${idx === correctIndex ? 'checked' : ''}>
                <span>Correct</span>
            </div>
        `;
    });
    
    return `
        <div class="subquestion-item" id="subq-${questionId}-${subId}">
            <input type="text" placeholder="MCQ Question" value="${data.text || ''}">
            <input type="number" class="subquestion-marks" placeholder="Marks" value="${data.marks || 1}" min="0.5" step="0.5">
            <button type="button" class="subquestion-remove" onclick="removeSubQuestion(${questionId}, ${subId})">
                <i class="fas fa-times"></i>
            </button>
            <div class="mcq-options">
                ${optionsHTML}
            </div>
        </div>
    `;
}

// Change question type
window.changeQuestionType = function(questionId, type) {
    const container = document.getElementById(`subquestions-container-${questionId}`);
    const subQuestions = container.querySelectorAll('.subquestion-item');
    
    // Convert existing sub-questions to new type
    subQuestions.forEach((sq, index) => {
        const subId = index + 1;
        const text = sq.querySelector('input[type="text"]')?.value || '';
        const marks = sq.querySelector('.subquestion-marks')?.value || 2;
        
        if (type === 'mcq') {
            // Convert to MCQ
            const mcqHTML = generateMCQSubQuestion(questionId, subId, { text, marks, options: ['', '', '', ''], correct: 0 });
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = mcqHTML;
            sq.replaceWith(tempDiv.firstChild);
        } else {
            // Convert to normal sub-question
            const normalHTML = generateNormalSubQuestion(questionId, subId, { text, marks });
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = normalHTML;
            sq.replaceWith(tempDiv.firstChild);
        }
    });
};

// Add sub-question
window.addSubQuestion = function(questionId) {
    const container = document.getElementById(`subquestions-container-${questionId}`);
    const subCount = container.children.length + 1;
    
    // Check question type
    const questionType = document.querySelector(`#question-${questionId} select`).value;
    
    let subHTML;
    if (questionType === 'mcq') {
        subHTML = generateMCQSubQuestion(questionId, subCount, { text: '', marks: 1, options: ['', '', '', ''], correct: 0 });
    } else {
        subHTML = generateNormalSubQuestion(questionId, subCount, { text: '', marks: 2 });
    }
    
    container.insertAdjacentHTML('beforeend', subHTML);
};

// Remove sub-question
window.removeSubQuestion = function(questionId, subId) {
    const subQuestion = document.getElementById(`subq-${questionId}-${subId}`);
    if (subQuestion) {
        subQuestion.remove();
        // Renumber remaining sub-questions
        renumberSubQuestions(questionId);
    }
};

// Renumber sub-questions after removal
function renumberSubQuestions(questionId) {
    const container = document.getElementById(`subquestions-container-${questionId}`);
    const subQuestions = container.querySelectorAll('.subquestion-item');
    
    subQuestions.forEach((sq, index) => {
        const newId = index + 1;
        sq.id = `subq-${questionId}-${newId}`;
        
        // Update remove button onclick
        const removeBtn = sq.querySelector('.subquestion-remove');
        removeBtn.setAttribute('onclick', `removeSubQuestion(${questionId}, ${newId})`);
        
        // Update radio names for MCQ
        const radios = sq.querySelectorAll('input[type="radio"]');
        radios.forEach(radio => {
            radio.name = `correct-${questionId}-${newId}`;
        });
    });
}

// Remove main question
window.removeQuestion = function(id) {
    const question = document.getElementById(`question-${id}`);
    if (question) {
        question.remove();
        renumberQuestions();
    }
};

// Renumber main questions
function renumberQuestions() {
    const questions = document.querySelectorAll('.question-item');
    questionCount = questions.length;
    
    questions.forEach((question, index) => {
        const newId = index + 1;
        question.id = `question-${newId}`;
        
        // Update question number display
        const numberSpan = question.querySelector('.question-number');
        numberSpan.textContent = `Question ${newId}`;
        
        // Update remove button
        const removeBtn = question.querySelector('.btn-remove');
        removeBtn.setAttribute('onclick', `removeQuestion(${newId})`);
        
        // Update sub-question container IDs
        const subContainer = question.querySelector('.subquestions-container');
        if (subContainer) {
            subContainer.id = `subquestions-container-${newId}`;
            
            // Update all sub-question references
            const subQuestions = subContainer.querySelectorAll('.subquestion-item');
            subQuestions.forEach((sq, sqIndex) => {
                const oldId = sq.id.split('-').pop();
                sq.id = `subq-${newId}-${sqIndex + 1}`;
                
                // Update remove button
                const removeSubBtn = sq.querySelector('.subquestion-remove');
                removeSubBtn.setAttribute('onclick', `removeSubQuestion(${newId}, ${sqIndex + 1})`);
                
                // Update radio names
                const radios = sq.querySelectorAll('input[type="radio"]');
                radios.forEach(radio => {
                    radio.name = `correct-${newId}-${sqIndex + 1}`;
                });
            });
        }
        
        // Update add sub-question button
        const addSubBtn = question.querySelector('.btn-add-subquestion');
        if (addSubBtn) {
            addSubBtn.setAttribute('onclick', `addSubQuestion(${newId})`);
        }
        
        // Update question type selector
        const typeSelect = question.querySelector('select');
        if (typeSelect) {
            typeSelect.setAttribute('onchange', `changeQuestionType(${newId}, this.value)`);
        }
    });
}

// Add question button
document.getElementById('addQuestionBtn').addEventListener('click', () => {
    addQuestion('short', []);
});

// Preview functionality
const previewBtn = document.getElementById('previewBtn');
const previewSection = document.getElementById('previewSection');
const closePreview = document.getElementById('closePreview');
const paperPreview = document.getElementById('paperPreview');

previewBtn.addEventListener('click', () => {
    generatePreview();
    previewSection.classList.add('show');
    
    if (window.innerWidth <= 768) {
        previewSection.scrollIntoView({ behavior: 'smooth' });
    }
});

closePreview.addEventListener('click', () => {
    previewSection.classList.remove('show');
});

// Generate preview
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
    
    questions.forEach((question, qIndex) => {
        const mainQuestionText = question.querySelector('.question-input')?.value || '';
        const questionType = question.querySelector('select').value;
        const typeText = question.querySelector('select option:checked').text;
        
        let questionBlock = '';
        
        if (mainQuestionText) {
            questionBlock += `<p><strong>Section ${qIndex + 1}:</strong> ${mainQuestionText}</p>`;
        }
        
        // Add sub-questions
        const subQuestions = question.querySelectorAll('.subquestion-item');
        if (subQuestions.length > 0) {
            questionBlock += `<div style="margin-left: 20px; margin-top: 10px;">`;
            
            subQuestions.forEach((sub, sqIndex) => {
                const subText = sub.querySelector('input[type="text"]')?.value || '';
                const marks = sub.querySelector('.subquestion-marks')?.value || '';
                
                if (questionType === 'mcq') {
                    // Get MCQ options
                    const options = sub.querySelectorAll('.mcq-option-item input[type="text"]');
                    const correctRadio = sub.querySelector('input[type="radio"]:checked');
                    const correctIndex = correctRadio ? correctRadio.value : 0;
                    
                    let optionsText = '';
                    options.forEach((opt, optIndex) => {
                        const prefix = optIndex == correctIndex ? '✓ ' : '• ';
                        optionsText += `<br>${prefix}${opt.value || `Option ${optIndex + 1}`}`;
                    });
                    
                    questionBlock += `
                        <div style="margin-bottom: 15px; padding: 10px; background: var(--subquestion-bg); border-radius: 5px;">
                            <p><strong>${sqIndex + 1}.</strong> ${subText}</p>
                            <p style="color: var(--text-secondary); font-size: 0.9rem;">[${marks} marks]</p>
                            <div style="margin-left: 20px; font-size: 0.95rem;">Options:${optionsText}</div>
                        </div>
                    `;
                } else {
                    questionBlock += `
                        <div style="margin-bottom: 10px;">
                            <p><strong>${sqIndex + 1}.</strong> ${subText} <span style="color: var(--text-secondary); font-size: 0.9rem;">[${marks} marks]</span></p>
                        </div>
                    `;
                }
            });
            
            questionBlock += `</div>`;
        }
        
        if (questionBlock) {
            questionsHTML += `
                <div style="margin-bottom: 25px; padding: 15px; border-left: 3px solid var(--accent-color);">
                    <p style="font-weight: bold; margin-bottom: 10px;">Question ${qIndex + 1} (${typeText})</p>
                    ${questionBlock}
                </div>
            `;
        }
    });
    
    const previewHTML = `
        <div style="text-align: center; margin-bottom: 30px;">
            <h2 style="color: var(--accent-color);">${schoolName}</h2>
            <h3>${subject} - Class ${className}</h3>
            <div style="display: flex; justify-content: center; gap: 30px; margin-top: 10px;">
                <p><strong>Time:</strong> ${time}</p>
                <p><strong>Max Marks:</strong> ${maxMarks}</p>
                <p><strong>Date:</strong> ${new Date(date).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                })}</p>
            </div>
        </div>
        
        <div style="margin-bottom: 30px; padding: 15px; background: var(--subquestion-bg); border-radius: 8px;">
            <h4 style="color: var(--accent-color); margin-bottom: 10px;">General Instructions:</h4>
            <p style="white-space: pre-line;">${instructions}</p>
        </div>
        
        <div>
            <h4 style="color: var(--accent-color); margin-bottom: 20px; text-align: center;">SECTION A: Answer the following questions</h4>
            ${questionsHTML || '<p style="text-align: center;">No questions added yet.</p>'}
        </div>
        
        <div style="margin-top: 40px; display: flex; justify-content: space-between;">
            <p>_______________<br>Examiner's Signature</p>
            <p>_______________<br>Controller of Examinations</p>
        </div>
    `;
    
    paperPreview.innerHTML = previewHTML;
}

// Save functionality
document.getElementById('saveBtn').addEventListener('click', () => {
    generatePreview();
    
    // Calculate total marks
    let totalMarks = 0;
    const allMarks = document.querySelectorAll('.subquestion-marks');
    allMarks.forEach(mark => {
        totalMarks += parseFloat(mark.value) || 0;
    });
    
    alert(`Paper saved successfully!\nTotal Questions: ${document.querySelectorAll('.question-item').length}\nTotal Sub-questions: ${document.querySelectorAll('.subquestion-item').length}\nTotal Marks: ${totalMarks}`);
});

// Handle window resize
window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
        navLinks.classList.remove('show');
        const icon = menuToggle.querySelector('i');
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
    }
});

// Initialize with sample questions
addInitialQuestions();