// async function loadData() {
//     const [dataResponse, groupsResponse, subgroupsResponse] = await Promise.all([
//         fetch('data/data.json'),
//         fetch('data/group.json'),
//         fetch('data/subgroup.json')
//     ]);

//     const data = await dataResponse.json();
//     const groups = await groupsResponse.json();
//     const subgroups = await subgroupsResponse.json();

//     if (window.location.pathname.includes('detail.html')) {
//         displayDetail(data);
//     } else if (window.location.pathname.includes('group.html')) {
//         // Показываем отфильтрованные карточки на странице группы
//         const params = new URLSearchParams(window.location.search);
//         const groupSlug = params.get('slug');
//         const group = groups.find(g => g.slug === groupSlug);
        
//         if (group) {
//             document.getElementById('container-title').textContent = group.title;
//             const filteredData = data.filter(item => item.group_slug === groupSlug);
//             displaySubgroupsAndCards(filteredData, subgroups);
//         }
//     } else {
//         // На главной показываем все разделы и все карточки
//         displayGroups(groups);
//         displayCards(data);
//     }
// }

// document.addEventListener('DOMContentLoaded', loadData);
