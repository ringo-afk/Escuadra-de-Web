/* =========================================
   Mini-calendario de vacaciones (popover) + cálculo
   de días hábiles. Expone window.VacCalendario para
   que vacaciones.js lo use sin repetir esta lógica.
   ========================================= */
(function (window) {
  // Festivos oficiales (MX) — ajusta/alimenta desde tu backend cuando lo tengas.
  const FERIADOS = new Set([
    '2025-01-01', '2025-02-03', '2025-03-17', '2025-05-01', '2025-09-16', '2025-11-17', '2025-12-25',
    '2026-01-01', '2026-02-02', '2026-03-16', '2026-05-01', '2026-09-16', '2026-11-16', '2026-12-25',
  ]);

  const MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
  const DIAS = ['Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sá', 'Do'];

  const pad = (n) => String(n).padStart(2, '0');
  const toISO = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  const parseISO = (iso) => { const [y, m, d] = iso.split('-').map(Number); return new Date(y, m - 1, d); };
  const formatEs = (iso) => iso.split('-').reverse().join('/');
  const esFinde = (d) => [0, 6].includes(d.getDay());

  // Descanso = lunes a viernes SIN festivo. Único que cuenta como vacaciones.
  function resumenRango(inicioISO, finISO) {
    const fin = parseISO(finISO);
    const r = { descanso: 0, finDeSemana: 0, festivos: 0 };
    for (let d = parseISO(inicioISO); d <= fin; d.setDate(d.getDate() + 1)) {
      if (esFinde(d)) r.finDeSemana += 1;
      else if (FERIADOS.has(toISO(d))) r.festivos += 1;
      else r.descanso += 1;
    }
    r.total = r.descanso + r.finDeSemana + r.festivos;
    return r;
  }

  function mesHTML(year, mes, inicio, fin) {
    const offset = (new Date(year, mes, 1).getDay() + 6) % 7; // 0 = lunes
    const dias = new Date(year, mes + 1, 0).getDate();
    let celdas = '<span class="cal-day cal-day-empty"></span>'.repeat(offset);

    for (let d = 1; d <= dias; d += 1) {
      const actual = new Date(year, mes, d);
      const clase = [toISO(inicio), toISO(fin)].includes(toISO(actual)) ? 'cal-day-edge'
        : (actual > inicio && actual < fin) ? 'cal-day-in-range' : '';
      celdas += `<span class="cal-day ${clase}">${d}</span>`;
    }

    const encabezado = DIAS.map((d) => `<span class="cal-weekday">${d}</span>`).join('');
    return `<div class="cal-month"><div class="cal-month-title">${MESES[mes]} ${year}</div><div class="cal-grid">${encabezado}${celdas}</div></div>`;
  }

  function calendarioHTML(inicioISO, finISO) {
    const inicio = parseISO(inicioISO);
    const fin = parseISO(finISO);
    const limite = new Date(fin.getFullYear(), fin.getMonth(), 1);
    let html = '';
    for (const c = new Date(inicio.getFullYear(), inicio.getMonth(), 1); c <= limite; c.setMonth(c.getMonth() + 1)) {
      html += mesHTML(c.getFullYear(), c.getMonth(), inicio, fin);
    }
    return `<div class="cal-popover-content">${html}</div>`;
  }

  // Crea (o reusa) el popover de Bootstrap en cada botón .btn-calendar-view dentro de `root`.
  function initBotones(root) {
    root.querySelectorAll('.btn-calendar-view:not([data-popover-init])').forEach((btn) => {
      btn.dataset.popoverInit = 'true';
      // eslint-disable-next-line no-new
      new bootstrap.Popover(btn, {
        html: true,
        sanitize: false,
        trigger: 'click',
        placement: 'bottom',
        customClass: 'vacation-calendar-popover',
        content: () => calendarioHTML(btn.dataset.start, btn.dataset.end),
      });
    });
  }

  document.addEventListener('click', (e) => {
    if (e.target.closest('.btn-calendar-view') || e.target.closest('.popover')) return;
    document.querySelectorAll('.btn-calendar-view').forEach((btn) => {
      bootstrap.Popover.getInstance(btn)?.hide();
    });
  });

  window.VacCalendario = { resumenRango, initBotones, formatEs, parseISO };
})(window);