async function loadData() {
    const response = await fetch('data.json');
    const data = await response.json();
    
    if (window.location.pathname.includes('detail.html')) {
        displayDetail(data);
    } else {
        displayCards(data);
    }
}

function displayCards(data) {
    const container = document.getElementById('cards-container');
    
    data.forEach(item => {
        const card = document.createElement('div');
        card.innerHTML = `
            <img src="${item.cover}" alt="${item.title}" width="300px" height="200px">
            <h2>${item.title}</h2>
            <a href="detail.html?slug=${item.slug}">Подробнее</a>
            <hr>
        `;
        container.appendChild(card);
    });
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