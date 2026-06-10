/**
 * Lógica de Negocio de la Herramienta de Autoevaluación de Telesalud (OPS/SENA)
 */

// 1. CONFIGURACIÓN DEL WEBHOOK DE POWER AUTOMATE
// Coloca aquí la dirección (URL) del Webhook generado por Power Automate.
// Cuando configures tu flujo en la nube, reemplaza este texto entre comillas con la URL del flujo.
const POWER_AUTOMATE_WEBHOOK_URL = "";

// 2. ESTADO GENERAL DE LA APLICACIÓN
const state = {
    userInfo: {
        name: "",
        id: "",
        phone: "",
        email: "",
        position: "",
        institution: ""
    },
    answers: {}, // Guardará { [idPregunta]: valorNumerico(0-5) }
    currentDomainIndex: 0, // Dominio actual en pantalla (0 a 7)
    domainKeys: [1, 2, 3, 4, 5, 6, 7, 8] // IDs de los 8 dominios
};

// Carga inicial al cargar el navegador
document.addEventListener("DOMContentLoaded", () => {
    // Inicializar controles de interfaz
    document.getElementById("btn-prev").disabled = true;
});

// 3. FLUJO DE NAVEGACIÓN
function startAssessment() {
    // Captura datos del formulario de registro
    state.userInfo.name = document.getElementById("reg-name").value.trim();
    state.userInfo.id = document.getElementById("reg-id").value.trim();
    state.userInfo.phone = document.getElementById("reg-phone").value.trim();
    state.userInfo.email = document.getElementById("reg-email").value.trim();
    state.userInfo.position = document.getElementById("reg-position").value.trim();
    state.userInfo.institution = document.getElementById("reg-institution").value.trim();

    // Oculta pantalla de bienvenida y muestra cuestionario
    document.getElementById("screen-welcome").classList.add("hidden");
    document.getElementById("screen-questionnaire").classList.remove("hidden");

    // Renderiza el primer dominio
    state.currentDomainIndex = 0;
    renderCurrentDomain();
}

