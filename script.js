document.addEventListener('DOMContentLoaded', () => {
  const sidebar = document.getElementById('sidebar');
  const contentArea = document.getElementById('content-area');

  // Verify if data exists
  if (!window.courseData || window.courseData.length === 0) {
    contentArea.innerHTML = `
      <div class="empty-state">
        <i class="fas fa-exclamation-triangle"></i>
        <p>No se pudo cargar el temario. Verifica data.js.</p>
      </div>`;
    return;
  }

  // 1. Renderizar Botones del Menú (Sidebar)
  window.courseData.forEach((weekData, index) => {
    const btn = document.createElement('button');
    btn.className = 'week-btn';
    if (index === 0) btn.classList.add('active'); // Seleccionar el primero por defecto

    btn.innerHTML = `
      <span class="week-number">${weekData.week}</span>
      <span class="week-title">${weekData.title}</span>
    `;

    btn.addEventListener('click', () => {
      // Remover clase active de todos los botones
      document.querySelectorAll('.week-btn').forEach(b => b.classList.remove('active'));
      // Añadir al botón actual
      btn.classList.add('active');
      // Renderizar el contenido
      renderContent(weekData);
    });

    sidebar.appendChild(btn);
  });

  // Renderizar la primera semana al cargar
  renderContent(window.courseData[0]);

  // 2. Función para renderizar el contenido en la zona principal
  function renderContent(weekData) {
    // Re-ejecutar animación
    contentArea.style.animation = 'none';
    contentArea.offsetHeight; /* trigger reflow */
    contentArea.style.animation = 'fadeIn 0.4s ease-out';

    let html = `
      <div class="content-header">
        <h2>${weekData.week}: ${weekData.title}</h2>
      </div>
      <div class="items-grid">
    `;

    if (weekData.items && weekData.items.length > 0) {
      weekData.items.forEach(item => {
        // Asignar icono visual dependiendo si es book, video o info
        let iconClass = 'fas fa-book';
        if (item.type === 'video') iconClass = 'fas fa-video';
        if (item.type === 'info') iconClass = 'fas fa-info-circle';

        // Si el item tiene URL, lo hacemos clickeable como acordeón
        const onclickAttr = item.url ? `onclick="this.classList.toggle('expanded')"` : '';
        const cursorStyle = item.url ? 'style="cursor: pointer;"' : '';

        html += `
          <div class="content-item" ${onclickAttr} ${cursorStyle}>
            <div class="content-item-header">
              <div class="header-left">
                <div class="item-icon">
                  <i class="${iconClass}"></i>
                </div>
                <div class="item-details">
                  <h3>${item.title}</h3>
                </div>
              </div>
              ${item.url ? '<i class="fas fa-chevron-down toggle-icon"></i>' : ''}
            </div>`;

        if (item.url) {
          let defHTML = '';
          if (item.definicion && item.definicion.length > 0) {
            defHTML = `<div class="details-section"><h4>Definición</h4><ul>` + 
                      item.definicion.map(d => `<li>${d}</li>`).join('') + 
                      `</ul></div>`;
          } else {
            defHTML = `<div class="details-section"><h4>Definición</h4><p>Cargando información médica...</p></div>`;
          }

          let carHTML = '';
          if (item.caracteristicas && item.caracteristicas.length > 0) {
            carHTML = `<div class="details-section"><h4>Características Microscópicas</h4><ul>` + 
                      item.caracteristicas.map(c => `<li>${c}</li>`).join('') + 
                      `</ul></div>`;
          } else {
            carHTML = `<div class="details-section"><h4>Características Microscópicas</h4><p>Cargando características...</p></div>`;
          }

          html += `
            <div class="details-panel" onclick="event.stopPropagation()">
              ${defHTML}
              ${carHTML}
              <a href="${item.url}" target="_blank" class="btn-pathpresenter">
                <i class="fas fa-microscope"></i> Ver Lámina en PathPresenter
              </a>
            </div>`;
        }

        html += `</div>`;
      });
    } else {
      html += `
        <div class="empty-state" style="grid-column: 1 / -1;">
          <i class="fas fa-folder-open"></i>
          <p>No hay contenido asignado para esta semana aún.</p>
        </div>
      `;
    }

    html += `</div>`;
    contentArea.innerHTML = html;
  }
});
