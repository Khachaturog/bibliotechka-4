// Скрипт для страницы деталей

document.addEventListener('DOMContentLoaded', async () => {
    const dataResponse = await fetch('data/data.json');
    const data = await dataResponse.json();
    displayDetail(data);

    // Навигация по карточкам
    const params = new URLSearchParams(window.location.search);
    const slug = params.get('slug');
    const currentIndex = data.findIndex(item => item.slug === slug || parseInt(item.slug) === parseInt(slug));

    // Кнопка "следующая"
    const nextBtn = document.querySelector('.detail-footer-container-2 button:last-child');
    if (nextBtn && currentIndex !== -1 && currentIndex < data.length - 1) {
        nextBtn.onclick = () => {
            const nextSlug = data[currentIndex + 1].slug;
            window.location.href = `detail.html?slug=${nextSlug}`;
        };
    } else if (nextBtn) {
        nextBtn.disabled = true;
    }

    // Кнопка "предыдущая"
    const prevBtn = document.querySelector('.detail-footer-container-2 button:first-child');
    if (prevBtn && currentIndex > 0) {
        prevBtn.onclick = () => {
            const prevSlug = data[currentIndex - 1].slug;
            window.location.href = `detail.html?slug=${prevSlug}`;
        };
    } else if (prevBtn) {
        prevBtn.disabled = true;
    }
});

function displayDetail(data) {
    const params = new URLSearchParams(window.location.search);
    const slug = params.get('slug');
    if (!slug) {
        document.body.innerHTML = '<h1>Материал не найден (slug не указан)</h1>';
        return;
    }
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
    
    const container = document.getElementById('detail-container-0');
    container.innerHTML = `
        <div class="detail-container-image">
            <img class="image" src="${item.cover}">
        </div>

        <div class="detail-container-1">
            <div class="detail-block1">
                <h1 class="detail-block1-title">${item.title}</h1>
                <div class="detail-block1-subtitle">${item.description || ''}</div>
            </div>

            <div class="detail-block2">
                <div class="detail-block2-title">Ссылки</div>
                <div type="1" class="detail-block2-list">
                    ${item.url_1 ? `<a class="detail-block2-list-item" href="${item.url_1}" target="_blank">
                        <div class="detail-block2-list-link">${item.url_title_1 || item.url_1}</div>
                        <div class="detail-block2-list-icon">↗</div></a>` : ''}
                    ${item.url_2 ? `<a class="detail-block2-list-item" href="${item.url_2}" target="_blank">
                        <div class="detail-block2-list-link">${item.url_title_2 || item.url_2}</div>
                        <div class="detail-block2-list-icon">↗</div></a>` : ''}
                    ${item.url_3 ? `<a class="detail-block2-list-item" href="${item.url_3}" target="_blank">
                        <div class="detail-block2-list-link">${item.url_title_3 || item.url_3}</div>
                        <div class="detail-block2-list-icon">↗</div></a>` : ''}
                    ${item.url_4 ? `<a class="detail-block2-list-item" href="${item.url_4}" target="_blank">
                        <div class="detail-block2-list-link">${item.url_title_4 || item.url_4}</div>
                        <div class="detail-block2-list-icon">↗</div></a>` : ''}
                    ${item.url_5 ? `<a class="detail-block2-list-item" href="${item.url_5}" target="_blank">
                        <div class="detail-block2-list-link">${item.url_title_5 || item.url_5}</div>
                        <div class="detail-block2-list-icon">↗</div></a>` : ''}
                    ${item.url_6 ? `<a class="detail-block2-list-item" href="${item.url_6}" target="_blank">
                        <div class="detail-block2-list-link">${item.url_title_6 || item.url_6}</div>
                        <div class="detail-block2-list-icon">↗</div></a>` : ''}
                </div>
            </div>

            <div class="detail-block3">
                <div class="detail-block3-title">Автор(ы)</div>
                <div class="detail-block3-list">
                    ${item.authors ? item.authors.map(a => `<div>${a}</div>`).join('') : `<div>${item.author_slug}</div>`}
                </div>
            </div>

            <div class="detail-block4">
                <div class="detail-block4-title">От ИИ</div>
                <div class="detail-block4-list">
                    <div class="detail-block4-list-row"><span style="flex: 1 0 0;">${item.summary_ai || 'Однажды напишет саммари'}</span></div>
                </div>
            </div>

            <div class="detail-block4">
                <div class="detail-block4-title">Разное</div>
                <div class="detail-block4-list">
                    ${item.start_date || item.end_date ? `<div class="detail-block4-list-row"><span style="flex: 1 0 0;">Проведено</span><span>${item.start_date || ''}-${item.end_date || ''}</span></div>` : ''}
                    ${item.published ? `<div class="detail-block4-list-row"><span style="flex: 1 0 0;">Статья опубликована</span><span>${item.published || ''}</span></div>` : ''}
                    <div class="detail-block4-list-row"><span style="flex: 1 0 0;">Обновлено</span><span>${item.updated_at || '-'}</span></div>
                    <div class="detail-block4-list-row"><span style="flex: 1 0 0;">Раздел</span><span>${item.group_slug || '-'}</span></div>
                    <div class="detail-block4-list-row"><span style="flex: 1 0 0;">Категория</span><span>${item.subgroup_slug || '-'}</span></div>
                    <div class="detail-block4-list-row"><span style="flex: 1 0 0;">Теги</span><span>${item.detail || '-'}</span></div>
                    <div class="detail-block4-list-row"><span style="flex: 1 0 0;">Номер в картотеке</span><span>${item.slug || '-'}</span></div>
                    <div class="detail-block4-list-row"><span style="flex: 1 0 0;">Опубликовано</span><span>${item.created_at || '-'}</span></div>
                    <div class="detail-block4-list-row"><span style="flex: 1 0 0;">Появилось в версии</span><span>${item.version_slug || '-'}</span></div>
                    <div class="detail-block4-list-row"><span style="flex: 1 0 0;">Статус</span><span>${item.status_slug || '—'}</span></div>
                </div>
            </div>
        </div>
    `;
}
