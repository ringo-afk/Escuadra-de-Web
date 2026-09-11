document.addEventListener('DOMContentLoaded', () => {
  const { resumenRango, initBotones, formatEs, parseISO } = window.VacCalendario;
  initBotones(document);

  const form = document.getElementById('formSolicitud');
  const alertBox = document.getElementById('formAlert');
  const historyList = document.getElementById('historyList');
  const diasDisponiblesEl = document.getElementById('diasDisponibles');

  const aviso = (msg) => {
    alertBox.textContent = msg;
    alertBox.classList.toggle('d-none', !msg);
  };

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    aviso('');

    const inicio = form.fechaInicio.value;
    const regreso = form.fechaRegreso.value;
    const motivo = form.motivo.value.trim();

    if (!inicio || !regreso) return aviso('Selecciona la fecha de inicio y la fecha de regreso.');
    if (parseISO(regreso) < parseISO(inicio)) return aviso('La fecha de regreso no puede ser anterior a la de inicio.');

    const r = resumenRango(inicio, regreso);

    // Solo cuentan como vacaciones los días hábiles (L-V sin festivos).
    if (!r.descanso) return aviso('El rango seleccionado no incluye días hábiles (lunes a viernes, sin festivos). Ajusta las fechas.');

    // TODO: reemplazar con la llamada real al backend para crear la solicitud.
    historyList.insertAdjacentHTML('afterbegin', `
      <div class="list-group-item">
        <div class="history-item-main">
          <div class="history-item-title">
            <button type="button" class="btn-calendar-view" data-start="${inicio}" data-end="${regreso}" aria-label="Ver calendario"><i class="bi bi-calendar3"></i></button>
            <span>${formatEs(inicio)} – ${formatEs(regreso)} · <strong>${r.descanso}</strong> día(s)</span>
          </div>
          <span class="badge-status badge-pending">Pendiente</span>
        </div>
        <div class="history-item-meta">Descanso: <strong>${r.descanso} día(s)</strong> · Fin de semana: <strong>${r.finDeSemana} día(s)</strong> · Festivos: <strong>${r.festivos} día(s)</strong> · Total: <strong class="meta-total">${r.total} día(s)</strong></div>
        <div class="history-item-motivo">${motivo || 'Sin motivo especificado'}</div>
      </div>
    `);
    initBotones(historyList);

    diasDisponiblesEl.textContent = Math.max(0, +diasDisponiblesEl.textContent - r.descanso);
    form.reset();
  });
});