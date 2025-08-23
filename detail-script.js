// SVG placeholder для детальной страницы
const detailPlaceholderSVG = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="300" viewBox="0 0 600 300"><rect width="600" height="300" fill="#f0f0f0"/><text x="300" y="150" font-family="Arial" font-size="16" fill="#666" text-anchor="middle">Нет изображения</text></svg>';

async function loadDetailData() {
    try {
        const urlParams = new URLSearchParams(window.location.search);
        const slug = urlParams.get('slug');
        
        if (!slug) throw new Error('Не указан slug элемента');

        const response = await fetch('data.json');
        if (!response.ok) throw new Error('Ошибка загрузки данных');
        const data = await response.json();
        
        const item = data.find(i => String(i.slug) === String(slug));
        
        if (!item) throw new Error('Элемент не найден');
        
        displayDetail(item);
        
    } catch (error) {
        document.getElementById('detail-container').innerHTML = 
            `<div class="error">Ошибка: ${error.message}</div>`;
    }
}

function displayDetail(item) {
    const container = document.getElementById('detail-container');
    
    let html = `
        <div class="detail-card">
            <img src="${item.cover}" alt="${item.title}" 
                 onerror="this.src='${detailPlaceholderSVG}'">
            
            <h1>${item.title}</h1>
            
            <div class="detail-info">
                <p><strong>Slug:</strong> ${item.slug}</p>
                <p><strong>Автор:</strong> ${item.author_slug}</p>
                <p><strong>Статус:</strong> ${item.status_slug}</p>
                <p><strong>Группа:</strong> ${item.group_slug}</p>
                <p><strong>Подгруппа:</strong> ${item.subgroup_slug}</p>
                <p><strong>Версия:</strong> ${item.version_slug}</p>
            </div>
    `;

    if (item.description) html += `<p><strong>Описание:</strong> ${item.description}</p>`;
    if (item.summary_ai) html += `<p><strong>AI-описание:</strong> ${item.summary_ai}</p>`;
    if (item.detail) html += `<p><strong>Детали:</strong> ${item.detail}</p>`;
    if (item.comment) html += `<p><strong>Комментарий:</strong> ${item.comment}</p>`;

    const links = [
        { title: item.url_title_1, url: item.url_1 },
        { title: item.url_title_2, url: item.url_2 },
        { title: item.url_title_3, url: item.url_3 },
        { title: item.url_title_4, url: item.url_4 },
        { title: item.url_title_5, url: item.url_5 },
        { title: item.url_title_6, url: item.url_6 }
    ].filter(link => link.title && link.url);

    if (links.length > 0) {
        html += `<h2>Ссылки</h2>`;
        links.forEach(link => {
            html += `<a href="${link.url}" target="_blank" class="detail-link">${link.title}</a>`;
        });
    }

    html += `
        <h2>Даты</h2>
        <div class="detail-info">
            <p><strong>Создан:</strong> ${item.created_at}</p>
            <p><strong>Обновлен:</strong> ${item.updated_at}</p>
    `;
    
    if (item.start_date) html += `<p><strong>Дата начала:</strong> ${item.start_date}</p>`;
    if (item.end_date) html += `<p><strong>Дата окончания:</strong> ${item.end_date}</p>`;
    if (item.published) html += `<p><strong>Опубликовано:</strong> ${item.published}</p>`;

    html += `</div></div>`;
    container.innerHTML = html;
}

document.addEventListener('DOMContentLoaded', loadDetailData);
