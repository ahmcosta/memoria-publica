let correctCount = 0;
let wrongCount = 0;

const defaultData = {
    "subject": "Basic Learning",
    "subtopicsLabel": "Concepts",
    "topics": {
        "name": "Categories",
        "values": [
            {
                "name": "Programming",
                "key": "PROG",
                "subtopics": [
                    { "name": "Variables", "key": "P01", "comment": "Storage containers for data values in programming." },
                    { "name": "Functions", "key": "P02", "comment": "Reusable blocks of code that perform specific tasks." },
                    { "name": "Loops", "key": "P03", "comment": "Control structures that repeat code execution." }
                ]
            },
            {
                "name": "Mathematics",
                "key": "MATH",
                "subtopics": [
                    { "name": "Algebra", "key": "M01", "comment": "Mathematical operations with symbols and variables." },
                    { "name": "Geometry", "key": "M02", "comment": "Study of shapes, sizes, and spatial relationships." }
                ]
            }
        ]
    }
};

let data = defaultData;
initializeApp();

function loadFile() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = e => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onload = event => {
            try {
                data = JSON.parse(event.target.result);
                resetGame();
                initializeApp();
            } catch (error) {
                alert('Invalid JSON file');
            }
        };
        reader.readAsText(file);
    };
    input.click();
}

function resetGame() {
    correctCount = 0;
    wrongCount = 0;
    document.getElementById('correct').textContent = '0';
    document.getElementById('wrong').textContent = '0';
    document.getElementById('subtopics-list').innerHTML = '';
    document.getElementById('topics-container').innerHTML = '';
}

function initializeApp() {
    updateLabels();
    createSubtopics();
    createTopicBoxes();
}

function updateLabels() {
    document.querySelector('h1').textContent = data.subject;
    document.querySelector('.subtopics-panel h2').textContent = data.subtopicsLabel;
    document.querySelector('.topics-panel h2').textContent = data.topics.name;
}

function createSubtopics() {
    const container = document.getElementById('subtopics-list');
    const allSubtopics = [];
    
    // Collect all subtopics from simplified structure
    data.topics.values.forEach(topic => {
        topic.subtopics.forEach(subtopic => {
            allSubtopics.push({ 
                name: subtopic.name, 
                correctTopic: topic.name,
                comment: subtopic.comment || 'No description available.'
            });
        });
    });
    
    // Shuffle subtopics
    allSubtopics.sort(() => Math.random() - 0.5);
    
    // Create draggable elements
    allSubtopics.forEach(item => {
        const div = document.createElement('div');
        div.className = 'subtopic';
        div.textContent = item.name;
        div.draggable = true;
        div.dataset.correctTopic = item.correctTopic;
        div.dataset.comment = item.comment;
        
        div.addEventListener('dragstart', handleDragStart);
        div.addEventListener('dragend', handleDragEnd);
        
        container.appendChild(div);
    });
}

function createTopicBoxes() {
    const container = document.getElementById('topics-container');
    
    data.topics.values.forEach(topic => {
        const div = document.createElement('div');
        div.className = 'topic-box';
        div.dataset.topic = topic.name;
        
        const title = document.createElement('h3');
        title.textContent = topic.name;
        div.appendChild(title);
        
        div.addEventListener('dragover', handleDragOver);
        div.addEventListener('drop', handleDrop);
        div.addEventListener('dragleave', handleDragLeave);
        
        container.appendChild(div);
    });
}

function handleDragStart(e) {
    e.target.classList.add('dragging');
    e.dataTransfer.setData('text/plain', '');
}

function handleDragEnd(e) {
    e.target.classList.remove('dragging');
}

function handleDragOver(e) {
    e.preventDefault();
    e.target.closest('.topic-box').classList.add('drag-over');
}

function handleDragLeave(e) {
    if (!e.target.closest('.topic-box').contains(e.relatedTarget)) {
        e.target.closest('.topic-box').classList.remove('drag-over');
    }
}

function handleDrop(e) {
    e.preventDefault();
    const topicBox = e.target.closest('.topic-box');
    topicBox.classList.remove('drag-over');
    
    const draggedElement = document.querySelector('.dragging');
    const droppedTopic = topicBox.dataset.topic;
    const correctTopic = draggedElement.dataset.correctTopic;
    
    if (droppedTopic === correctTopic) {
        // Correct answer
        correctCount++;
        document.getElementById('correct').textContent = correctCount;
        topicBox.classList.add('correct');
        
        // Create clickable element in topic box
        const clickableDiv = document.createElement('div');
        clickableDiv.textContent = draggedElement.textContent;
        clickableDiv.className = 'placed-subtopic';
        clickableDiv.onclick = () => showModal(draggedElement.textContent, draggedElement.dataset.comment);
        topicBox.appendChild(clickableDiv);
        
        draggedElement.remove();
        setTimeout(() => topicBox.classList.remove('correct'), 500);
    } else {
        // Wrong answer
        wrongCount++;
        document.getElementById('wrong').textContent = wrongCount;
        topicBox.classList.add('incorrect');
        
        setTimeout(() => topicBox.classList.remove('incorrect'), 500);
    }
}

function showModal(title, comment) {
    document.getElementById('modal-title').textContent = title;
    document.getElementById('modal-comment').textContent = comment;
    document.getElementById('modal').style.display = 'block';
}

// Close modal when clicking X or outside
document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('modal');
    const closeBtn = document.querySelector('.close');
    
    closeBtn.onclick = () => modal.style.display = 'none';
    window.onclick = (e) => {
        if (e.target === modal) modal.style.display = 'none';
    };
});