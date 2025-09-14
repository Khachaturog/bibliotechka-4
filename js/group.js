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
        document.querySelector('.container-description').textContent = group.description || '';
        const filteredData = data.filter(item => item.group_slug === groupSlug);
        displaySubgroupsAndCards(filteredData, subgroups);
    }
});

// displaySubgroupsAndCards
function displaySubgroupsAndCards(data, subgroups) {
    const container = document.getElementById('wrap2');
    container.innerHTML = ''; // Clear existing content

    const subgroupsContainer = document.getElementById('subgroups-container');
    subgroupsContainer.innerHTML = ''; // Clear existing badges

    subgroups.forEach(subgroup => {
        const subgroupData = data.filter(item => item.subgroup_slug === subgroup.slug);
        if (subgroupData.length > 0) {
            const badge = createBadge(subgroup);
            subgroupsContainer.appendChild(badge);

            const subgroupElement = createSubgroup(subgroup, subgroupData);
            container.appendChild(subgroupElement);
        }
    });
}

// Бейджи
const badgeTemplate = document.getElementById('badge-template');

function createBadge(subgroup) {
    const clone = badgeTemplate.content.cloneNode(true);
    const badge = clone.querySelector('.badge');
    badge.href = `#${subgroup.slug}`;
    badge.querySelector('.badge-title').textContent = subgroup.title;
    return clone;
}

// Подгруппы
const subgroupTemplate = document.getElementById('subgroup-template');

function createSubgroup(subgroup, subgroupData) {
    const clone = subgroupTemplate.content.cloneNode(true);
    const subgroupElement = clone.querySelector('.cards-container-0');
    subgroupElement.id = subgroup.slug;

    const title = clone.querySelector('.container-title');
    title.textContent = subgroup.title;

    const button = clone.querySelector('.button-link');
    button.addEventListener('click', (e) => {
        e.preventDefault();
        const url = `${window.location.origin}${window.location.pathname}#${subgroup.slug}`;
        navigator.clipboard.writeText(url).then(() => {
            button.textContent = 'Скопировано';
            setTimeout(() => {
                button.textContent = 'Скопировать ссылку';
            }, 500);
        });
    });

    if (subgroup.description) {
        const description = clone.querySelector('.container-description');
        description.textContent = subgroup.description;
        description.hidden = false;
    }

    const cardsContainer = clone.querySelector('.cards-container');
    subgroupData.forEach(item => {
        const card = createCard(item);
        cardsContainer.appendChild(card);
    });

    return clone;
}

// Карточки
function createCard(item) {
    const cardTemplate = document.getElementById('card-template');
    if (!cardTemplate) {
        console.error("Template with ID 'card-template' not found in the DOM.");
        return document.createElement('div'); // Возвращаем пустой div как запасной вариант
    }
    const clone = cardTemplate.content.cloneNode(true);
    const card = clone.querySelector('.card');
    card.href = `detail.html?slug=${item.slug}`;
    const img = clone.querySelector('img');
    img.src = item.cover;
    img.alt = item.title || 'Image';
    const title = clone.querySelector('.card-title');
    title.textContent = item.title;
    const description = clone.querySelector('.card-description');
    if (item.description) {
        description.textContent = item.description;
        description.hidden = false;
    }
    return clone;
}

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

// Прокрутка к подгруппе при клике на бейдж
document.addEventListener('DOMContentLoaded', () => {
    const badges = document.querySelectorAll('.badge');
    const subgroups = document.querySelectorAll('.cards-container-0');

    badges.forEach((badge, index) => {
        badge.addEventListener('click', (event) => {
            event.preventDefault();
            if (subgroups[index]) {
                const offset = 0; // Дополнительный отступ
                const topPosition = subgroups[index].getBoundingClientRect().top + window.scrollY - offset;
                window.scrollTo({
                    top: topPosition, // Указываем позицию для скролла
                    behavior: 'smooth'
                });
            }
        });
    });
});