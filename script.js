let correctCount = 0;
let wrongCount = 0;
let wrongLog = [];
let currentLanguage = localStorage.getItem('language') || 'pt_BR';
let translations = {};

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

let data = null;
loadTranslations();

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
                if (!data.subject || !data.topics) {
                    throw new Error('Invalid format');
                }
                resetGame();
                initializeApp();
            } catch (error) {
                alert(t('invalidJson'));
            }
        };
        reader.readAsText(file);
    };
    input.click();
}

function restartGame() {
    if (!data) return;
    resetGame();
    createSubtopics();
    createTopicBoxes();
}

function resetGame() {
    correctCount = 0;
    wrongCount = 0;
    wrongLog = [];
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

async function loadTranslations() {
    console.log('Loading translations for:', currentLanguage);
    try {
        const response = await fetch(`i18n/${currentLanguage}.json`);
        translations = await response.json();
        console.log('Translations loaded:', Object.keys(translations));
    } catch (error) {
        console.error('Translation loading failed:', error);
        translations = {
            title: 'Memória Pública',
            subtitle: 'Sua ferramenta de memorização',
            instructions: 'Instruções', 
            howToUse: 'Como Usar',
            welcome: 'Bem-vindo!',
            clickToStart: 'Clique em "Carregar Arquivo JSON" para começar a aprender.',
            howItWorks: 'Como funciona:',
            step1: '1. Carregue um arquivo JSON com tópicos e subtópicos',
            step2: '2. Arraste subtópicos para as caixas de tópicos correspondentes', 
            step3: '3. Correspondências corretas ficam, erradas retornam',
            step4: '4. Clique nos itens colocados para ver descrições',
            topicBoxesAppear: 'As caixas de tópicos aparecerão aqui após carregar um arquivo JSON.',
            tryFiles: 'Experimente carregar um destes arquivos de exemplo:',
            loadJsonFile: 'Carregar Arquivo JSON',
            correct: 'Correto',
            wrong: 'Errado',
            invalidJson: 'Arquivo JSON inválido'
        };
    }
    updateUI();
    if (!data) {
        showHelp();
    }
}

function updateUI() {
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (translations[key]) {
            element.textContent = translations[key];
        }
    });
    
    document.querySelectorAll('[data-i18n-title]').forEach(element => {
        const key = element.getAttribute('data-i18n-title');
        if (translations[key]) {
            element.title = translations[key];
        }
    });
    
    document.querySelectorAll('.flag').forEach(flag => flag.classList.remove('active'));
    const activeFlag = document.querySelector(`[onclick="setLanguage('${currentLanguage}')"]`);
    if (activeFlag) activeFlag.classList.add('active');
}

function setLanguage(lang) {
    currentLanguage = lang;
    localStorage.setItem('language', lang);
    loadTranslations().then(() => {
        if (data) {
            initializeApp();
        }
    });
}

function t(key) {
    return translations[key] || key;
}

function showHelp() {
    // Set help screen headers
    document.getElementById('subtopics-header').textContent = t('instructions');
    document.getElementById('topics-header').textContent = t('howToUse');
    
    document.getElementById('subtopics-list').innerHTML = `
        <div style="padding: 20px; text-align: center;">
            <h3 data-i18n="welcome">Welcome!</h3>
            <p data-i18n="clickToStart">Click "Load JSON File" to start learning.</p>
            <br>
            <p><strong data-i18n="howItWorks">How it works:</strong></p>
            <p data-i18n="step1">1. Load a JSON file with topics and subtopics</p>
            <p data-i18n="step2">2. Drag subtopics to matching topic boxes</p>
            <p data-i18n="step3">3. Correct matches stay, wrong ones return</p>
            <p data-i18n="step4">4. Click placed items to see descriptions</p>
        </div>
    `;
    
    document.getElementById('topics-container').innerHTML = `
        <div style="padding: 20px; text-align: center; color: #666;">
            <p data-i18n="topicBoxesAppear">Topic boxes will appear here after loading a JSON file.</p>
            <br>
            <p data-i18n="tryFiles">Try loading one of these example files:</p>
            <p>• cobit2019_clean.json</p>
            <p>• itil4.json</p>
            <p>• programming.json</p>
        </div>
    `;
    
    // Update translations for the new elements
    updateUI();
}

function updateLabels() {
    document.querySelector('h1').textContent = data.subject;
    document.getElementById('subtopics-header').textContent = data.subtopicsLabel;
    document.getElementById('topics-header').textContent = data.topics.name;
    
    // Update other UI elements with translations
    updateUI();
}

