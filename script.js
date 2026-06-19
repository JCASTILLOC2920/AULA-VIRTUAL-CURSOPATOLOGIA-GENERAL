document.addEventListener('DOMContentLoaded', () => {
  const sidebar = document.getElementById('sidebar');
  const contentArea = document.getElementById('content-area');
  const btnPractico = document.getElementById('btn-cronograma-practico');
  const btnTeorico = document.getElementById('btn-cronograma-teorico');

  let currentMode = 'practico'; // 'practico' or 'teorico'
  let activePracticoIndex = 0;
  let activeTeoricoIndex = 0;

  // Verify if data exists
  if (!window.courseData || window.courseData.length === 0) {
    contentArea.innerHTML = `
      <div class="empty-state">
        <i class="fas fa-exclamation-triangle"></i>
        <p>No se pudo cargar el temario de prácticas. Verifica data.js.</p>
      </div>`;
    return;
  }

  // 1. Renderizar Botones del Menú (Sidebar) según el modo activo
  function loadSidebar(mode) {
    sidebar.innerHTML = ''; // Limpiar botones anteriores
    const data = mode === 'practico' ? window.courseData : window.theoryData;
    const activeIndex = mode === 'practico' ? activePracticoIndex : activeTeoricoIndex;

    if (!data || data.length === 0) {
      contentArea.innerHTML = `
        <div class="empty-state">
          <i class="fas fa-exclamation-triangle"></i>
          <p>No se pudo cargar el cronograma de teoría. Verifica data.js.</p>
        </div>`;
      return;
    }

    data.forEach((weekData, index) => {
      const btn = document.createElement('button');
      btn.className = 'week-btn';
      if (index === activeIndex) btn.classList.add('active');

      btn.innerHTML = `
        <span class="week-number">${weekData.week}</span>
        <span class="week-title">${weekData.title}</span>
      `;

      btn.addEventListener('click', () => {
        // Remover clase active de todos los botones
        document.querySelectorAll('.week-btn').forEach(b => b.classList.remove('active'));
        // Añadir al botón actual
        btn.classList.add('active');

        // Guardar índice activo
        if (mode === 'practico') {
          activePracticoIndex = index;
          renderPracticalContent(weekData);
        } else {
          activeTeoricoIndex = index;
          renderTheoreticalContent(weekData);
        }

        // Cerrar menú móvil al hacer clic
        sidebar.classList.remove('open');
        const hamburger = document.getElementById('hamburger');
        if (hamburger) hamburger.classList.remove('active');
      });

      sidebar.appendChild(btn);
    });

    // Renderizar el contenido inicial activo
    if (mode === 'practico') {
      renderPracticalContent(data[activeIndex]);
    } else {
      renderTheoreticalContent(data[activeIndex]);
    }
  }

  // 2. Función para renderizar el contenido Práctico (Láminas y Videos)
  function renderPracticalContent(weekData) {
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
          <p>No hay contenido práctico asignado para esta semana aún.</p>
        </div>
      `;
    }

    html += `</div>`;
    contentArea.innerHTML = html;
  }

  // 3. Función para renderizar el contenido de la Clase Teórica
  function renderTheoreticalContent(weekData) {
    // Re-ejecutar animación
    contentArea.style.animation = 'none';
    contentArea.offsetHeight; /* trigger reflow */
    contentArea.style.animation = 'fadeIn 0.4s ease-out';

    let topicsHTML = '';
    if (weekData.topics && weekData.topics.length > 0) {
      weekData.topics.forEach(topic => {
        topicsHTML += `
          <div class="content-item" style="cursor: default;">
            <div class="content-item-header">
              <div class="header-left">
                <div class="item-icon" style="background-color: rgba(0, 210, 255, 0.15); color: var(--neon-blue);">
                  <i class="fas fa-book-open"></i>
                </div>
                <div class="item-details">
                  <h3>${topic}</h3>
                  <span>Tema de la Clase</span>
                </div>
              </div>
            </div>
          </div>
        `;
      });
    } else {
      topicsHTML = `
        <div class="empty-state" style="grid-column: 1 / -1;">
          <i class="fas fa-folder-open"></i>
          <p>No hay temas registrados para esta clase teórica.</p>
        </div>
      `;
    }

    const html = `
      <div class="content-header">
        <h2>${weekData.week}: ${weekData.title}</h2>
      </div>
      
      <!-- Grid de Información de la Clase Teórica -->
      <div class="class-info-grid">
        <div class="info-card">
          <i class="fas fa-calendar-day"></i>
          <div>
            <h4>Fecha de Clase</h4>
            <p>${weekData.date}</p>
          </div>
        </div>
        <div class="info-card">
          <i class="fas fa-user-tie"></i>
          <div>
            <h4>Docente(s) Responsable(s)</h4>
            <p>${weekData.teachers}</p>
          </div>
        </div>
        <div class="info-card">
          <i class="fas fa-map-marker-alt"></i>
          <div>
            <h4>Lugar de Clase</h4>
            <p>${weekData.location}</p>
          </div>
        </div>
      </div>
      
      <div class="theory-section-title">
        <i class="fas fa-list-ol"></i> Desarrollo de la Clase Teórica
      </div>
      
      <div class="items-grid">
        ${topicsHTML}
      </div>
    `;

    contentArea.innerHTML = html;
  }

  // 4. Manejadores para Cambiar de Modo (Práctico vs Teórico)
  if (btnPractico && btnTeorico) {
    btnPractico.addEventListener('click', () => {
      if (currentMode === 'practico') return;
      currentMode = 'practico';
      btnTeorico.classList.remove('active');
      btnPractico.classList.add('active');
      loadSidebar('practico');
    });

    btnTeorico.addEventListener('click', () => {
      if (currentMode === 'teorico') return;
      currentMode = 'teorico';
      btnPractico.classList.remove('active');
      btnTeorico.classList.add('active');
      loadSidebar('teorico');
    });
  }

  // Cargar cronograma práctico al inicio
  loadSidebar('practico');

  // Hamburger drawer toggle
  const hamburger = document.getElementById('hamburger');
  if (hamburger) {
    hamburger.addEventListener('click', () => {
      sidebar.classList.toggle('open');
      hamburger.classList.toggle('active');
    });
  }

  // --- WEB SPEECH API (Voice Assistant adaptado para ambos cronogramas) ---
  const voiceBtn = document.getElementById('voice-assistant-btn');
  let isRecording = false;
  let recognition;
  
  const voiceToast = document.createElement('div');
  voiceToast.className = 'voice-toast';
  document.body.appendChild(voiceToast);
  
  function showToast(msg, duration=3000) {
      voiceToast.textContent = msg;
      voiceToast.classList.add('show');
      setTimeout(() => voiceToast.classList.remove('show'), duration);
  }
 
  if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognition = new SpeechRecognition();
      recognition.lang = 'es-PE';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = function() {
          isRecording = true;
          if (voiceBtn) voiceBtn.classList.add('recording');
          showToast("🎙️ Te escucho, Comandante...");
      };

      recognition.onresult = function(event) {
          const speechResult = event.results[0][0].transcript.toLowerCase();
          showToast(`🗣️ Orden recibida: "${speechResult}"`);
          
          // Cambiar de modo por comando de voz
          if (speechResult.includes("práctico") || speechResult.includes("practico") || speechResult.includes("práctica")) {
              if (btnPractico) btnPractico.click();
              showToast("🔄 Cambiando a Cronograma Práctico");
              return;
          }
          if (speechResult.includes("clase") || speechResult.includes("clases") || speechResult.includes("teórico") || speechResult.includes("teorico") || speechResult.includes("teoría")) {
              if (btnTeorico) btnTeorico.click();
              showToast("🔄 Cambiando a Cronograma de Clases");
              return;
          }
          
          let found = false;
          const data = currentMode === 'practico' ? window.courseData : window.theoryData;
          
          data.forEach((weekData) => {
             const weekNum = weekData.week.toLowerCase(); 
             if (speechResult.includes(weekNum) || speechResult.includes(weekNum.replace("semana ", ""))) {
                  document.querySelectorAll('.week-btn').forEach(btn => {
                      if (btn.innerText.toLowerCase().includes(weekNum)) {
                          btn.click();
                          found = true;
                      }
                  });
             }
          });
          
          if(!found) {
              setTimeout(() => showToast("❌ Módulo no encontrado. Intente decir 'Semana 3'"), 2000);
          }
      };

      recognition.onerror = function(event) {
          showToast("❌ Error acústico: " + event.error);
          isRecording = false;
          if (voiceBtn) voiceBtn.classList.remove('recording');
      };

      recognition.onend = function() {
          isRecording = false;
          if (voiceBtn) voiceBtn.classList.remove('recording');
      };

      if (voiceBtn) {
          voiceBtn.addEventListener('click', () => {
              if (isRecording) {
                  recognition.stop();
              } else {
                  recognition.start();
              }
          });
      }
  } else {
      if (voiceBtn) {
          voiceBtn.addEventListener('click', () => {
              showToast("❌ Infraestructura de voz no compatible en este navegador.");
          });
      }
  }
});
