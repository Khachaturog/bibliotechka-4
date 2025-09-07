function toggleDrawer() {
  const drawer = document.getElementById('drawer');
  const btn = document.querySelector('.header-button-burger');
  drawer.classList.toggle('open');
  btn.classList.toggle('drawer-open');
}