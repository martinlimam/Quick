// Espera a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', () => {

    // --- 1. Selección de Elementos del DOM ---
    const tipoServicioSelect = document.getElementById('tipoServicio');
    const cantidadMasajistasInput = document.getElementById('cantidadMasajistas');
    const duracionMasajeGroup = document.getElementById('duracionMasajeGroup');
    const duracionMasajeSeleccionadaInput = document.getElementById('duracionMasajeSeleccionada');
    const nivelPrecioSelect = document.getElementById('nivelPrecio');
    const duracionBtns = document.querySelectorAll('.duracion-btn');
    const detallesServicioSection = document.getElementById('detallesServicio');
    const detallesEventualDiv = document.getElementById('detallesEventual');
    const detallesCorporativoDiv = document.getElementById('detallesCorporativo');
    const detallesDeportivoDiv = document.getElementById('detallesDeportivo');
    const horasCoberturaEventualInput = document.getElementById('horasCoberturaEventual');
    const horasCoberturaEventualValueSpan = document.getElementById('horasCoberturaEventualValue');
    const diaPredominanteEventualSelect = document.getElementById('diaPredominanteEventual');
    const numeroDiasEventualInput = document.getElementById('numeroDiasEventual');
    const frecuenciaCorporativoSelect = document.getElementById('frecuenciaCorporativo');
    const horasCoberturaDeportivoInput = document.getElementById('horasCoberturaDeportivo');
    const horasCoberturaDeportivoValueSpan = document.getElementById('horasCoberturaDeportivoValue');
    const diaPredominanteDeportivoSelect = document.getElementById('diaPredominanteDeportivo');
    const numeroDiasDeportivoInput = document.getElementById('numeroDiasDeportivo');
    const montoAdicionalInput = document.getElementById('montoAdicional');
    const conceptoAdicionalInput = document.getElementById('conceptoAdicional');
    const resumenPresupuestoSection = document.getElementById('resumenPresupuesto');
    const resultadoPrecioTotalSpan = document.getElementById('resultadoPrecioTotal');
    const resultadoGananciaEstimadaSpan = document.getElementById('resultadoGananciaEstimada');
    const detallePrecioBaseSpan = document.getElementById('detallePrecioBase');
    const detalleCostoAdicionalSpan = document.getElementById('detalleCostoAdicional');
    const detallePagoMasajistaSpan = document.getElementById('detallePagoMasajista');
    const detalleCostoTotalMasajistasSpan = document.getElementById('detalleCostoTotalMasajistas');
    const seccionDetalleMasajesDiv = document.getElementById('seccionDetalleMasajes');
    const detalleDuracionSeleccionadaSpan = document.getElementById('detalleDuracionSeleccionada');
    const detalleMasajesPorVisitaSpan = document.getElementById('detalleMasajesPorVisita');
    const detalleMasajesTotalesSpan = document.getElementById('detalleMasajesTotales');
    const etiquetasPeriodoSpans = document.querySelectorAll('.etiqueta-periodo');
    const etiquetasPeriodoDetalleSpans = document.querySelectorAll('.etiqueta-periodo-detalle');
    const limpiarBtn = document.getElementById('limpiarBtn');
    const imprimirBtn = document.getElementById('imprimirBtn');
    const duracionVisitaCorporativoSlider = document.getElementById('duracionVisitaCorporativoSlider');
    const duracionVisitaCorporativoValueSpan = document.getElementById('duracionVisitaCorporativoValue');
    const fechaActualSpan = document.getElementById('fechaActual'); // NUEVO: Elemento fecha

    let datosPrecios = null;
    let rutaJsonActual = '';

    // --- 2. Estado Inicial y Configuración ---
    function inicializarCalculadora() {
        mostrarFechaActual(); // NUEVO: Mostrar fecha
        detallesEventualDiv.style.display = 'none';
        detallesCorporativoDiv.style.display = 'none';
        detallesDeportivoDiv.style.display = 'none';
        seccionDetalleMasajesDiv.style.display = 'none';
        horasCoberturaEventualValueSpan.textContent = horasCoberturaEventualInput.value;
        horasCoberturaDeportivoValueSpan.textContent = horasCoberturaDeportivoInput.value;
        duracionVisitaCorporativoValueSpan.textContent = duracionVisitaCorporativoSlider.value;
        duracionBtns.forEach(btn => btn.classList.remove('active'));
        document.querySelector('.duracion-btn[data-value="10"]').classList.add('active');
        duracionMasajeSeleccionadaInput.value = "10";
        actualizarVisibilidadDetalleMasajes('10');
        limpiarFormulario();
        tipoServicioSelect.addEventListener('change', manejarCambioTipoServicio);

        // Validar inputs numéricos al perder foco (blur)
        validarInputNumericoEnBlur(cantidadMasajistasInput);
        validarInputNumericoEnBlur(numeroDiasEventualInput);
        validarInputNumericoEnBlur(numeroDiasDeportivoInput);
        // Los inputs también dispararán el cálculo al cambiar (si se escribe o pega)
        cantidadMasajistasInput.addEventListener('input', calcularPresupuesto);
        numeroDiasEventualInput.addEventListener('input', calcularPresupuesto);
        numeroDiasDeportivoInput.addEventListener('input', calcularPresupuesto);


        nivelPrecioSelect.addEventListener('change', calcularPresupuesto);
        montoAdicionalInput.addEventListener('input', calcularPresupuesto);
        duracionBtns.forEach(btn => { btn.addEventListener('click', manejarClickDuracionMasaje); });
        horasCoberturaEventualInput.addEventListener('input', () => { horasCoberturaEventualValueSpan.textContent = horasCoberturaEventualInput.value; calcularPresupuesto(); });
        horasCoberturaDeportivoInput.addEventListener('input', () => { horasCoberturaDeportivoValueSpan.textContent = horasCoberturaDeportivoInput.value; calcularPresupuesto(); });
        duracionVisitaCorporativoSlider.addEventListener('input', () => { duracionVisitaCorporativoValueSpan.textContent = duracionVisitaCorporativoSlider.value; calcularPresupuesto(); });
        diaPredominanteEventualSelect.addEventListener('change', calcularPresupuesto);
        frecuenciaCorporativoSelect.addEventListener('change', calcularPresupuesto);
        diaPredominanteDeportivoSelect.addEventListener('change', calcularPresupuesto);
        limpiarBtn.addEventListener('click', limpiarFormulario);
        imprimirBtn.addEventListener('click', imprimir);

        // NUEVO: Listeners para botones +/-
        document.querySelectorAll('.btn-increment, .btn-decrement').forEach(button => {
            button.addEventListener('click', handleNumberButtonClick);
        });
    }

    // --- NUEVA FUNCIÓN: Mostrar Fecha Actual ---
    function mostrarFechaActual() {
        const hoy = new Date();
        const dia = String(hoy.getDate()).padStart(2, '0');
        const mes = String(hoy.getMonth() + 1).padStart(2, '0'); // Meses son 0-indexados
        const anio = hoy.getFullYear();
        fechaActualSpan.textContent = `${dia}/${mes}/${anio}`;
    }

    // --- NUEVA FUNCIÓN: Manejar Clic en Botones +/- ---
    function handleNumberButtonClick(event) {
        const button = event.target;
        const targetInputId = button.dataset.target;
        const targetInput = document.getElementById(targetInputId);

        if (!targetInput) return;

        const min = parseInt(targetInput.min);
        const max = parseInt(targetInput.max);
        let currentValue = parseInt(targetInput.value);

        if (isNaN(currentValue)) {
            currentValue = min || 1; // Si no es número, empezar desde el mínimo o 1
        }

        if (button.classList.contains('btn-increment')) {
            if (isNaN(max) || currentValue < max) { // Incrementar si no hay max o es menor que max
                currentValue++;
            }
        } else if (button.classList.contains('btn-decrement')) {
            if (isNaN(min) || currentValue > min) { // Decrementar si no hay min o es mayor que min
                 currentValue--;
            }
        }

        targetInput.value = currentValue;

        // Disparar el evento 'input' para que calcularPresupuesto se ejecute
        targetInput.dispatchEvent(new Event('input', { bubbles: true }));
    }


    // --- FUNCIÓN MODIFICADA: Solo Validación en Blur ---
    function validarInputNumericoEnBlur(inputElement) {
         inputElement.addEventListener('blur', () => {
            const min = parseInt(inputElement.min);
            const max = parseInt(inputElement.max);
            let value = parseInt(inputElement.value);
            let valorOriginal = inputElement.value; // Guardar valor original por si acaso

            if (isNaN(value)) {
                 value = min || 1; // Si no es número, usar el mínimo o 1
            }
            if (!isNaN(min) && value < min) {
                value = min;
            }
            if (!isNaN(max) && value > max) {
                 value = max;
            }
             // Solo actualizar y recalcular si el valor validado es diferente al original
            if (String(value) !== valorOriginal) {
                 inputElement.value = value;
                 calcularPresupuesto();
             }
        });
         // Prevenir entrada por rueda del mouse (opcional pero recomendado)
         inputElement.addEventListener('wheel', (event) => { event.preventDefault(); });
    }

    // --- 3. Funciones UI Dinámica ---
    function manejarCambioTipoServicio() {
        const tipoSeleccionado = tipoServicioSelect.value;
        detallesEventualDiv.style.display = 'none';
        detallesCorporativoDiv.style.display = 'none';
        detallesDeportivoDiv.style.display = 'none';
        datosPrecios = null;
        rutaJsonActual = '';
        if (!tipoSeleccionado) { ajustarOpcionesMasajistas(null); actualizarNivelesPrecio(null); actualizarEtiquetasPeriodo(null); limpiarResumen(); return; }
        if (tipoSeleccionado === 'eventual') { detallesEventualDiv.style.display = 'block'; }
        else if (tipoSeleccionado === 'corporativo') { detallesCorporativoDiv.style.display = 'block'; }
        else if (tipoSeleccionado === 'deportivo') { detallesDeportivoDiv.style.display = 'block'; }
        ajustarOpcionesMasajistas(tipoSeleccionado);
        actualizarNivelesPrecio(tipoSeleccionado);
        actualizarEtiquetasPeriodo(tipoSeleccionado);
        calcularPresupuesto();
    }
    function ajustarOpcionesMasajistas(tipo) {
        let maxMasajistas = 1;
        let minMasajistas = 1; // Mínimo siempre 1
        if (tipo === 'eventual') { maxMasajistas = 3; }
        else if (tipo === 'corporativo') { maxMasajistas = 2; }
        else if (tipo === 'deportivo') { maxMasajistas = 4; }
        cantidadMasajistasInput.max = maxMasajistas;
        cantidadMasajistasInput.min = minMasajistas; // Asegurar mínimo
        let currentValue = parseInt(cantidadMasajistasInput.value);
        if (isNaN(currentValue) || currentValue < minMasajistas) { cantidadMasajistasInput.value = minMasajistas; }
        else if (currentValue > maxMasajistas) { cantidadMasajistasInput.value = maxMasajistas; }
    }
    function actualizarNivelesPrecio(tipo) {
        nivelPrecioSelect.innerHTML = '';
        if (!tipo) { nivelPrecioSelect.innerHTML = '<option value="">-- Seleccione Tipo Servicio --</option>'; return; }
        let opciones = [];
        if (tipo === 'eventual' || tipo === 'corporativo') { opciones = [{ value: 'PA', text: 'Alto' }, { value: 'PM', text: 'Medio' }, { value: 'PB', text: 'Bajo' }]; }
        else if (tipo === 'deportivo') { opciones = [{ value: 'PA', text: 'Alto' }, { value: 'PD', text: 'Descuento' }]; }
        nivelPrecioSelect.innerHTML = '<option value="">-- Seleccione Nivel --</option>';
        opciones.forEach(op => { const option = document.createElement('option'); option.value = op.value; option.textContent = op.text; nivelPrecioSelect.appendChild(option); });
    }
    function actualizarEtiquetasPeriodo(tipo) {
        let etiquetaPeriodo = "Evento/Plan"; let etiquetaDetalle = "por día/mes";
        if (tipo === 'eventual' || tipo === 'deportivo') { etiquetaPeriodo = "Evento"; etiquetaDetalle = "por día"; }
        else if (tipo === 'corporativo') { etiquetaPeriodo = "Plan"; etiquetaDetalle = "por mes"; }
        etiquetasPeriodoSpans.forEach(span => span.textContent = etiquetaPeriodo);
        etiquetasPeriodoDetalleSpans.forEach(span => span.textContent = etiquetaDetalle);
    }
    function manejarClickDuracionMasaje(event) {
        const botonClickeado = event.target; const valorSeleccionado = botonClickeado.dataset.value;
        duracionBtns.forEach(btn => btn.classList.remove('active')); botonClickeado.classList.add('active');
        duracionMasajeSeleccionadaInput.value = valorSeleccionado;
        actualizarVisibilidadDetalleMasajes(valorSeleccionado);
        if(valorSeleccionado !== 'na'){ detalleDuracionSeleccionadaSpan.textContent = `${valorSeleccionado} min`; }
        else { detalleDuracionSeleccionadaSpan.textContent = 'N/A'; }
        calcularPresupuesto();
    }
    function actualizarVisibilidadDetalleMasajes(duracion) {
        if (duracion === '7' || duracion === '10' || duracion === '15') { seccionDetalleMasajesDiv.style.display = 'block'; }
        else { seccionDetalleMasajesDiv.style.display = 'none'; }
    }

    // --- 4. Carga y Procesamiento JSON ---
     async function cargarDatosJson(ruta) {
        if (ruta === rutaJsonActual && datosPrecios) { return true; }
        try {
            // console.log("Intentando cargar:", ruta);
            const response = await fetch(ruta);
            if (!response.ok) {
                if (response.status === 404) { console.error(`Error: Archivo JSON no encontrado en ${ruta}`); alert(`Error: No se encontró el archivo de precios para esta combinación (${ruta}). Verifique el nombre y ubicación del archivo.`); }
                else { throw new Error(`Error HTTP: ${response.status}`); }
                 return false;
            }
            datosPrecios = await response.json(); rutaJsonActual = ruta;
            // console.log("Datos cargados:", datosPrecios);
            return true;
        } catch (error) {
            console.error('Error general al cargar o procesar el archivo JSON:', error);
            datosPrecios = null; rutaJsonActual = ''; limpiarResumen();
            alert(`Error: No se pudo cargar o leer la tabla de precios (${ruta}). Verifique el archivo.`);
            return false;
        }
    }
    function construirRutaJson(parametros) {
       const { tipoServicio, diaPredominante, cantidadMasajistas } = parametros; let nombreArchivo = '';
        if (tipoServicio === 'eventual') { if (!diaPredominante) return null; nombreArchivo = `Cobertura Unica_${diaPredominante}.json`; }
       else if (tipoServicio === 'corporativo') { if (cantidadMasajistas < 1 || cantidadMasajistas > 2) return null; nombreArchivo = `Corporativo ${cantidadMasajistas}M.json`; }
       else if (tipoServicio === 'deportivo') { if (!diaPredominante) return null; nombreArchivo = `Deportivo_${diaPredominante}.json`; }
       else { return null; }
       return `data/${nombreArchivo}`;
    }
    // --- Función buscarValoresEnJson (Versión V3 - Funcionó) ---
    function buscarValoresEnJson(parametros) {
        if (!datosPrecios) { console.warn("Intento de búsqueda sin datos JSON cargados."); return null; }
        const { tipoServicio, nivelPrecio, cantidadMasajistas, horasCobertura, duracionVisita, frecuencia, diaPredominante } = parametros;
        let bloqueHoras; const horasKey = "Horas x Semana"; let horasBuscadas = null;
        if (tipoServicio === 'corporativo') { horasBuscadas = duracionVisita; }
        else if (tipoServicio === 'eventual' || tipoServicio === 'deportivo') { horasBuscadas = horasCobertura; }
        if (!horasBuscadas) { console.warn("Faltan horas/duración para buscar el bloque."); return null; }
        const horasBuscadasStr = String(horasBuscadas).replace('.', ',');
        bloqueHoras = datosPrecios.find(item => String(item[horasKey]).replace('.', ',') === horasBuscadasStr);
        if (!bloqueHoras) { console.warn(`No se encontró bloque para Horas=${horasBuscadasStr}`); alert(`Error: No existe una tarifa definida para exactamente ${horasBuscadas} horas.`); return null; }
        let claveCostoEsperada = ''; let claveSueldoEsperada = ''; let claveGananciaEsperada = '';
        let masajistasStr = `${cantidadMasajistas}M`;
        if (tipoServicio === 'eventual') { const dia = diaPredominante; if (!dia) return null; claveCostoEsperada = `Costo CU ${dia} ${masajistasStr} ${nivelPrecio}`; claveSueldoEsperada = `Sueldo CU ${dia} ${masajistasStr} ${nivelPrecio}`; claveGananciaEsperada = `Ganancia CU ${dia} ${masajistasStr} ${nivelPrecio}`; }
        else if (tipoServicio === 'corporativo') { if (!frecuencia) return null; claveCostoEsperada = `Costo Plan ${masajistasStr} ${frecuencia} ${nivelPrecio}`; claveSueldoEsperada = `Sueldo ${masajistasStr} ${frecuencia} ${nivelPrecio}`; claveGananciaEsperada = `Ganancia ${masajistasStr} ${frecuencia} ${nivelPrecio}`; }
        else if (tipoServicio === 'deportivo') { const dia = diaPredominante; if (!dia) return null; claveCostoEsperada = `Costo DEP ${dia} ${masajistasStr} ${nivelPrecio}`; claveSueldoEsperada = `Sueldo DEP ${dia} ${masajistasStr} ${nivelPrecio}`; claveGananciaEsperada = `Ganancia DEP ${dia} ${masajistasStr} ${nivelPrecio}`; }
        else { return null; }
        const costo = bloqueHoras[claveCostoEsperada]; const sueldo = bloqueHoras[claveSueldoEsperada]; const ganancia = bloqueHoras[claveGananciaEsperada];
        if (costo === undefined || sueldo === undefined || ganancia === undefined) {
            console.error(`Error V3: Acceso directo falló. Claves (${claveCostoEsperada}, ${claveSueldoEsperada}, ${claveGananciaEsperada})`); alert(`Error CRÍTICO (V3): No se encontró la tarifa específica. Verifique claves JSON.`); return null;
        }
        return { precioBase: costo, costoMasajistaBase: sueldo, gananciaBase: ganancia };
    }

    // --- 5. Funciones de Cálculo ---
    function calcularPrecioGananciaTotal(valoresBase, parametros) {
        if (!valoresBase) return { precioTotal: 0, gananciaTotal: 0, costoTotalMasajistas: 0 };
        const { tipoServicio, numeroDias = 1, montoAdicional = 0 } = parametros;
        const dias = (tipoServicio === 'eventual' || tipoServicio === 'deportivo') ? parseInt(numeroDias) || 1 : 1;
        const precioBaseNum = parseFloat(valoresBase.precioBase) || 0;
        const gananciaBaseNum = parseFloat(valoresBase.gananciaBase) || 0;
        const costoMasajistaBaseNum = parseFloat(valoresBase.costoMasajistaBase) || 0;
        const montoAdicionalNum = parseFloat(montoAdicional) || 0;
        const precioTotal = (precioBaseNum * dias) + montoAdicionalNum;
        const gananciaTotal = (gananciaBaseNum * dias);
        const costoTotalMasajistas = costoMasajistaBaseNum * dias;
        return { precioTotal, gananciaTotal, costoTotalMasajistas };
    }
    function calcularCantidadMasajes(parametros) {
        const { tipoServicio, duracionMasaje, horasCobertura, duracionVisita, cantidadMasajistas, frecuencia, numeroDias } = parametros;
        if (!duracionMasaje || duracionMasaje === 'na') { return { masajesPorVisita: 0, masajesTotales: 0 }; }
        const duracionNum = parseInt(duracionMasaje); let masajesPorHora = 0;
        if (duracionNum === 7) masajesPorHora = 6.5; else if (duracionNum === 10) masajesPorHora = 5; else if (duracionNum === 15) masajesPorHora = 3.5; else return { masajesPorVisita: 0, masajesTotales: 0 };
        let horasPorVisita = 0; let numeroDeVisitas = 0; const masajistasNum = parseInt(cantidadMasajistas) || 1;
        if (tipoServicio === 'eventual' || tipoServicio === 'deportivo') { const diasNum = parseInt(numeroDias) || 1; horasPorVisita = parseFloat(horasCobertura) || 0; numeroDeVisitas = diasNum; }
        else if (tipoServicio === 'corporativo') { horasPorVisita = parseFloat(duracionVisita) || 0; let freqNum = 0; if (frecuencia === '1S') freqNum = 1; else if (frecuencia === '2S') freqNum = 2; else if (frecuencia === '3S') freqNum = 3; numeroDeVisitas = freqNum * 4; }
        else { return { masajesPorVisita: 0, masajesTotales: 0 }; }
        let masajesPorVisitaUnMasajista = masajesPorHora * horasPorVisita;
        if (masajesPorVisitaUnMasajista % 1 === 0.5) { masajesPorVisitaUnMasajista = Math.floor(masajesPorVisitaUnMasajista); }
        else { masajesPorVisitaUnMasajista = Math.round(masajesPorVisitaUnMasajista); }
        const masajesTotales = masajesPorVisitaUnMasajista * masajistasNum * numeroDeVisitas;
        return { masajesPorVisita: masajesPorVisitaUnMasajista, masajesTotales: masajesTotales };
    }

    // --- 6. Función Principal ---
    async function calcularPresupuesto() {
        const parametros = { tipoServicio: tipoServicioSelect.value, cantidadMasajistas: parseInt(cantidadMasajistasInput.value) || 1, duracionMasaje: duracionMasajeSeleccionadaInput.value, nivelPrecio: nivelPrecioSelect.value, montoAdicional: parseFloat(montoAdicionalInput.value) || 0, horasCobertura: null, diaPredominante: null, numeroDias: 1, duracionVisita: null, frecuencia: null };
        if (parametros.tipoServicio === 'eventual') { parametros.horasCobertura = parseFloat(horasCoberturaEventualInput.value) || null; parametros.diaPredominante = diaPredominanteEventualSelect.value || null; parametros.numeroDias = parseInt(numeroDiasEventualInput.value) || 1; }
        else if (parametros.tipoServicio === 'corporativo') { parametros.duracionVisita = parseFloat(duracionVisitaCorporativoSlider.value) || null; parametros.frecuencia = frecuenciaCorporativoSelect.value || null; }
        else if (parametros.tipoServicio === 'deportivo') { parametros.horasCobertura = parseFloat(horasCoberturaDeportivoInput.value) || null; parametros.diaPredominante = diaPredominanteDeportivoSelect.value || null; parametros.numeroDias = parseInt(numeroDiasDeportivoInput.value) || 1; }
        if (!parametros.tipoServicio) { limpiarResumen(); return; }
        const rutaJson = construirRutaJson(parametros); if (!rutaJson) { limpiarResumen(); return; }
        if (!parametros.nivelPrecio || (parametros.tipoServicio === 'corporativo' && (!parametros.duracionVisita || !parametros.frecuencia)) || ((parametros.tipoServicio === 'eventual' || parametros.tipoServicio === 'deportivo') && !parametros.horasCobertura) ) { limpiarResumen(); return; }
        const cargaExitosa = await cargarDatosJson(rutaJson); if (!cargaExitosa) { limpiarResumen(); return; }
        const valoresBase = buscarValoresEnJson(parametros);
        if (!valoresBase) { limpiarResumen(); return; }
        const totales = calcularPrecioGananciaTotal(valoresBase, parametros);
        const cantidadMasajes = calcularCantidadMasajes(parametros);
        actualizarResumenUI(valoresBase, totales, cantidadMasajes, parametros);
    }

    // --- 7. Actualización UI y Botones ---
     function actualizarResumenUI(valoresBase, totales, cantidadMasajes, parametros) {
         const formatoMoneda = new Intl.NumberFormat('es-PY', { style: 'currency', currency: 'PYG', minimumFractionDigits: 0 });
         resultadoPrecioTotalSpan.textContent = formatoMoneda.format(totales.precioTotal);
         resultadoGananciaEstimadaSpan.textContent = formatoMoneda.format(totales.gananciaTotal);
         detallePrecioBaseSpan.textContent = formatoMoneda.format(valoresBase.precioBase);
         detalleCostoAdicionalSpan.textContent = formatoMoneda.format(parametros.montoAdicional);
         const costoMasajistaIndividualBase = (parametros.cantidadMasajistas > 0) ? (parseFloat(valoresBase.costoMasajistaBase) || 0) / parametros.cantidadMasajistas : 0;
         detallePagoMasajistaSpan.textContent = formatoMoneda.format(costoMasajistaIndividualBase);
         detalleCostoTotalMasajistasSpan.textContent = formatoMoneda.format(totales.costoTotalMasajistas);
         if (seccionDetalleMasajesDiv.style.display !== 'none') { detalleMasajesPorVisitaSpan.textContent = cantidadMasajes.masajesPorVisita; detalleMasajesTotalesSpan.textContent = cantidadMasajes.masajesTotales; }
         else { detalleMasajesPorVisitaSpan.textContent = '0'; detalleMasajesTotalesSpan.textContent = '0'; }
    }
    function limpiarResumen() {
        resultadoPrecioTotalSpan.textContent = '0 Gs.'; resultadoGananciaEstimadaSpan.textContent = '0 Gs.';
        detallePrecioBaseSpan.textContent = '0'; detalleCostoAdicionalSpan.textContent = '0'; detallePagoMasajistaSpan.textContent = '0'; detalleCostoTotalMasajistasSpan.textContent = '0';
        detalleMasajesPorVisitaSpan.textContent = '0'; detalleMasajesTotalesSpan.textContent = '0';
        datosPrecios = null; rutaJsonActual = '';
     }
    function limpiarFormulario() {
        tipoServicioSelect.value = ''; cantidadMasajistasInput.value = '1'; cantidadMasajistasInput.removeAttribute('max');
        duracionBtns.forEach(btn => btn.classList.remove('active')); document.querySelector('.duracion-btn[data-value="10"]').classList.add('active'); duracionMasajeSeleccionadaInput.value = "10"; actualizarVisibilidadDetalleMasajes('10'); detalleDuracionSeleccionadaSpan.textContent = `10 min`;
        nivelPrecioSelect.innerHTML = '<option value="">-- Seleccione Tipo Servicio --</option>';
        horasCoberturaEventualInput.value = '1'; horasCoberturaEventualValueSpan.textContent = '1'; diaPredominanteEventualSelect.value = ''; numeroDiasEventualInput.value = '1';
        duracionVisitaCorporativoSlider.value = '1'; duracionVisitaCorporativoValueSpan.textContent = '1'; frecuenciaCorporativoSelect.value = '';
        horasCoberturaDeportivoInput.value = '1'; horasCoberturaDeportivoValueSpan.textContent = '1'; diaPredominanteDeportivoSelect.value = ''; numeroDiasDeportivoInput.value = '1';
        montoAdicionalInput.value = '0'; conceptoAdicionalInput.value = '';
        detallesEventualDiv.style.display = 'none'; detallesCorporativoDiv.style.display = 'none'; detallesDeportivoDiv.style.display = 'none';
        actualizarEtiquetasPeriodo(null);
        limpiarResumen();
        // console.log("Formulario limpiado");
    }
    function imprimir() { window.print(); }

    // --- Ejecutar Inicialización ---
    inicializarCalculadora();

}); // Fin de DOMContentLoaded