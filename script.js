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

// ============ DYNAMIC SECTION MANAGEMENT ============

let sectionCount = 0;
const sectionsContainer = document.getElementById('sectionsContainer');

// Add Section Button
document.getElementById('addSectionBtn').addEventListener('click', () => {
    addNewSection();
});

// Function to add new section
function addNewSection(sectionData = null) {
    sectionCount++;
    const sectionId = `section-${sectionCount}`;
    
    const sectionCard = document.createElement('div');
    sectionCard.className = 'section-card';
    sectionCard.id = sectionId;
    
    // Default values or from sectionData
    const sectionName = sectionData?.name || `Section ${String.fromCharCode(64 + sectionCount)}`;
    const sectionType = sectionData?.type || 'short';
    const marksPerQuestion = sectionData?.marksPerQuestion || 2;
    const totalQuestions = sectionData?.questions?.length || 0;
    
    sectionCard.innerHTML = `
        <div class="section-header">
            <div class="section-title">
                <input type="text" class="section-name" value="${sectionName}" placeholder="Section Name">
                <select class="section-type" onchange="updateSectionType('${sectionId}', this.value)">
                    <option value="short" ${sectionType === 'short' ? 'selected' : ''}>Short Answer Questions</option>
                    <option value="long" ${sectionType === 'long' ? 'selected' : ''}>Long Answer Questions</option>
                    <option value="mcq" ${sectionType === 'mcq' ? 'selected' : ''}>Multiple Choice Questions (MCQ)</option>
                    <option value="very-short" ${sectionType === 'very-short' ? 'selected' : ''}>Very Short Answer</option>
                    <option value="fill-blanks" ${sectionType === 'fill-blanks' ? 'selected' : ''}>Fill in the Blanks</option>
                    <option value="true-false" ${sectionType === 'true-false' ? 'selected' : ''}>True/False</option>
                    <option value="match" ${sectionType === 'match' ? 'selected' : ''}>Match the Following</option>
                    <option value="assertion" ${sectionType === 'assertion' ? 'selected' : ''}>Assertion-Reason</option>
                </select>
            </div>
            <button type="button" class="btn-remove-section" onclick="removeSection('${sectionId}')">
                <i class="fas fa-trash"></i> Remove Section
            </button>
        </div>
        
        <div class="section-config">
            <div class="config-item">
                <label><i class="fas fa-coins"></i> Marks per Question</label>
                <input type="number" class="marks-per-question" value="${marksPerQuestion}" min="0.5" step="0.5" onchange="updateSectionMarks('${sectionId}')">
            </div>
            <div class="config-item">
                <label><i class="fas fa-hashtag"></i> Total Questions</label>
                <input type="number" class="total-questions" value="${totalQuestions}" readonly>
            </div>
            <div class="config-item">
                <label><i class="fas fa-calculator"></i> Section Marks</label>
                <input type="number" class="section-marks" value="0" readonly>
            </div>
        </div>
        
        <div class="section-questions">
            <div class="questions-header">
                <h4><i class="fas fa-list"></i> Questions</h4>
                <button type="button" class="btn-add-question" onclick="addQuestion('${sectionId}')">
                    <i class="fas fa-plus"></i> Add Question
                </button>
            </div>
            <div class="questions-container" id="questions-${sectionId}">
                <!-- Questions will be added here -->
            </div>
        </div>
        
        <div class="section-stats">
            <div class="stat-item">
                <i class="fas fa-question-circle"></i> Questions: <span class="stat-value" id="stats-questions-${sectionId}">0</span>
            </div>
            <div class="stat-item">
                <i class="fas fa-star"></i> Section Marks: <span class="stat-value" id="stats-marks-${sectionId}">0</span>
            </div>
        </div>
    `;
    
    sectionsContainer.appendChild(sectionCard);
    
    // Add initial questions if provided
    if (sectionData?.questions) {
        sectionData.questions.forEach(q => {
            addQuestion(sectionId, q.text, q.marks);
        });
    } else {
        // Add 2 default questions
        for (let i = 1; i <= 2; i++) {
            addQuestion(sectionId, `Sample question ${i}`, marksPerQuestion);
        }
    }
    
    updateSectionStats(sectionId);
}

