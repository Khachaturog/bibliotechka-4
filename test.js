Загрузка группированных subgroup карточек
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

            const titleContainer = document.createElement('div');
            titleContainer.className = 'title-with-button';

            const title = document.createElement('h3');
            title.className = 'container-title';
            title.textContent = subgroup.title;
            titleContainer.appendChild(title);

            const button = document.createElement('button');
            button.className = 'button-link';
            button.setAttribute('aria-label', 'Скопировать ссылку');
            const svgDefault = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 20 20" fill="none">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M9.60594 3.24961C11.4243 1.42711 14.3584 1.09794 16.3851 2.68294C18.8126 4.58128 18.9718 8.11878 16.8626 10.2329L15.6768 11.4204C15.3493 11.7488 14.8193 11.7488 14.4918 11.4204C14.1643 11.0929 14.1643 10.5604 14.4918 10.2329L15.6768 9.04461C17.0559 7.66378 16.9809 5.36794 15.4501 4.08628C14.0943 2.95044 12.0593 3.16711 10.8101 4.41878L9.74927 5.48128C9.4226 5.80961 8.89094 5.80961 8.56427 5.48128C8.23677 5.15378 8.23344 4.62461 8.71177 4.14544L9.60594 3.24961ZM11.0775 7.74403L7.74419 11.0774C7.41835 11.4032 7.41835 11.9299 7.74419 12.2557C7.90669 12.4182 8.12002 12.4999 8.33335 12.4999C8.54669 12.4999 8.76002 12.4182 8.92252 12.2557L12.2559 8.92236C12.5817 8.59653 12.5817 8.06986 12.2559 7.74403C11.93 7.41819 11.4034 7.41819 11.0775 7.74403ZM10.2336 14.4969L9.17194 15.5561C7.9211 16.8036 5.88194 17.0186 4.52527 15.8878C2.99277 14.6111 2.91694 12.3228 4.29777 10.9453L5.48527 9.76194C5.81277 9.43528 5.81277 8.90528 5.48527 8.57778C5.15777 8.25194 4.6261 8.25194 4.29777 8.57778L3.23527 9.63861C1.42527 11.4436 1.10777 14.3469 2.67277 16.3669C4.56527 18.8111 8.11527 18.9761 10.2336 16.8644L11.4211 15.6811C11.7486 15.3536 11.7486 14.8244 11.4211 14.4969C11.0928 14.1694 10.5619 14.1694 10.2336 14.4969Z" fill="#734AE5"/>
            </svg>`;
            const svgCopied = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
  <path fill-rule="evenodd" clip-rule="evenodd" d="M8.2194 14.9999C7.9894 14.9999 7.7694 14.9049 7.6119 14.7374L3.5594 10.4216C3.24357 10.0866 3.26107 9.55907 3.59607 9.24407C3.9319 8.92907 4.4594 8.94573 4.77357 9.28073L8.21107 12.9399L15.2177 5.27156C15.5294 4.93072 16.0561 4.90822 16.3961 5.21822C16.7352 5.52822 16.7586 6.05572 16.4486 6.39489L8.83439 14.7282C8.67855 14.8999 8.45689 14.9982 8.22524 14.9999H8.2194Z" fill="#734AE5"/>
</svg>`;
            button.innerHTML = svgDefault;
            button.addEventListener('click', function(e) {
                e.preventDefault();
                const url = window.location.origin + window.location.pathname + window.location.search + '#' + subgroup.slug;
                navigator.clipboard.writeText(url).then(() => {
                    button.innerHTML = svgCopied;
                    setTimeout(() => {
                        button.innerHTML = svgDefault;
                    }, 500);
                });
            });
            titleContainer.appendChild(button);
            infoContainer.appendChild(titleContainer);

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