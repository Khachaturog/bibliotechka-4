// Скрипт для страницы групп

document.addEventListener('DOMContentLoaded', async () => {
    const [dataResponse, groupsResponse, subgroupsResponse] = await Promise.all([
        fetch('data/data.json'),
        fetch('data/group.json'),
        fetch('data/subgroup.json')
    ]);
    const data = await dataResponse.json();
    const groups = await groupsResponse.json();
    const subgroups = await subgroupsResponse.json();
    const params = new URLSearchParams(window.location.search);
    const groupSlug = params.get('slug');
    const group = groups.find(g => g.slug === groupSlug);
    if (group) {
        document.getElementById('container-title').textContent = group.title;
        const filteredData = data.filter(item => item.group_slug === groupSlug);
        displaySubgroupsAndCards(filteredData, subgroups);
    }
});

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

document.addEventListener('scroll', () => {
    const subgroups = document.querySelectorAll('.cards-container-0');
    const badges = document.querySelectorAll('.badge');

    subgroups.forEach((subgroup, index) => {
        const rect = subgroup.getBoundingClientRect();
        if (rect.top <= window.innerHeight / 2 && rect.bottom >= window.innerHeight / 2) {
            badges.forEach(badge => badge.classList.remove('active'));
            badges[index].classList.add('active');
                // Показываем активный бейджик на экране
                badges[index].scrollIntoView({behavior: 'smooth', block: 'nearest', inline: 'center' });
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
            }
        });
    });
});