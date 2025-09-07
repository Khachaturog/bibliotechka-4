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

function displayGroups(groups) {
    const container = document.getElementById('groups-container');
    container.innerHTML = ''; // Clear existing content

    groups.forEach(group => {
        const wrapper = document.createElement('div');
        wrapper.className = 'group-wrapper';

        const card = document.createElement('a');
        card.className = 'group';
        card.href = `group.html?slug=${group.slug}`;
        card.innerHTML = `
            <img src="${group.cover}" alt="${group.title}">
            ${group.badge ? `<span class="group-badge">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M7.4076 15.3333C7.3316 15.3333 7.25493 15.32 7.1796 15.2927C6.8916 15.188 6.7116 14.9 6.74493 14.5953L7.25693 9.86665H3.33357C3.08757 9.86665 2.86157 9.73132 2.74557 9.51398C2.62957 9.29665 2.64291 9.03398 2.77957 8.82932L8.03827 0.962625C8.20893 0.707292 8.5316 0.601292 8.82027 0.707292C9.10893 0.811958 9.28827 1.09996 9.25493 1.40463L8.74293 6.13329H12.6669C12.9129 6.13329 13.1389 6.26863 13.2549 6.48596C13.3703 6.70332 13.3576 6.96598 13.2209 7.17065L7.9616 15.0373C7.8356 15.2267 7.62493 15.3333 7.4076 15.3333Z" fill="#4E5057"/>
            </svg> 
            ${group.badge}
            </span>` : ''}
            <div class="group-content">
                <h5 class="group-title">${group.title}</h5>
                ${group.description ? `<p class="group-description">${group.description}</p>` : ''}
            </div>
        `;

        wrapper.appendChild(card);
        container.appendChild(wrapper);
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
                <p class="card-title">${item.title}</p>
                ${item.description ? `<p class="card-description">${item.description}</p>` : ''}
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
