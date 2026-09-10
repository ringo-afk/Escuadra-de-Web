async function loadNavbar() {
  const response = await fetch('navbar.html');
  const html = await response.text();

  const temp = document.createElement('div');
  temp.innerHTML = html;

  const header = temp.querySelector('#topbar');
  const sidebar = temp.querySelector('#sidebar');

  const headerPlaceholder = document.getElementById('header-placeholder');
  const sidebarPlaceholder = document.getElementById('sidebar-placeholder');

  if (headerPlaceholder) headerPlaceholder.replaceWith(header);
  if (sidebarPlaceholder) sidebarPlaceholder.replaceWith(sidebar);

  highlightActiveLink();
}

function highlightActiveLink() {
  const currentPage = window.location.pathname.split('/').pop() || 'dashboard.html';

  document.querySelectorAll('.sidebar .nav-link').forEach((link) => {
    if (link.getAttribute('href') === currentPage) {
      link.classList.add('active');
    }
  });
}

loadNavbar();