function renderCurrentDomain() {
    const domainId = state.domainKeys[state.currentDomainIndex];
    const domainData = dominios[domainId];
    
    // Filtrar las preguntas correspondientes a este dominio
    const domainQuestions = preguntas.filter(p => p.dominioId === domainId);
    
    // Actualizar Textos de Cabecera del Cuestionario
    document.getElementById("progress-domain-title").innerText = `Dominio ${state.currentDomainIndex + 1} de 8: ${domainData.nombre}`;
    document.getElementById("domain-name").innerText = domainData.nombre;
    document.getElementById("domain-desc").innerText = domainData.descripcion;
    
    // Calcular porcentaje de progreso basado en las preguntas respondidas
    updateProgressBar();

    // Renderizar preguntas en el contenedor
    const container = document.getElementById("questions-container");
    container.innerHTML = ""; // Limpiar

    domainQuestions.forEach((q, idx) => {
        const questionDiv = document.createElement("div");
        questionDiv.className = "question-item fade-in";
        questionDiv.style.animationDelay = `${idx * 0.05}s`;
        
        // Crear cabecera de la pregunta
        const questionText = document.createElement("div");
        questionText.className = "question-text";
        questionText.innerHTML = `<span class="question-number">${q.id}.</span> <span>${q.texto}</span>`;
        questionDiv.appendChild(questionText);

        // Crear opciones Likert (1 a 5 y N/A)
        const optionsDiv = document.createElement("div");
        optionsDiv.className = "likert-options";

        // Array de opciones a renderizar
        const ratings = [
            { val: 1, text: "Nulo" },
            { val: 2, text: "Inicial" },
            { val: 3, text: "Intermedio" },
            { val: 4, text: "Avanzado" },
            { val: 5, text: "Muy Avanzado" },
            { val: "N/A", text: "No Aplica" }
        ];

        ratings.forEach(rate => {
            const label = document.createElement("label");
            label.className = "likert-label";
            label.setAttribute("data-val", rate.val);
            
            // Si ya tiene respuesta guardada anteriormente, marcarla
            const savedValue = state.answers[q.id];
            const isSelected = (rate.val === "N/A" && savedValue === 0) || (savedValue !== undefined && savedValue === rate.val);
            
            if (isSelected) {
                label.classList.add("selected");
            }

            const input = document.createElement("input");
            input.type = "radio";
            input.name = `question-${q.id}`;
            input.value = rate.val;
            input.checked = isSelected;
            input.id = `q-${q.id}-opt-${rate.val}`;
            
            // Evento al seleccionar opción
            input.addEventListener("change", () => {
                // Quitar selección previa de las etiquetas hermanas
                optionsDiv.querySelectorAll(".likert-label").forEach(l => l.classList.remove("selected"));
                // Agregar clase seleccionada a la actual
                label.classList.add("selected");
                
                // Guardar valor en el estado (N/A equivale a 0 puntos)
                state.answers[q.id] = (rate.val === "N/A") ? 0 : parseInt(rate.val);
                
                // Actualizar barra de progreso al responder
                updateProgressBar();
            });

            const numSpan = document.createElement("span");
            numSpan.className = "likert-num";
            numSpan.innerText = rate.val;

            const textSpan = document.createElement("span");
            textSpan.className = "likert-text";
            textSpan.innerText = rate.text;

            label.appendChild(input);
            label.appendChild(numSpan);
            label.appendChild(textSpan);
            optionsDiv.appendChild(label);
        });

        questionDiv.appendChild(optionsDiv);
        container.appendChild(questionDiv);
    });

    // Control de botones de navegación inferior
    document.getElementById("btn-prev").disabled = (state.currentDomainIndex === 0);
    
    // Cambiar texto del botón en el último paso
    const isLastDomain = (state.currentDomainIndex === state.domainKeys.length - 1);
    document.getElementById("btn-next").innerText = isLastDomain ? "Calcular y Ver Resultados ➔" : "Siguiente Dominio →";
    
    // Scroll hacia arriba suave al cambiar de dominio
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function updateProgressBar() {
    const totalQuestions = preguntas.length;
    const answeredCount = Object.keys(state.answers).length;
    const percent = Math.round((answeredCount / totalQuestions) * 100);
    
    document.getElementById("progress-percent").innerText = `${percent}% Completado (${answeredCount} de ${totalQuestions})`;
    document.getElementById("progress-fill").style.width = `${percent}%`;
}

// Validación de respuestas del dominio actual antes de avanzar
function validateCurrentDomainAnswers() {
    const domainId = state.domainKeys[state.currentDomainIndex];
    const domainQuestions = preguntas.filter(p => p.dominioId === domainId);
    
    // Buscar si alguna pregunta de este dominio no está en el mapa de respuestas
    const unanswered = domainQuestions.filter(q => state.answers[q.id] === undefined);
    
    if (unanswered.length > 0) {
        // Indicar visualmente al usuario
        alert(`Por favor responda todas las preguntas del dominio actual antes de continuar. Falta responder la(s) pregunta(s): ${unanswered.map(q => q.id).join(", ")}.`);
        return false;
    }
    return true;
}

function prevDomain() {
    if (state.currentDomainIndex > 0) {
        state.currentDomainIndex--;
        renderCurrentDomain();
    }
}

function nextDomain() {
    // Validar antes de proceder
    if (!validateCurrentDomainAnswers()) return;

    const isLastDomain = (state.currentDomainIndex === state.domainKeys.length - 1);
    
    if (isLastDomain) {
        // Si es el último, enviar a OneDrive en segundo plano y luego mostrar resultados
        submitAndShowResults();
    } else {
        // Avanzar al siguiente dominio
        state.currentDomainIndex++;
        renderCurrentDomain();
    }
}

// 4. CÁLCULO Y MOSTRAR RESULTADOS
function calculateAndShowResults() {
    // Suma de puntajes
    let totalScore = 0;
    preguntas.forEach(q => {
        totalScore += state.answers[q.id] || 0;
    });

    // Identificar nivel de desempeño
    let currentLevelKey = "nulo";
    if (totalScore >= nivelesDesempeno.muyAvanzado.min) {
        currentLevelKey = "muyAvanzado";
    } else if (totalScore >= nivelesDesempeno.avanzado.min) {
        currentLevelKey = "avanzado";
    } else if (totalScore >= nivelesDesempeno.intermedio.min) {
        currentLevelKey = "intermedio";
    } else if (totalScore >= nivelesDesempeno.inicial.min) {
        currentLevelKey = "inicial";
    }

    const levelData = nivelesDesempeno[currentLevelKey];

    // Actualizar Ficha de Resultados en pantalla
    document.getElementById("result-score-num").innerText = totalScore;
    
    const badge = document.getElementById("result-level-badge");
    badge.innerText = levelData.nombre;
    // Limpiar clases de color previas del badge
    badge.className = "results-badge";
    badge.classList.add(`badge-${currentLevelKey.replace(/([A-Z])/g, "-$1").toLowerCase()}`);

    // Ficha del evaluado
    document.getElementById("summary-name").innerText = state.userInfo.name;
    document.getElementById("summary-id").innerText = state.userInfo.id;
    document.getElementById("summary-email").innerText = state.userInfo.email;
    document.getElementById("summary-phone").innerText = state.userInfo.phone;
    document.getElementById("summary-position").innerText = state.userInfo.position;
    document.getElementById("summary-institution").innerText = state.userInfo.institution;

    // Caja de interpretación del semáforo
    const interpretationBox = document.getElementById("result-interpretation");
    interpretationBox.style.borderLeftColor = levelData.color;
    interpretationBox.style.backgroundColor = `${levelData.color}0d`; // Color con opacidad muy baja (13%)
    interpretationBox.innerHTML = `<strong>Nivel obtenido: ${levelData.nombre} (${levelData.min} - ${levelData.max === 215 ? 'más de 194' : levelData.max} puntos).</strong><br><br>${levelData.descripcion}`;

    // Cargar recomendaciones en lista
    const recsList = document.getElementById("result-recommendations");
    recsList.innerHTML = "";
    levelData.recomendaciones.forEach(rec => {
        const li = document.createElement("li");
        li.innerText = rec;
        recsList.appendChild(li);
    });

    // Renderizar Gráfico por Dominios
    renderDomainCharts();

    // Cambiar pantallas
    document.getElementById("screen-questionnaire").classList.add("hidden");
    document.getElementById("screen-results").classList.remove("hidden");
    
    // Desplazarse al inicio
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Renderización dinámica de las barras de estadísticas por dominio
function renderDomainCharts() {
    const chartContainer = document.getElementById("chart-bars-container");
    chartContainer.innerHTML = ""; // Limpiar

    state.domainKeys.forEach(domainId => {
        const domainData = dominios[domainId];
        const domainQuestions = preguntas.filter(p => p.dominioId === domainId);
        
        // Calcular puntos del usuario en este dominio
        let domainUserScore = 0;
        domainQuestions.forEach(q => {
            domainUserScore += state.answers[q.id] || 0;
        });

        // Máximo posible del dominio (preguntas del dominio * 5)
        const domainMaxScore = domainQuestions.length * 5;
        const percentage = Math.round((domainUserScore / domainMaxScore) * 100) || 0;

        // Determinar color de la barra según desempeño porcentual en el dominio
        let barColor = "var(--color-nulo)";
        if (percentage >= 90) barColor = "var(--color-muy-avanzado)";
        else if (percentage >= 75) barColor = "var(--color-avanzado)";
        else if (percentage >= 50) barColor = "var(--color-intermedio)";
        else if (percentage >= 30) barColor = "var(--color-inicial)";

        // Construcción HTML del renglón de la barra
        const row = document.createElement("div");
        row.className = "chart-bar-row";
        row.innerHTML = `
            <div class="chart-bar-info">
                <span class="chart-bar-name" title="${domainData.nombre}">${domainId}. ${domainData.nombre}</span>
                <span class="chart-bar-value">${domainUserScore} / ${domainMaxScore} Pts (${percentage}%)</span>
            </div>
            <div class="chart-bar-bg">
                <div class="chart-bar-fill" style="width: 0%; background-color: ${barColor};"></div>
            </div>
        `;

        chartContainer.appendChild(row);

        // Disparar animación de carga de la barra un instante después
        setTimeout(() => {
            row.querySelector(".chart-bar-fill").style.width = `${percentage}%`;
        }, 100);
    });
}

// 5. INTEGRACIÓN CON POWER AUTOMATE (ENVÍO AUTOMÁTICO)
function submitAndShowResults() {
    // Recopilar respuestas estructuradas por pregunta
    const detailedAnswers = {};
    preguntas.forEach(q => {
        const val = state.answers[q.id];
        detailedAnswers[`pregunta_${q.id}`] = (val === 0) ? "N/A" : val;
    });

    // Calcular puntaje total y nivel
    let totalScore = 0;
    preguntas.forEach(q => { totalScore += state.answers[q.id] || 0; });
    
    let finalLevel = "Nulo";
    if (totalScore >= 195) finalLevel = "Muy Avanzado";
    else if (totalScore >= 166) finalLevel = "Avanzado";
    else if (totalScore >= 116) finalLevel = "Intermedio";
    else if (totalScore >= 65) finalLevel = "Inicial";

    // Calcular puntajes por cada dominio
    const scoresPorDominio = {};
    state.domainKeys.forEach(domainId => {
        const domainQuestions = preguntas.filter(p => p.dominioId === domainId);
        let domScore = 0;
        domainQuestions.forEach(q => { domScore += state.answers[q.id] || 0; });
        scoresPorDominio[`dominio_${domainId}_puntaje`] = domScore;
        scoresPorDominio[`dominio_${domainId}_porcentaje`] = Math.round((domScore / (domainQuestions.length * 5)) * 100) || 0;
    });

    // Armar el objeto completo que se enviará
    const payload = {
        fechaEnvio: new Date().toISOString(),
        nombreCompleto: state.userInfo.name,
        identificacion: state.userInfo.id,
        telefono: state.userInfo.phone,
        correo: state.userInfo.email,
        cargo: state.userInfo.position,
        institucion: state.userInfo.institution,
        puntajeTotal: totalScore,
        nivelDesempeno: finalLevel,
        ...scoresPorDominio,
        ...detailedAnswers
    };

    // Si la URL del webhook no está configurada, pasar directamente a modo local (para pruebas)
    if (!POWER_AUTOMATE_WEBHOOK_URL) {
        console.warn("Power Automate Webhook URL no configurada. Mostrando resultados en modo local.");
        
        // Mostrar estado de advertencia en pantalla
        const statusEl = document.getElementById("cloud-status");
        if (statusEl) {
            statusEl.innerText = "⚠️ Modo local de prueba: configure el flujo en app.js para guardar en la nube.";
            statusEl.style.color = "var(--color-inicial)";
            statusEl.style.display = "block";
        }
        
        calculateAndShowResults();
        return;
    }

    // Mostrar pantalla de carga
    const loadingScreen = document.getElementById("screen-loading");
    if (loadingScreen) loadingScreen.classList.remove("hidden");

    // Realizar la petición HTTP POST
    fetch(POWER_AUTOMATE_WEBHOOK_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("Respuesta del servidor incorrecta");
        }
        
        // Mostrar estado de éxito en pantalla
        const statusEl = document.getElementById("cloud-status");
        if (statusEl) {
            statusEl.innerText = "☁️ Resultados registrados exitosamente en tu OneDrive institucional SENA";
            statusEl.style.color = "var(--color-avanzado)";
            statusEl.style.display = "block";
        }
    })
    .catch(error => {
        console.error("Error al enviar los datos a Power Automate:", error);
        alert("Hubo un problema de conexión al guardar sus datos en la nube. Sus resultados se mostrarán en pantalla, pero le recomendamos imprimir o guardar como PDF para no perderlos.");
        
        // Mostrar estado de error en pantalla
        const statusEl = document.getElementById("cloud-status");
        if (statusEl) {
            statusEl.innerText = "❌ No se pudo guardar en la nube (error de red). Por favor imprima esta página para guardar sus resultados.";
            statusEl.style.color = "var(--color-nulo)";
            statusEl.style.display = "block";
        }
    })
    .finally(() => {
        // Ocultar pantalla de carga
        if (loadingScreen) loadingScreen.classList.add("hidden");
        
        // Mostrar resultados
        calculateAndShowResults();
    });
}

// Fin de la lógica de autoevaluación.