// Function to add question to a section
window.addQuestion = function(sectionId, questionText = '', marks = null) {
    const container = document.getElementById(`questions-${sectionId}`);
    const questionCount = container.children.length + 1;
    const sectionCard = document.getElementById(sectionId);
    const marksPerQuestion = marks || parseFloat(sectionCard.querySelector('.marks-per-question').value) || 2;
    
    const questionRow = document.createElement('div');
    questionRow.className = 'question-row';
    questionRow.id = `q-${sectionId}-${questionCount}`;
    
    // Check if section is MCQ
    const sectionType = sectionCard.querySelector('.section-type').value;
    
    let questionHTML = `
        <span class="question-number">Q${questionCount}.</span>
        <input type="text" class="question-text" placeholder="Enter your question here..." value="${questionText}">
        <input type="number" class="question-marks" value="${marksPerQuestion}" min="0.5" step="0.5">
        <button type="button" class="btn-remove-question" onclick="removeQuestion('${sectionId}', ${questionCount})">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    // Add MCQ options if section type is MCQ
    if (sectionType === 'mcq') {
        questionHTML += `
            <div class="mcq-options-container" id="options-${sectionId}-${questionCount}">
                <div class="mcq-option-row">
                    <input type="text" placeholder="Option A" value="Option 1">
                    <input type="radio" name="correct-${sectionId}-${questionCount}" value="0" checked>
                    <span>Correct</span>
                </div>
                <div class="mcq-option-row">
                    <input type="text" placeholder="Option B" value="Option 2">
                    <input type="radio" name="correct-${sectionId}-${questionCount}" value="1">
                    <span>Correct</span>
                </div>
                <div class="mcq-option-row">
                    <input type="text" placeholder="Option C" value="Option 3">
                    <input type="radio" name="correct-${sectionId}-${questionCount}" value="2">
                    <span>Correct</span>
                </div>
                <div class="mcq-option-row">
                    <input type="text" placeholder="Option D" value="Option 4">
                    <input type="radio" name="correct-${sectionId}-${questionCount}" value="3">
                    <span>Correct</span>
                </div>
                <button type="button" class="btn-add-option" onclick="addMCQOption('${sectionId}', ${questionCount})">
                    <i class="fas fa-plus"></i> Add Option
                </button>
            </div>
        `;
    }
    
    questionRow.innerHTML = questionHTML;
    container.appendChild(questionRow);
    
    // Add event listeners for marks change
    const marksInput = questionRow.querySelector('.question-marks');
    marksInput.addEventListener('change', () => updateSectionStats(sectionId));
    
    updateSectionStats(sectionId);
}

// Function to add MCQ option
window.addMCQOption = function(sectionId, questionNum) {
    const optionsContainer = document.getElementById(`options-${sectionId}-${questionNum}`);
    const optionCount = optionsContainer.children.length;
    
    const optionRow = document.createElement('div');
    optionRow.className = 'mcq-option-row';
    optionRow.innerHTML = `
        <input type="text" placeholder="Option ${String.fromCharCode(65 + optionCount - 1)}" value="Option ${optionCount}">
        <input type="radio" name="correct-${sectionId}-${questionNum}" value="${optionCount - 1}">
        <span>Correct</span>
    `;
    
    optionsContainer.insertBefore(optionRow, optionsContainer.lastElementChild);
}

// Function to remove question
window.removeQuestion = function(sectionId, questionNum) {
    const question = document.getElementById(`q-${sectionId}-${questionNum}`);
    if (question) {
        question.remove();
        renumberQuestions(sectionId);
        updateSectionStats(sectionId);
    }
}

// Renumber questions after removal
function renumberQuestions(sectionId) {
    const container = document.getElementById(`questions-${sectionId}`);
    const questions = container.querySelectorAll('.question-row');
    
    questions.forEach((q, index) => {
        const newNum = index + 1;
        q.id = `q-${sectionId}-${newNum}`;
        
        // Update question number display
        const numSpan = q.querySelector('.question-number');
        numSpan.textContent = `Q${newNum}.`;
        
        // Update remove button onclick
        const removeBtn = q.querySelector('.btn-remove-question');
        removeBtn.setAttribute('onclick', `removeQuestion('${sectionId}', ${newNum})`);
        
        // Update MCQ options container ID and radio names
        const optionsContainer = q.querySelector('.mcq-options-container');
        if (optionsContainer) {
            optionsContainer.id = `options-${sectionId}-${newNum}`;
            const radios = optionsContainer.querySelectorAll('input[type="radio"]');
            radios.forEach(radio => {
                radio.name = `correct-${sectionId}-${newNum}`;
            });
            
            // Update add option button onclick
            const addOptionBtn = optionsContainer.querySelector('.btn-add-option');
            if (addOptionBtn) {
                addOptionBtn.setAttribute('onclick', `addMCQOption('${sectionId}', ${newNum})`);
            }
        }
    });
}

// Function to remove entire section
window.removeSection = function(sectionId) {
    if (confirm('Kya aap is section ko delete karna chahte hain?')) {
        const section = document.getElementById(sectionId);
        section.remove();
        showNotification('Section deleted successfully!', 'success');
    }
}

// Update section type
window.updateSectionType = function(sectionId, type) {
    const sectionCard = document.getElementById(sectionId);
    const questions = sectionCard.querySelectorAll('.question-row');
    
    questions.forEach((q, index) => {
        const questionNum = index + 1;
        const optionsContainer = q.querySelector('.mcq-options-container');
        
        if (type === 'mcq' && !optionsContainer) {
            // Convert to MCQ - add options container
            const mcqHTML = `
                <div class="mcq-options-container" id="options-${sectionId}-${questionNum}">
                    <div class="mcq-option-row">
                        <input type="text" placeholder="Option A" value="Option 1">
                        <input type="radio" name="correct-${sectionId}-${questionNum}" value="0" checked>
                        <span>Correct</span>
                    </div>
                    <div class="mcq-option-row">
                        <input type="text" placeholder="Option B" value="Option 2">
                        <input type="radio" name="correct-${sectionId}-${questionNum}" value="1">
                        <span>Correct</span>
                    </div>
                    <div class="mcq-option-row">
                        <input type="text" placeholder="Option C" value="Option 3">
                        <input type="radio" name="correct-${sectionId}-${questionNum}" value="2">
                        <span>Correct</span>
                    </div>
                    <div class="mcq-option-row">
                        <input type="text" placeholder="Option D" value="Option 4">
                        <input type="radio" name="correct-${sectionId}-${questionNum}" value="3">
                        <span>Correct</span>
                    </div>
                    <button type="button" class="btn-add-option" onclick="addMCQOption('${sectionId}', ${questionNum})">
                        <i class="fas fa-plus"></i> Add Option
                    </button>
                </div>
            `;
            q.insertAdjacentHTML('beforeend', mcqHTML);
        } else if (type !== 'mcq' && optionsContainer) {
            // Remove MCQ options if converting from MCQ to other type
            optionsContainer.remove();
        }
    });
}

// Update section statistics
function updateSectionStats(sectionId) {
    const sectionCard = document.getElementById(sectionId);
    const questions = sectionCard.querySelectorAll('.question-row');
    const marksPerQuestion = parseFloat(sectionCard.querySelector('.marks-per-question').value) || 2;
    
    // Update total questions
    const totalQuestions = questions.length;
    sectionCard.querySelector('.total-questions').value = totalQuestions;
    
    // Calculate total marks
    let totalMarks = 0;
    questions.forEach(q => {
        const marks = parseFloat(q.querySelector('.question-marks').value) || 0;
        totalMarks += marks;
    });
    
    sectionCard.querySelector('.section-marks').value = totalMarks;
    
    // Update stats display
    document.getElementById(`stats-questions-${sectionId}`).textContent = totalQuestions;
    document.getElementById(`stats-marks-${sectionId}`).textContent = totalMarks;
}

// Update section marks when marks per question changes
window.updateSectionMarks = function(sectionId) {
    const sectionCard = document.getElementById(sectionId);
    const marksPerQuestion = parseFloat(sectionCard.querySelector('.marks-per-question').value) || 2;
    const questions = sectionCard.querySelectorAll('.question-row');
    
    questions.forEach(q => {
        const marksInput = q.querySelector('.question-marks');
        marksInput.value = marksPerQuestion;
    });
    
    updateSectionStats(sectionId);
}

// ============ PREVIEW FUNCTIONALITY ============

document.getElementById('previewBtn').addEventListener('click', generatePreview);
document.getElementById('closePreview').addEventListener('click', () => {
    document.getElementById('previewSection').classList.remove('show');
});

function generatePreview() {
    const schoolName = document.getElementById('schoolName').value;
    const subject = document.getElementById('subject').value;
    const className = document.getElementById('class').value;
    const time = document.getElementById('time').value;
    const maxMarks = document.getElementById('maxMarks').value;
    const date = document.getElementById('date').value;
    const instructions = document.getElementById('instructions').value;
    
    let sectionsHTML = '';
    let totalMarks = 0;
    
    const sections = document.querySelectorAll('.section-card');
    
    sections.forEach((section, sectionIndex) => {
        const sectionName = section.querySelector('.section-name').value;
        const sectionType = section.querySelector('.section-type').value;
        const sectionTypeText = section.querySelector('.section-type option:checked').text;
        const questions = section.querySelectorAll('.question-row');
        
        if (questions.length === 0) return;
        
        let questionsHTML = '';
        let sectionTotal = 0;
        
        questions.forEach((q, qIndex) => {
            const questionText = q.querySelector('.question-text').value;
            const marks = parseFloat(q.querySelector('.question-marks').value) || 0;
            sectionTotal += marks;
            
            let questionDisplay = '';
            
            if (sectionType === 'mcq') {
                // Get MCQ options
                const options = q.querySelectorAll('.mcq-option-row input[type="text"]');
                const correctRadio = q.querySelector('input[type="radio"]:checked');
                const correctIndex = correctRadio ? parseInt(correctRadio.value) : 0;
                
                let optionsList = '<div style="margin-left: 30px; margin-top: 5px;">';
                options.forEach((opt, optIndex) => {
                    const prefix = optIndex === correctIndex ? '✓ ' : '• ';
                    optionsList += `<div style="margin-bottom: 3px;">${prefix}${opt.value || `Option ${String.fromCharCode(65 + optIndex)}`}</div>`;
                });
                optionsList += '</div>';
                
                questionDisplay = `
                    <div style="margin-bottom: 15px;">
                        <p><strong>${qIndex + 1}.</strong> ${questionText} <span style="color: var(--text-secondary);">[${marks} marks]</span></p>
                        ${optionsList}
                    </div>
                `;
            } else {
                questionDisplay = `
                    <div style="margin-bottom: 10px;">
                        <p><strong>${qIndex + 1}.</strong> ${questionText} <span style="color: var(--text-secondary);">[${marks} marks]</span></p>
                    </div>
                `;
            }
            
            questionsHTML += questionDisplay;
        });
        
        totalMarks += sectionTotal;
        
        sectionsHTML += `
            <div style="margin-bottom: 30px; padding: 20px; background: var(--bg-secondary); border-radius: 10px;">
                <h3 style="color: var(--primary-color); margin-bottom: 15px; border-bottom: 2px solid var(--primary-color); padding-bottom: 10px;">
                    ${sectionName} - ${sectionTypeText} <span style="float: right; font-size: 1rem;">[${sectionTotal} Marks]</span>
                </h3>
                <div style="margin-left: 20px;">
                    ${questionsHTML}
                </div>
            </div>
        `;
    });
    
    const previewHTML = `
        <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: var(--primary-color);">${schoolName}</h1>
            <h2>${subject} - Class ${className}</h2>
            <div style="display: flex; justify-content: center; gap: 30px; margin: 15px 0;">
                <p><strong>Time:</strong> ${time}</p>
                <p><strong>Max Marks:</strong> ${maxMarks}</p>
                <p><strong>Total Marks in Paper:</strong> ${totalMarks}</p>
                <p><strong>Date:</strong> ${new Date(date).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                })}</p>
            </div>
        </div>
        
        <div style="margin-bottom: 30px; padding: 20px; background: var(--bg-secondary); border-radius: 10px;">
            <h3 style="color: var(--primary-color); margin-bottom: 10px;">General Instructions:</h3>
            <p style="white-space: pre-line;">${instructions}</p>
        </div>
        
        ${sectionsHTML}
        
        <div style="margin-top: 40px; display: flex; justify-content: space-between;">
            <div style="text-align: center;">
                <p>_________________________</p>
                <p><strong>Examiner's Signature</strong></p>
            </div>
            <div style="text-align: center;">
                <p>_________________________</p>
                <p><strong>Controller of Examinations</strong></p>
            </div>
        </div>
    `;
    
    document.getElementById('paperPreview').innerHTML = previewHTML;
    document.getElementById('previewSection').classList.add('show');
    
    // Show warning if total marks don't match
    if (totalMarks != maxMarks) {
        showNotification(`Warning: Total marks (${totalMarks}) don't match maximum marks (${maxMarks})`, 'warning');
    }
}

