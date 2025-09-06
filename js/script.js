async function loadData() {
    const [dataResponse, groupsResponse, subgroupsResponse] = await Promise.all([
        fetch('data/data.json'),
        fetch('data/group.json'),
        fetch('data/subgroup.json')
    ]);

    const data = await dataResponse.json();
    const groups = await groupsResponse.json();
    const subgroups = await subgroupsResponse.json();

    if (window.location.pathname.includes('detail.html')) {
        displayDetail(data);
    } else if (window.location.pathname.includes('group.html')) {
        // Показываем отфильтрованные карточки на странице группы
        const params = new URLSearchParams(window.location.search);
        const groupSlug = params.get('slug');
        const group = groups.find(g => g.slug === groupSlug);
        
        if (group) {
            document.getElementById('container-title').textContent = group.title;
            const filteredData = data.filter(item => item.group_slug === groupSlug);
            displaySubgroupsAndCards(filteredData, subgroups);
        }
    } else {
        // На главной показываем все разделы и все карточки
        displayGroups(groups);
        displayCards(data);
    }
}

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

// Загрузка группированных subgroup карточек
function displaySubgroupsAndCards(data, subgroups) {
    const container = document.getElementById('wrap2');
    container.innerHTML = ''; // Clear existing content

    const subgroupsContainer = document.getElementById('subgroups-container');
    subgroupsContainer.innerHTML = ''; // Clear existing badges

    subgroups.forEach(subgroup => {
        const subgroupData = data.filter(item => item.subgroup_slug === subgroup.slug);
        if (subgroupData.length > 0) {
            // Добавление бейджика для подгруппы
            const badge = document.createElement('a');
            badge.href = `#${subgroup.slug}`;
            badge.className = 'badge';
            badge.innerHTML = `<span class='badge-title'>${subgroup.title}</span>`;
            subgroupsContainer.appendChild(badge);

            const subgroupElement = document.createElement('div');
            subgroupElement.className = 'cards-container-0';
            subgroupElement.id = `${subgroup.slug}`;

            const infoContainer = document.createElement('div');
            infoContainer.className = 'cards-container-0-header';

            const title = document.createElement('h3');
            title.id = 'container-title';
            title.textContent = subgroup.title;
            infoContainer.appendChild(title);

            if (subgroup.description) {
                const description = document.createElement('p');
                description.className = 'container-description';
                description.textContent = subgroup.description;
                infoContainer.appendChild(description);
            }

            subgroupElement.appendChild(infoContainer);

            const cardsContainer = document.createElement('div');
            cardsContainer.id = 'cards-container';
            subgroupData.forEach(item => {
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
                cardsContainer.appendChild(card);
            });

            subgroupElement.appendChild(cardsContainer);
            container.appendChild(subgroupElement);
        }
    });
}

function displayDetail(data) {
    const params = new URLSearchParams(window.location.search);
    const slug = params.get('slug');

    // Поиск по точному совпадению и по числовому значению
    const item = data.find(item => {
        const itemSlugNum = parseInt(item.slug);
        const searchSlugNum = parseInt(slug);
        console.log(`Сравниваем: ${item.slug} (${itemSlugNum}) с ${slug} (${searchSlugNum})`);
        return item.slug === slug || itemSlugNum === searchSlugNum;
    });
    
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

document.addEventListener('scroll', () => {
    const subgroups = document.querySelectorAll('.cards-container-0');
    const badges = document.querySelectorAll('.badge');

    subgroups.forEach((subgroup, index) => {
        const rect = subgroup.getBoundingClientRect();
        if (rect.top <= window.innerHeight / 2 && rect.bottom >= window.innerHeight / 2) {
            badges.forEach(badge => badge.classList.remove('active'));
            badges[index].classList.add('active');
        }
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const badges = document.querySelectorAll('.badge');
    const subgroups = document.querySelectorAll('.cards-container-0');

    badges.forEach((badge, index) => {
        badge.addEventListener('click', (event) => {
            event.preventDefault();
            if (subgroups[index]) {
                const offset = 100; // Отступ сверху
                const topPosition = subgroups[index].getBoundingClientRect().top + window.scrollY - offset;
                console.log(`Scrolling to position: ${topPosition}`); // Отладочное сообщение
                window.scrollTo({ top: topPosition, behavior: 'smooth' });
            }
        });
    });
});