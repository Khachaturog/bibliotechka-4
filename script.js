async function loadData() {
    const [dataResponse, groupsResponse] = await Promise.all([
        fetch('data.json'),
        fetch('group.json')
    ]);
    
    const data = await dataResponse.json();
    const groups = await groupsResponse.json();
    
    if (window.location.pathname.includes('detail.html')) {
        displayDetail(data);
    } else if (window.location.pathname.includes('group.html')) {
        // Показываем отфильтрованные карточки на странице группы
        const params = new URLSearchParams(window.location.search);
        const groupSlug = params.get('slug');
        const group = groups.find(g => g.slug === groupSlug);
        
        if (group) {
            document.getElementById('group-title').textContent = group.title;
            const filteredData = data.filter(item => item.group_slug === groupSlug);
            displayCards(filteredData);
        }
    } else {
        // На главной показываем все разделы и все карточки
        displayGroups(groups);
        displayCards(data);
    }
}

function displayGroups(groups) {
    const container = document.getElementById('groups-container');
    
    groups.forEach(group => {
        const card = document.createElement('a');
        card.className = 'group-card';
        card.href = `group.html?slug=${group.slug}`;
        card.innerHTML = `
            <img src="${group.cover}" alt="${group.title}">
            ${group.badge ? `<span class="group-card-badge">${group.badge}</span>` : ''}
            <div class="group-card-content">
                <h3 class="group-card-title">${group.title}</h3>
                <p class="group-card-description">${group.description || ''}</p>
            </div>
        `;
        container.appendChild(card);
    });
}

function displayCards(data) {
    const container = document.getElementById('cards-container');
    const itemsPerPage = 50;
    let currentIndex = 0;
    
    // Функция для создания карточки
    function createCard(item) {
        const card = document.createElement('a');
        card.className = 'card';
        card.href = `detail.html?slug=${item.slug}`;
        card.innerHTML = `
            <img src="${item.cover}" alt="${item.title}" loading="lazy">
            <div class="card-content">
                <h3 class="card-title">${item.title}</h3>
                <p class="card-description">${item.summary_ai || item.description || ''}</p>
            </div>
        `;
        return card;
    }
    
    // Функция для загрузки следующей порции карточек
    function loadMoreCards() {
        const fragment = document.createDocumentFragment();
        const itemsToLoad = Math.min(itemsPerPage, data.length - currentIndex);
        
        for (let i = 0; i < itemsToLoad; i++) {
            const card = createCard(data[currentIndex + i]);
            fragment.appendChild(card);
        }
        
        container.appendChild(fragment);
        currentIndex += itemsToLoad;
        
        // Скрыть loader если все карточки загружены
        if (currentIndex >= data.length) {
            observer.disconnect();
        }
    }
    
    // Создаем loader элемент
    const loader = document.createElement('div');
    loader.id = 'cards-loader';
    container.after(loader);
    
    // Настраиваем IntersectionObserver для бесконечного скролла
    const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && currentIndex < data.length) {
            loadMoreCards();
        }
    }, {
        rootMargin: '100px'
    });
    
    observer.observe(loader);
    
    // Загружаем первую порцию карточек
    loadMoreCards();
}

function displayDetail(data) {
    const params = new URLSearchParams(window.location.search);
    const slug = params.get('slug');
    const item = data.find(item => item.slug === slug);
    
    if (!item) {
        document.body.innerHTML = '<h1>Материал не найден</h1>';
        return;
    }
    
    const container = document.getElementById('detail-container');
    container.innerHTML = `
        <h1>${item.title}</h1>
        <img src="${item.cover}" alt="${item.title}" width="300px" height="200px">
        <p><strong>Автор:</strong> ${item.author_slug}</p>
        <p><strong>Группа:</strong> ${item.group_slug}</p>
        <p><strong>Подгруппа:</strong> ${item.subgroup_slug}</p>
        <p><strong>Описание:</strong> ${item.summary_ai || item.description || 'Нет описания'}</p>
        
        ${item.url_1 ? `<p><strong>${item.url_title_1}:</strong> <a href="${item.url_1}" target="_blank">Открыть</a></p>` : ''}
        ${item.url_2 ? `<p><strong>${item.url_title_2}:</strong> <a href="${item.url_2}" target="_blank">Открыть</a></p>` : ''}
        ${item.url_3 ? `<p><strong>${item.url_title_3}:</strong> <a href="${item.url_3}" target="_blank">Открыть</a></p>` : ''}
        ${item.url_4 ? `<p><strong>${item.url_title_4}:</strong> <a href="${item.url_4}" target="_blank">Открыть</a></p>` : ''}
        ${item.url_5 ? `<p><strong>${item.url_title_5}:</strong> <a href="${item.url_5}" target="_blank">Открыть</a></p>` : ''}
        ${item.url_6 ? `<p><strong>${item.url_title_6}:</strong> <a href="${item.url_6}" target="_blank">Открыть</a></p>` : ''}
        
        <p><strong>Создано:</strong> ${item.created_at}</p>
        <p><strong>Обновлено:</strong> ${item.updated_at}</p>
        
        <a href="index.html">← Назад к списку</a>
    `;
}

document.addEventListener('DOMContentLoaded', loadData);