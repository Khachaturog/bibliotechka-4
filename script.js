async function loadData() {
    try {
        const response = await fetch('data.json');
        if (!response.ok) throw new Error('Ошибка загрузки данных');
        const data = await response.json();
        displayCards(data);
    } catch (error) {
        document.getElementById('cards-container').innerHTML = 
            '<div class="error">Ошибка загрузки данных</div>';
    }
}

function displayCards(data) {
    const container = document.getElementById('cards-container');
    container.innerHTML = '';

    const publishedItems = data.filter(item => item.status_slug === 'published');
    
    if (publishedItems.length === 0) {
        container.innerHTML = '<div class="loading">Нет опубликованных материалов</div>';
        return;
    }

    publishedItems.forEach(item => {
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
            </div>
            
            <p>${item.summary_ai || item.description || ''}</p>
        `;
        
        container.appendChild(cardLink);
    });
}

document.addEventListener('DOMContentLoaded', loadData);
