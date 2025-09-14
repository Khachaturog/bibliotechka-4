// Скрипт для главной страницы

document.addEventListener('DOMContentLoaded', async () => {
    const [dataResponse, groupsResponse] = await Promise.all([
        fetch('data/data.json'),
        fetch('data/group.json')
    ]);
    const data = await dataResponse.json();
    const groups = await groupsResponse.json();
    displayGroups(groups);
    displayCards(data);
});

// Функция для отображения групп
function displayGroups(groups) {
    const container = document.getElementById('groups-container');
    const template = document.getElementById('group-template');
    container.innerHTML = ''; // Clear existing content

    groups.forEach(group => {
        const clone = template.content.cloneNode(true);
        const card = clone.querySelector('.group');
        const img = clone.querySelector('.group-cover');
        const badge = clone.querySelector('.group-badge');
        const badgeText = clone.querySelector('.group-badge-text');
        const title = clone.querySelector('.group-title');
        const description = clone.querySelector('.group-description');

        card.href = `group.html?slug=${group.slug}`;
        img.src = group.cover;
        img.alt = group.title;
        title.textContent = group.title;

        if (group.badge) {
            badgeText.textContent = group.badge;
            badge.hidden = false; // Показываем бейдж
        } else {
            badge.hidden = true; // Скрываем бейдж, если его нет
        }

        if (group.description) {
            description.textContent = group.description;
            description.hidden = false;
        }

        container.appendChild(clone);
    });
}

// Функция для отображения карточек
function displayCards(data) {
    const container = document.getElementById('cards-container');
    const template = document.getElementById('card-template');
    
    if (!container || !template) {
        console.error('Container or template not found');
        return;
    }

    data.forEach(item => {
        const clone = template.content.cloneNode(true);
        const card = clone.querySelector('.card');
        const img = clone.querySelector('.card-cover');
        const title = clone.querySelector('.card-title');
        const description = clone.querySelector('.card-description');

        card.href = `detail.html?slug=${item.slug}`;
        img.src = item.cover;
        img.alt = item.title;
        title.textContent = item.title;

        if (item.description) {
            description.textContent = item.description;
            description.hidden = false;
        } else {
            description.hidden = true;
        }

        container.appendChild(clone);
    });
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
    
    // Получаем loader элемент из HTML
    const loader = document.getElementById('cards-loader');
    
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

