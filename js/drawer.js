// Вызов меню
function toggleDrawer() {
  const drawer = document.getElementById('drawer');
  const btn = document.getElementById('menu-toggle');
  drawer.classList.toggle('open');
  btn.classList.toggle('drawer-open');
}

// Переключение темы
function toggleTheme() {
    const body = document.body;
    const themeToggleButton = document.getElementById('theme-toggle');
    const isDarkTheme = body.classList.toggle('dark-theme'); // Переключаем класс темы

    // Сохраняем текущую тему в localStorage
    const newTheme = isDarkTheme ? 'dark' : 'light';
    localStorage.setItem('theme', newTheme);

    // Обновляем иконки на кнопке
    const iconDay = themeToggleButton.querySelector('.icon-day');
    const iconNight = themeToggleButton.querySelector('.icon-night');
    if (isDarkTheme) {
        iconDay.style.display = 'none';
        iconNight.style.display = 'inline';
    } else {
        iconDay.style.display = 'inline';
        iconNight.style.display = 'none';
    }
}

// Устанавливаем тему при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    const body = document.body;
    const themeToggleButton = document.getElementById('theme-toggle');
    const iconDay = themeToggleButton.querySelector('.icon-day');
    const iconNight = themeToggleButton.querySelector('.icon-night');

    if (savedTheme === 'dark') {
        body.classList.add('dark-theme');
        iconDay.style.display = 'none';
        iconNight.style.display = 'inline';
    } else {
        body.classList.remove('dark-theme');
        iconDay.style.display = 'inline';
        iconNight.style.display = 'none';
    }
}
)