function createSubtopics() {
    const container = document.getElementById('subtopics-list');
    container.innerHTML = '';
    const allSubtopics = [];
    
    // Collect all subtopics from simplified structure
    data.topics.values.forEach(topic => {
        topic.subtopics.forEach((subtopic, index) => {
            allSubtopics.push({ 
                name: subtopic.name, 
                correctTopic: topic.name,
                comment: subtopic.comment || 'No description available.',
                key: subtopic.key,
                originalOrder: index,
                image: subtopic.image,
                source: subtopic.source
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
        div.dataset.originalOrder = item.originalOrder;
        if (item.comment) div.dataset.comment = item.comment;
        if (item.key) div.dataset.key = item.key;
        if (item.image) div.dataset.image = item.image;
        if (item.source) div.dataset.source = item.source;
        
        console.log('Created subtopic:', item.name, 'source:', item.source);
        
        div.addEventListener('dragend', handleDragEnd);
        
        container.appendChild(div);
        
        if (item.image) {
            div.classList.add('has-image');
            div.addEventListener('mouseenter', showImageTooltip);
            div.addEventListener('mouseleave', hideImageTooltip);
            div.addEventListener('dragstart', (e) => {
                hideImageTooltip(e);
                handleDragStart(e);
            });
        } else {
            div.addEventListener('dragstart', handleDragStart);
        }
    });
}

function createTopicBoxes() {
    const container = document.getElementById('topics-container');
    container.innerHTML = '';
    
    data.topics.values.forEach(topic => {
        const div = document.createElement('div');
        div.className = 'topic-box';
        div.dataset.topic = topic.name;
        
        const header = document.createElement('div');
        header.className = 'topic-header';
        
        const titleContainer = document.createElement('div');
        titleContainer.style.display = 'flex';
        titleContainer.style.alignItems = 'center';
        
        const title = document.createElement('h3');
        title.textContent = topic.name;
        titleContainer.appendChild(title);
        
        if (topic.comment) {
            const infoIcon = document.createElement('span');
            infoIcon.className = 'info-icon';
            infoIcon.textContent = 'ℹ️';
            infoIcon.onclick = (e) => {
                e.stopPropagation();
                const displayTitle = topic.key ? `${topic.key} - ${topic.name}` : topic.name;
                showModal(displayTitle, topic.comment, topic.image, topic.source);
            };
            titleContainer.appendChild(infoIcon);
        }
        
        const collapseIcon = document.createElement('span');
        collapseIcon.className = 'collapse-icon';
        collapseIcon.textContent = '▼';
        
        header.appendChild(titleContainer);
        header.appendChild(collapseIcon);
        
        const content = document.createElement('div');
        content.className = 'topic-content';
        
        header.onclick = () => toggleTopicBox(div, content, collapseIcon);
        
        div.appendChild(header);
        div.appendChild(content);
        
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
        clickableDiv.dataset.originalOrder = draggedElement.dataset.originalOrder;
        if (draggedElement.dataset.source) clickableDiv.dataset.source = draggedElement.dataset.source;
        console.log('Source data:', draggedElement.dataset.source, 'copied to clickable:', clickableDiv.dataset.source);
        if (draggedElement.dataset.comment) {
            clickableDiv.onclick = () => {
                const title = draggedElement.dataset.key ? 
                    `${draggedElement.dataset.key} - ${draggedElement.textContent}` : 
                    draggedElement.textContent;
                const image = draggedElement.dataset.image || null;
                const source = clickableDiv.dataset.source || null;
                console.log('Modal source:', source);
                showModal(title, draggedElement.dataset.comment, image, source);
            };
        }
        
        // Find correct position to insert based on original order
        const existingItems = Array.from(topicBox.querySelectorAll('.placed-subtopic'));
        const insertPosition = existingItems.findIndex(item => 
            parseInt(item.dataset.originalOrder) > parseInt(clickableDiv.dataset.originalOrder)
        );
        
        const content = topicBox.querySelector('.topic-content');
        if (insertPosition === -1) {
            content.appendChild(clickableDiv);
        } else {
            content.insertBefore(clickableDiv, existingItems[insertPosition]);
        }
        
        draggedElement.remove();
        setTimeout(() => topicBox.classList.remove('correct'), 500);
    } else {
        // Wrong answer
        wrongCount++;
        wrongLog.push({
            subtopic: draggedElement.textContent,
            droppedIn: droppedTopic,
            correctTopic: correctTopic,
            timestamp: new Date().toLocaleTimeString()
        });
        document.getElementById('wrong').textContent = wrongCount;
        topicBox.classList.add('incorrect');
        
        setTimeout(() => topicBox.classList.remove('incorrect'), 500);
    }
}

function showModal(title, comment, image, source) {
    console.log('showModal called with source:', source);
    document.getElementById('modal-title').textContent = title;
    
    const modalComment = document.getElementById('modal-comment');
    
    let content = `<p>${comment}</p>`;
    
    if (image) {
        content += `<img src="${image}" alt="${title}" style="max-width: 100%; height: auto; margin-top: 10px; border-radius: 4px;">`;
    }
    
    if (source) {
        console.log('Adding source to modal:', source);
        content += `<p style="margin-top: 15px; font-size: 12px; color: #666;"><strong>Fonte:</strong> <a href="${source}" target="_blank" style="color: #2196f3;">${source}</a></p>`;
    }
    
    modalComment.innerHTML = content;
    document.getElementById('modal').style.display = 'block';
}

let currentPage = 1;
const itemsPerPage = 5;

function showWrongLog() {
    if (wrongLog.length === 0) {
        showModal('Histórico de Erros', 'Nenhum erro registrado ainda.');
        return;
    }
    
    currentPage = 1;
    renderErrorPage();
}

function renderErrorPage() {
    const reversedLog = [...wrongLog].reverse();
    const totalPages = Math.ceil(reversedLog.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const pageItems = reversedLog.slice(startIndex, endIndex);
    
    const tableRows = pageItems.map((entry, index) => {
        const originalIndex = reversedLog.length - (startIndex + index);
        return `<tr>
            <td>${originalIndex}</td>
            <td class="subtopic-cell">${entry.subtopic}</td>
            <td class="error-cell">${entry.droppedIn} → ${entry.correctTopic}</td>
        </tr>`;
    }).join('');
    
    const paginationHTML = totalPages > 1 ? `
        <div class="pagination">
            <button onclick="changePage(${currentPage - 1})" ${currentPage === 1 ? 'disabled' : ''}>‹</button>
            <span>Página ${currentPage} de ${totalPages}</span>
            <button onclick="changePage(${currentPage + 1})" ${currentPage === totalPages ? 'disabled' : ''}>›</button>
        </div>
    ` : '';
    
    const tableHTML = `
        <table class="error-table">
            <thead>
                <tr>
                    <th>#</th>
                    <th>Conceito</th>
                    <th>Erro → Correto</th>
                </tr>
            </thead>
            <tbody>
                ${tableRows}
            </tbody>
        </table>
        ${paginationHTML}
    `;
    
    document.getElementById('modal-title').textContent = `Histórico de Erros (${wrongLog.length})`;
    document.getElementById('modal-comment').innerHTML = tableHTML;
    document.getElementById('modal').style.display = 'block';
}

function changePage(newPage) {
    const totalPages = Math.ceil(wrongLog.length / itemsPerPage);
    if (newPage >= 1 && newPage <= totalPages) {
        currentPage = newPage;
        renderErrorPage();
    }
}

// Close modal when clicking X or outside
document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('modal');
    const closeBtn = document.querySelector('.close');
    
    if (closeBtn) closeBtn.onclick = () => modal.style.display = 'none';
    window.onclick = (e) => {
        if (e.target === modal) modal.style.display = 'none';
    };
    
    // Handle version display and changelog
    const versionElement = document.getElementById('version');
    if (versionElement && versionElement.textContent === '__VERSION__') {
        versionElement.textContent = 'local';
    }
    
    checkVersionUpdate();
    setupVersionTooltip();
});

function checkVersionUpdate() {
    const currentVersion = document.getElementById('version').textContent;
    const storedVersion = localStorage.getItem('appVersion');
    
    if (storedVersion && storedVersion !== currentVersion) {
        const versionElement = document.getElementById('version');
        const updateIcon = document.createElement('span');
        updateIcon.textContent = '🔴';
        updateIcon.style.marginRight = '5px';
        updateIcon.title = 'Nova versão disponível';
        versionElement.parentNode.insertBefore(updateIcon, versionElement);
    }
    
    localStorage.setItem('appVersion', currentVersion);
}

async function setupVersionTooltip() {
    const versionElement = document.getElementById('version');
    
    try {
        const response = await fetch('changelog.json');
        const changelog = await response.json();
        
        let tooltipContent = `Versão: ${changelog.version}\n`;
        tooltipContent += `Data: ${changelog.date}\n\n`;
        tooltipContent += 'Últimas alterações:\n';
        changelog.changes.forEach((change, index) => {
            tooltipContent += `${index + 1}. ${change}\n`;
        });
        
        versionElement.title = tooltipContent;
    } catch (error) {
        console.log('Changelog not available');
        versionElement.title = `Versão: ${versionElement.textContent}`;
    }
}

function showImageTooltip(e) {
    const image = e.target.dataset.image;
    console.log('Showing tooltip for image:', image);
    if (!image) return;
    
    const tooltip = document.createElement('div');
    tooltip.className = 'image-tooltip';
    tooltip.innerHTML = `<img src="${image}" alt="Preview" onerror="this.style.display='none'">`;
    
    document.body.appendChild(tooltip);
    
    const rect = e.target.getBoundingClientRect();
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
    
    tooltip.style.position = 'fixed';
    tooltip.style.left = (rect.right + 10) + 'px';
    tooltip.style.top = rect.top + 'px';
    
    e.target._tooltip = tooltip;
}

function hideImageTooltip(e) {
    if (e.target._tooltip) {
        e.target._tooltip.remove();
        delete e.target._tooltip;
    }
    // Also remove any orphaned tooltips
    document.querySelectorAll('.image-tooltip').forEach(tooltip => tooltip.remove());
}

function toggleTopicBox(topicBox, content, collapseIcon) {
    const isCollapsed = content.classList.contains('hidden');
    
    if (isCollapsed) {
        content.classList.remove('hidden');
        collapseIcon.classList.remove('collapsed');
        topicBox.classList.remove('collapsed');
    } else {
        content.classList.add('hidden');
        collapseIcon.classList.add('collapsed');
        topicBox.classList.add('collapsed');
    }
}