// [Previous code remains the same until the end, add these new functions after existing code]

// ============ NEW: Direct Question Input Functionality ============

// Parse questions from textarea
document.getElementById('parseQuestionsBtn').addEventListener('click', function() {
    const textarea = document.getElementById('directQuestions');
    const questions = textarea.value.split('\n').filter(q => q.trim() !== '');
    
    const category = document.getElementById('questionCategory').value;
    const marks = parseFloat(document.getElementById('marksPerQuestion').value) || 2;
    const sectionName = document.getElementById('sectionName').value || 'Section A';
    const startNumber = parseInt(document.getElementById('startNumber').value) || 1;
    
    // Update question count
    document.getElementById('questionCount').value = questions.length;
    
    if (questions.length === 0) {
        alert('Koi question nahi likha gaya!');
        return;
    }
    
    // Display parsed questions preview
    displayParsedQuestions(questions, category, marks, sectionName, startNumber);
});

// Display parsed questions in preview
function displayParsedQuestions(questions, category, marks, sectionName, startNumber) {
    const previewDiv = document.getElementById('parsedPreview');
    const listDiv = document.getElementById('parsedQuestionsList');
    
    let html = '<div class="parsed-questions-list">';
    
    questions.forEach((question, index) => {
        const qNumber = startNumber + index;
        html += `
            <div class="parsed-question-item">
                <span class="parsed-question-number">Q${qNumber}.</span>
                <span class="parsed-question-text">${question}</span>
                <span class="parsed-question-marks">${marks} marks</span>
            </div>
        `;
    });
    
    html += '</div>';
    listDiv.innerHTML = html;
    previewDiv.style.display = 'block';
    
    // Store parsed data for adding later
    previewDiv.dataset.questions = JSON.stringify(questions);
    previewDiv.dataset.category = category;
    previewDiv.dataset.marks = marks;
    previewDiv.dataset.sectionName = sectionName;
    previewDiv.dataset.startNumber = startNumber;
}

// Add all parsed questions to paper
document.getElementById('addAllQuestionsBtn').addEventListener('click', function() {
    const previewDiv = document.getElementById('parsedPreview');
    
    if (!previewDiv.dataset.questions) {
        alert('Pehle questions parse karein!');
        return;
    }
    
    const questions = JSON.parse(previewDiv.dataset.questions);
    const category = previewDiv.dataset.category;
    const marks = parseFloat(previewDiv.dataset.marks);
    const sectionName = previewDiv.dataset.sectionName;
    const startNumber = parseInt(previewDiv.dataset.startNumber);
    
    // Add main section question
    addQuestion(category, [], sectionName);
    
    // Get the newly added question
    const questions_container = document.getElementById('questionsContainer');
    const newQuestion = questions_container.lastElementChild;
    
    // Remove default sub-question
    const subContainer = newQuestion.querySelector('.subquestions-container');
    if (subContainer) {
        subContainer.innerHTML = '';
    }
    
    // Add all questions as sub-questions
    questions.forEach((qText, index) => {
        const subId = index + 1;
        
        if (category === 'mcq') {
            // For MCQ, add with default options
            const mcqHTML = generateMCQSubQuestion(
                parseInt(newQuestion.id.split('-')[1]), 
                subId, 
                { text: qText, marks: marks, options: ['', '', '', ''], correct: 0 }
            );
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = mcqHTML;
            subContainer.appendChild(tempDiv.firstChild);
        } else {
            // For normal questions
            const normalHTML = generateNormalSubQuestion(
                parseInt(newQuestion.id.split('-')[1]), 
                subId, 
                { text: qText, marks: marks }
            );
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = normalHTML;
            subContainer.appendChild(tempDiv.firstChild);
        }
    });
    
    // Update question title with section name
    const questionHeader = newQuestion.querySelector('.question-number');
    questionHeader.textContent = `${sectionName} - Question ${document.querySelectorAll('.question-item').length}`;
    
    // Clear preview
    previewDiv.style.display = 'none';
    previewDiv.dataset.questions = '';
    
    // Clear textarea
    document.getElementById('directQuestions').value = '';
    
    // Show success message
    showNotification(`${questions.length} questions successfully added!`, 'success');
});

// Clear direct input
document.getElementById('clearDirectBtn').addEventListener('click', function() {
    document.getElementById('directQuestions').value = '';
    document.getElementById('questionCount').value = '1';
    document.getElementById('parsedPreview').style.display = 'none';
    document.getElementById('parsedPreview').dataset.questions = '';
});

// Real-time question count update
document.getElementById('directQuestions').addEventListener('input', function() {
    const questions = this.value.split('\n').filter(q => q.trim() !== '');
    document.getElementById('questionCount').value = questions.length || 1;
});

// ============ Helper Functions ============

// Show notification
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-info-circle'}"></i>
        <span>${message}</span>
    `;
    
    // Style notification
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background-color: ${type === 'success' ? '#28a745' : '#17a2b8'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        z-index: 9999;
        display: flex;
        align-items: center;
        gap: 10px;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Add animation styles
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
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

// ============ Enhanced Preview Generation ============

// Override or enhance the existing generatePreview function
const originalGeneratePreview = generatePreview;
generatePreview = function() {
    // Call original function first
    originalGeneratePreview();
    
    // Add section headers in preview
    const sections = document.querySelectorAll('.question-item');
    let currentSection = '';
    
    sections.forEach((section, index) => {
        const sectionTitle = section.querySelector('.question-number').textContent;
        if (sectionTitle !== currentSection) {
            currentSection = sectionTitle;
        }
    });
};

// ============ Example Usage Guide ============

// Add example button functionality (optional)
function addExampleQuestions() {
    const exampleText = `What is the capital of France?
Explain the theory of relativity in simple terms.
Who wrote 'Hamlet'?
What is the chemical symbol for gold?
Define photosynthesis.
What is the largest ocean on Earth?
Who invented the telephone?
What is the square root of 144?
Name the first man on the moon.
What is the currency of Japan?`;
    
    document.getElementById('directQuestions').value = exampleText;
    document.getElementById('questionCount').value = '10';
    document.getElementById('marksPerQuestion').value = '3';
    document.getElementById('sectionName').value = 'General Knowledge';
}

// Optional: Add example button
const exampleBtn = document.createElement('button');
exampleBtn.type = 'button';
exampleBtn.className = 'btn-example';
exampleBtn.innerHTML = '<i class="fas fa-lightbulb"></i> Load Example';
exampleBtn.style.cssText = `
    background-color: #ffc107;
    color: #333;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 5px;
    cursor: pointer;
    margin-left: 1rem;
    font-size: 0.9rem;
`;
exampleBtn.onclick = addExampleQuestions;

// Add example button next to section title
const directInputSection = document.querySelector('.direct-input-section h3');
if (directInputSection) {
    directInputSection.appendChild(exampleBtn);
}