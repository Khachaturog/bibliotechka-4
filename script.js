let allData = [];
let activeGroups = new Set();
let activeSubgroups = new Set();

// SVG placeholder без внешних запросов
const placeholderSVG = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="160" viewBox="0 0 300 160"><rect width="300" height="160" fill="#f0f0f0"/><text x="150" y="80" font-family="Arial" font-size="14" fill="#666" text-anchor="middle">Нет изображения</text></svg>';

async function loadData() {
    try {
        const response = await fetch('data.json');
        if (!response.ok) throw new Error('Ошибка загрузки данных');
        allData = await response.json();
        displayCards(allData);
        populateFilters(allData);
    } catch (error) {
        document.getElementById('cards-container').innerHTML = 
            '<div class="error">Ошибка загрузки данных</div>';
    }
}

function displayCards(data) {
    const container = document.getElementById('cards-container');
    
    if (data.length === 0) {
        container.innerHTML = '<div class="loading">Нет материалов по выбранным фильтрам</div>';
        return;
    }
    
    container.innerHTML = '';
    
    data.forEach(item => {
        const cardLink = document.createElement('a');
        cardLink.className = 'card';
        cardLink.href = `detail.html?slug=${encodeURIComponent(item.slug)}`;
        
        cardLink.innerHTML = `
            <img src="${item.cover}" alt="${item.title}" 
                 onerror="this.src='${placeholderSVG}'">
            
            <h2>${item.title}</h2>
            
            <div class="meta">
                <strong>Автор:</strong> ${item.author_slug}<br>
                <strong>Группа:</strong> ${item.group_slug}
                ${item.subgroup_slug ? `<br><strong>Подгруппа:</strong> ${item.subgroup_slug}` : ''}
            </div>
            
            <p>${item.summary_ai || item.description || ''}</p>
        `;
        
        container.appendChild(cardLink);
    });
}

// Остальные функции остаются без изменений
function populateFilters(data) {
    const groups = {};
    const subgroups = {};
    
    data.forEach(item => {
        if (item.status_slug === 'published') {
            if (item.group_slug) {
                groups[item.group_slug] = (groups[item.group_slug] || 0) + 1;
            }
            if (item.subgroup_slug) {
                subgroups[item.subgroup_slug] = (subgroups[item.subgroup_slug] || 0) + 1;
            }
        }
    });
    
    const groupContainer = document.getElementById('group-filters');
    groupContainer.innerHTML = '';
    Object.entries(groups).sort().forEach(([group, count]) => {
        groupContainer.appendChild(createFilterCheckbox('group', group, count));
    });
    
    const subgroupContainer = document.getElementById('subgroup-filters');
    subgroupContainer.innerHTML = '';
    Object.entries(subgroups).sort().forEach(([subgroup, count]) => {
        subgroupContainer.appendChild(createFilterCheckbox('subgroup', subgroup, count));
    });
}

function createFilterCheckbox(type, value, count) {
    const div = document.createElement('div');
    div.className = 'filter-checkbox';
    
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.id = `${type}-${value}`;
    checkbox.value = value;
    checkbox.addEventListener('change', (e) => handleFilterChange(type, value, e.target.checked));
    
    const label = document.createElement('label');
    label.htmlFor = `${type}-${value}`;
    label.textContent = value;
    
    const countSpan = document.createElement('span');
    countSpan.className = 'filter-count';
    countSpan.textContent = count;
    
    div.appendChild(checkbox);
    div.appendChild(label);
    div.appendChild(countSpan);
    
    return div;
}

function handleFilterChange(type, value, isChecked) {
    if (type === 'group') {
        isChecked ? activeGroups.add(value) : activeGroups.delete(value);
    } else {
        isChecked ? activeSubgroups.add(value) : activeSubgroups.delete(value);
    }
    applyFilters();
    updateFilterStyles();
}

function applyFilters() {
    let filteredData = allData.filter(item => item.status_slug === 'published');
    
    if (activeGroups.size > 0) {
        filteredData = filteredData.filter(item => 
            item.group_slug && activeGroups.has(item.group_slug)
        );
    }
    
    if (activeSubgroups.size > 0) {
        filteredData = filteredData.filter(item => 
            item.subgroup_slug && activeSubgroups.has(item.subgroup_slug)
        );
    }
    
    displayCards(filteredData);
}

function updateFilterStyles() {
    document.querySelectorAll('#group-filters .filter-checkbox, #subgroup-filters .filter-checkbox').forEach(div => {
        const checkbox = div.querySelector('input');
        const isActive = activeGroups.has(checkbox.value) || activeSubgroups.has(checkbox.value);
        div.classList.toggle('active-filters', isActive);
    });
}

function clearFilters() {
    activeGroups.clear();
    activeSubgroups.clear();
    document.querySelectorAll('.filter-checkbox input').forEach(checkbox => {
        checkbox.checked = false;
    });
    applyFilters();
    updateFilterStyles();
}

document.addEventListener('DOMContentLoaded', loadData);
