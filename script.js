let allData = [];
let activeGroups = new Set();
let activeSubgroups = new Set();

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

function populateFilters(data) {
    const groups = {};
    const subgroups = {};
    
    // Собираем статистику по группам и подгруппам
    data.forEach(item => {
        if (item.status_slug === 'published') {
            // Группы
            if (item.group_slug) {
                groups[item.group_slug] = (groups[item.group_slug] || 0) + 1;
            }
            
            // Подгруппы
            if (item.subgroup_slug) {
                subgroups[item.subgroup_slug] = (subgroups[item.subgroup_slug] || 0) + 1;
            }
        }
    });
    
    // Отображаем фильтры групп
    const groupContainer = document.getElementById('group-filters');
    groupContainer.innerHTML = '';
    
    Object.entries(groups).sort().forEach(([group, count]) => {
        const checkbox = createFilterCheckbox('group', group, count);
        groupContainer.appendChild(checkbox);
    });
    
    // Отображаем фильтры подгрупп
    const subgroupContainer = document.getElementById('subgroup-filters');
    subgroupContainer.innerHTML = '';
    
    Object.entries(subgroups).sort().forEach(([subgroup, count]) => {
        const checkbox = createFilterCheckbox('subgroup', subgroup, count);
        subgroupContainer.appendChild(checkbox);
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
        if (isChecked) {
            activeGroups.add(value);
        } else {
            activeGroups.delete(value);
        }
    } else if (type === 'subgroup') {
        if (isChecked) {
            activeSubgroups.add(value);
        } else {
            activeSubgroups.delete(value);
        }
    }
    
    applyFilters();
    updateFilterStyles();
}

function applyFilters() {
    let filteredData = allData.filter(item => item.status_slug === 'published');
    
    // Применяем фильтры групп
    if (activeGroups.size > 0) {
        filteredData = filteredData.filter(item => 
            item.group_slug && activeGroups.has(item.group_slug)
        );
    }
    
    // Применяем фильтры подгрупп
    if (activeSubgroups.size > 0) {
        filteredData = filteredData.filter(item => 
            item.subgroup_slug && activeSubgroups.has(item.subgroup_slug)
        );
    }
    
    displayCards(filteredData);
}

function updateFilterStyles() {
    // Обновляем стили чекбоксов групп
    document.querySelectorAll('#group-filters .filter-checkbox').forEach(div => {
        const checkbox = div.querySelector('input');
        if (activeGroups.has(checkbox.value)) {
            div.classList.add('active-filters');
        } else {
            div.classList.remove('active-filters');
        }
    });
    
    // Обновляем стили чекбоксов подгрупп
    document.querySelectorAll('#subgroup-filters .filter-checkbox').forEach(div => {
        const checkbox = div.querySelector('input');
        if (activeSubgroups.has(checkbox.value)) {
            div.classList.add('active-filters');
        } else {
            div.classList.remove('active-filters');
        }
    });
}

function clearFilters() {
    activeGroups.clear();
    activeSubgroups.clear();
    
    // Сбрасываем все чекбоксы
    document.querySelectorAll('.filter-checkbox input').forEach(checkbox => {
        checkbox.checked = false;
    });
    
    applyFilters();
    updateFilterStyles();
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
                 onerror="this.src='https://via.placeholder.com/300x160?text=Нет+изображения'">
            
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

document.addEventListener('DOMContentLoaded', loadData);
