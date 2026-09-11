document.addEventListener('DOMContentLoaded', () => {
  const filtroAnio = document.getElementById('filtroAnio');
  const filtroMes = document.getElementById('filtroMes');
  const btnLimpiar = document.getElementById('btnLimpiarFiltros');
  const checkAll = document.getElementById('checkAll');
  const btnDescargarSeleccionadas = document.getElementById('btnDescargarSeleccionadas');
  const tbody = document.getElementById('payrollTableBody');
  const totalDepositado = document.getElementById('totalDepositado');
  const totalRecibos = document.getElementById('totalRecibos');

  const parseNeto = (row) =>
    parseFloat(
      row.querySelector('.payroll-amount').textContent.replace(/[^0-9.-]/g, '')
    );

  function aplicarFiltros() {
    const anio = filtroAnio.value;
    const mes = filtroMes.value;
    let visibles = 0;
    let sumaNeto = 0;

    tbody.querySelectorAll('tr').forEach((row) => {
      const coincideAnio = anio === 'todos' || row.dataset.anio === anio;
      const coincideMes = mes === 'todos' || row.dataset.mes === mes;
      const visible = coincideAnio && coincideMes;

      row.style.display = visible ? '' : 'none';

      if (visible) {
        visibles += 1;
        sumaNeto += parseNeto(row);
      } else {
        row.querySelector('.row-check').checked = false;
      }
    });

    totalRecibos.textContent = visibles;
    totalDepositado.textContent = sumaNeto.toLocaleString('es-MX', {
      style: 'currency',
      currency: 'MXN',
    });

    checkAll.checked = false;
    actualizarBotonDescarga();
  }

  function actualizarBotonDescarga() {
    const algunaSeleccionada = !!tbody.querySelector('.row-check:checked');
    btnDescargarSeleccionadas.disabled = !algunaSeleccionada;
  }

  filtroAnio.addEventListener('change', aplicarFiltros);
  filtroMes.addEventListener('change', aplicarFiltros);

  btnLimpiar.addEventListener('click', () => {
    filtroAnio.value = 'todos';
    filtroMes.value = 'todos';
    aplicarFiltros();
  });

  checkAll.addEventListener('change', () => {
    tbody.querySelectorAll('tr').forEach((row) => {
      if (row.style.display !== 'none') {
        row.querySelector('.row-check').checked = checkAll.checked;
      }
    });
    actualizarBotonDescarga();
  });

  tbody.addEventListener('change', (e) => {
    if (e.target.classList.contains('row-check')) {
      actualizarBotonDescarga();
    }
  });

  tbody.addEventListener('click', (e) => {
    const btn = e.target.closest('.btn-pdf');
    if (btn) {
      const periodo = btn.closest('tr').querySelector('.payroll-period').textContent;
      
      console.log('Descargando recibo:', periodo);
    }
  });

  btnDescargarSeleccionadas.addEventListener('click', () => {
    const periodos = Array.from(tbody.querySelectorAll('.row-check:checked')).map(
      (cb) => cb.closest('tr').querySelector('.payroll-period').textContent
    );
    
    console.log('Descargando recibos seleccionados:', periodos);
  });

  actualizarBotonDescarga();
});