// ============ SAVE FUNCTIONALITY ============

document.getElementById('saveBtn').addEventListener('click', () => {
    generatePreview();
    
    // Calculate totals
    let totalQuestions = 0;
    let totalMarks = 0;
    
    document.querySelectorAll('.section-card').forEach(section => {
        const questions = section.querySelectorAll('.question-row').length;
        const marks = parseFloat(section.querySelector('.section-marks').value) || 0;
        totalQuestions += questions;
        totalMarks += marks;
    });
    
    showNotification(`
        Paper Saved Successfully!<br>
        Total Sections: ${document.querySelectorAll('.section-card').length}<br>
        Total Questions: ${totalQuestions}<br>
        Total Marks: ${totalMarks}
    `, 'success');
});

// ============ NOTIFICATION SYSTEM ============

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'warning' ? 'fa-exclamation-triangle' : 'fa-info-circle'}"></i>
        <span>${message}</span>
    `;
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? 'linear-gradient(135deg, #06d6a0 0%, #1b9aaa 100%)' : 
                     type === 'warning' ? 'linear-gradient(135deg, #ffb703 0%, #fb8500 100%)' : 
                     'linear-gradient(135deg, #4361ee 0%, #4cc9f0 100%)'};
        color: white;
        padding: 1rem 2rem;
        border-radius: 50px;
        box-shadow: var(--shadow-lg);
        z-index: 9999;
        display: flex;
        align-items: center;
        gap: 12px;
        animation: slideInRight 0.3s ease;
        font-weight: 500;
        border: 2px solid white;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 4000);
}

// ============ INITIALIZE WITH SAMPLE DATA ============

window.addEventListener('load', () => {
    // Add sample sections
    addNewSection({
        name: 'Section A - Multiple Choice Questions',
        type: 'mcq',
        marksPerQuestion: 1,
        questions: [
            { text: 'What is the capital of India?', marks: 1 },
            { text: 'Which planet is known as the Red Planet?', marks: 1 },
            { text: 'What is the chemical symbol for water?', marks: 1 }
        ]
    });
    
    addNewSection({
        name: 'Section B - Short Answer Questions',
        type: 'short',
        marksPerQuestion: 2,
        questions: [
            { text: 'Explain the process of photosynthesis.', marks: 2 },
            { text: 'What are the three states of matter?', marks: 2 },
            { text: 'Define renewable energy sources.', marks: 2 }
        ]
    });
    
    addNewSection({
        name: 'Section C - Long Answer Questions',
        type: 'long',
        marksPerQuestion: 5,
        questions: [
            { text: 'Describe the water cycle in detail.', marks: 5 },
            { text: 'Explain the causes and effects of global warming.', marks: 5 }
        ]
    });
});

// Add animation styles
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);