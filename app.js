/**
 * Lógica de Negocio de la Herramienta de Autoevaluación de Telesalud (OPS/SENA)
 */

// 1. CONFIGURACIÓN DE CONEXIÓN CON SUPABASE Y PANEL DE ADMINISTRACIÓN
const SUPABASE_URL = "https://asemoqatiyguzxviljkm.supabase.co";
const SUPABASE_KEY = "sb_publishable_t8s31EalnbEsIB5TOCA3KA_fBkkmBnZ";
const POWER_AUTOMATE_URL = ""; // Dejar vacío para usar únicamente Supabase
const ADMIN_PASSWORD = "SenaOps2026"; // Contraseña para ingresar al panel administrador (?admin=true)

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

    // Cargar instituciones desde Supabase
    loadInstituciones();

    // Verificar si es vista de administrador
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get("admin") === "true") {
        showAdminPanel();
    }
});

// 2b. CARGA DE INSTITUCIONES DESDE SUPABASE
function loadInstituciones() {
    const select = document.getElementById("reg-institution");
    if (!select) return;

    if (!SUPABASE_URL || !SUPABASE_KEY) return;

    fetch(`${SUPABASE_URL}/rest/v1/instituciones?select=nombre&order=nombre.asc`, {
        method: "GET",
        headers: {
            "apikey": SUPABASE_KEY,
            "Authorization": `Bearer ${SUPABASE_KEY}`
        }
    })
    .then(response => {
        if (!response.ok) throw new Error("No se pudo cargar instituciones");
        return response.json();
    })
    .then(data => {
        select.innerHTML = '<option value="" disabled selected>Seleccione la institución</option>';
        if (data && data.length > 0) {
            data.forEach(inst => {
                const opt = document.createElement("option");
                opt.value = inst.nombre;
                opt.textContent = inst.nombre;
                select.appendChild(opt);
            });
        }
    })
    .catch(() => {
        // Fallback: opción única para escribir manualmente
        select.innerHTML = `
            <option value="" disabled selected>Seleccione la institución</option>
            <option value="otra">Otra (escriba el nombre)</option>
        `;
    });
}

// 3. FLUJO DE NAVEGACIÓN
function startAssessment() {
    try {
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
    } catch (error) {
        alert("Error al iniciar la autoevaluación: " + error.message + "\n" + error.stack);
    }
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
        // Si es el último, enviar a Supabase en segundo plano y luego mostrar resultados
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

// 5. INTEGRACIÓN CON NUBE (SUPABASE Y POWER AUTOMATE / ONEDRIVE)
function submitAndShowResults() {
    // Recopilar respuestas estructuradas por pregunta
    const detailedAnswers = {};
    preguntas.forEach(q => {
        const val = state.answers[q.id];
        detailedAnswers[`pregunta_${q.id}`] = (val === 0) ? "N/A" : String(val);
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

    // 1. Armar el objeto para Supabase (coincidiendo con las columnas snake_case de la DB)
    const supabasePayload = {
        nombre_completo: state.userInfo.name,
        identificacion: state.userInfo.id,
        telefono: state.userInfo.phone,
        correo: state.userInfo.email,
        cargo: state.userInfo.position,
        institucion: state.userInfo.institution,
        puntaje_total: totalScore,
        nivel_desempeno: finalLevel,
        ...scoresPorDominio,
        ...detailedAnswers
    };

    // 2. Armar el objeto para Power Automate (coincidiendo con las columnas camelCase y fechaEnvio)
    const fechaEnvio = new Date().toLocaleString("es-CO", { timeZone: "America/Bogota" });
    const powerAutomatePayload = {
        fechaEnvio: fechaEnvio,
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

    // Mostrar pantalla de carga
    const loadingScreen = document.getElementById("screen-loading");
    if (loadingScreen) loadingScreen.classList.remove("hidden");

    // Crear promesas de envío
    const sendPromises = [];

    // Promesa de Power Automate (OneDrive)
    if (POWER_AUTOMATE_URL) {
        sendPromises.push(
            fetch(POWER_AUTOMATE_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(powerAutomatePayload)
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error("Error en la respuesta de Power Automate");
                }
                return { service: "OneDrive", success: true };
            })
            .catch(error => {
                console.error("Error al enviar a OneDrive:", error);
                return { service: "OneDrive", success: false, error: error };
            })
        );
    }

    // Promesa de Supabase
    if (SUPABASE_URL && SUPABASE_KEY) {
        sendPromises.push(
            fetch(`${SUPABASE_URL}/rest/v1/respuestas`, {
                method: "POST",
                headers: {
                    "apikey": SUPABASE_KEY,
                    "Authorization": `Bearer ${SUPABASE_KEY}`,
                    "Content-Type": "application/json",
                    "Prefer": "return=minimal"
                },
                body: JSON.stringify(supabasePayload)
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error("Error en la respuesta de Supabase");
                }
                return { service: "Supabase", success: true };
            })
            .catch(error => {
                console.error("Error al enviar a Supabase:", error);
                return { service: "Supabase", success: false, error: error };
            })
        );
    }

    // Esperar a que terminen ambos envíos
    Promise.all(sendPromises)
    .then(results => {
        const oneDriveResult = results.find(r => r.service === "OneDrive");
        const supabaseResult = results.find(r => r.service === "Supabase");

        const statusEl = document.getElementById("cloud-status");
        if (statusEl) {
            statusEl.style.display = "block";
            
            const odSuccess = oneDriveResult ? oneDriveResult.success : false;
            const sbSuccess = supabaseResult ? supabaseResult.success : false;

            if (odSuccess && sbSuccess) {
                statusEl.innerText = "☁️ Resultados guardados exitosamente en tu Excel de OneDrive y en la base de datos de Supabase.";
                statusEl.style.color = "var(--color-avanzado)";
            } else if (odSuccess && !sbSuccess) {
                statusEl.innerText = "☁️ Resultados registrados exitosamente en tu Excel de OneDrive (error al guardar en base de datos secundaria).";
                statusEl.style.color = "var(--color-intermedio)";
            } else if (!odSuccess && sbSuccess) {
                statusEl.innerText = "☁️ Resultados registrados en la base de datos central de Supabase (error al actualizar el archivo Excel de OneDrive).";
                statusEl.style.color = "var(--color-intermedio)";
            } else {
                statusEl.innerText = "❌ No se pudo guardar en la nube (error de conexión). Por favor, imprima esta página para no perder sus resultados.";
                statusEl.style.color = "var(--color-nulo)";
                alert("Hubo un problema de conexión al guardar sus datos en la nube. Sus resultados se mostrarán en pantalla, pero le recomendamos imprimir o guardar como PDF para no perderlos.");
            }
        }
    })
    .catch(error => {
        console.error("Error general en el proceso de envío:", error);
        const statusEl = document.getElementById("cloud-status");
        if (statusEl) {
            statusEl.innerText = "❌ Error inesperado al procesar el envío. Por favor imprima esta página para guardar sus resultados.";
            statusEl.style.color = "var(--color-nulo)";
            statusEl.style.display = "block";
        }
    })
    .finally(() => {
        // Ocultar pantalla de carga
        if (loadingScreen) loadingScreen.classList.add("hidden");
        
        // Mostrar resultados en pantalla
        calculateAndShowResults();
    });
}

// Fin de la lógica de autoevaluación.

// 6. PANEL DE ADMINISTRADOR
function showAdminPanel() {
    document.getElementById("screen-welcome").classList.add("hidden");
    document.getElementById("screen-questionnaire").classList.add("hidden");
    document.getElementById("screen-results").classList.add("hidden");
    document.getElementById("screen-admin").classList.remove("hidden");
}

function loginAdmin() {
    const pwdInput = document.getElementById("admin-password").value;
    const errorEl = document.getElementById("admin-login-error");
    
    if (pwdInput === ADMIN_PASSWORD) {
        errorEl.style.display = "none";
        document.getElementById("admin-login-box").classList.add("hidden");
        document.getElementById("admin-content-box").classList.remove("hidden");
        loadAdminData();
    } else {
        errorEl.innerText = "Contraseña incorrecta. Por favor intente de nuevo.";
        errorEl.style.display = "block";
    }
}

function logoutAdmin() {
    // Redirigir al inicio para limpiar el parámetro ?admin=true de la URL
    window.location.href = window.location.origin + window.location.pathname;
}

function loadAdminData() {
    const tableBody = document.getElementById("admin-table-body");
    tableBody.innerHTML = `<tr><td colspan="7" style="text-align: center; padding: 20px;">Cargando respuestas desde la base de datos...</td></tr>`;

    if (!SUPABASE_URL || !SUPABASE_KEY) {
        tableBody.innerHTML = `<tr><td colspan="7" style="text-align: center; padding: 20px; color: var(--color-nulo);">Error: Credenciales de Supabase no configuradas.</td></tr>`;
        return;
    }

    fetch(`${SUPABASE_URL}/rest/v1/respuestas?order=created_at.desc`, {
        method: "GET",
        headers: {
            "apikey": SUPABASE_KEY,
            "Authorization": `Bearer ${SUPABASE_KEY}`
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("Error al consultar la base de datos");
        }
        return response.json();
    })
    .then(data => {
        state.adminRecords = data; // Almacenar para la descarga CSV
        document.getElementById("admin-counter").innerText = data.length;

        if (data.length === 0) {
            tableBody.innerHTML = `<tr><td colspan="7" style="text-align: center; padding: 20px;">No se encontraron respuestas registradas aún.</td></tr>`;
            return;
        }

        tableBody.innerHTML = "";
        data.forEach(record => {
            const tr = document.createElement("tr");
            
            // Formatear fecha
            const dateStr = record.created_at 
                ? new Date(record.created_at).toLocaleString("es-CO", { timeZone: "America/Bogota" })
                : "Sin fecha";

            tr.innerHTML = `
                <td style="padding: 12px; border-bottom: 1px solid var(--border-color);">${dateStr}</td>
                <td style="padding: 12px; border-bottom: 1px solid var(--border-color); font-weight: 600;">${record.nombre_completo || ""}</td>
                <td style="padding: 12px; border-bottom: 1px solid var(--border-color);">${record.identificacion || ""}</td>
                <td style="padding: 12px; border-bottom: 1px solid var(--border-color);">${record.cargo || ""}</td>
                <td style="padding: 12px; border-bottom: 1px solid var(--border-color);">${record.institucion || ""}</td>
                <td style="padding: 12px; border-bottom: 1px solid var(--border-color); font-weight: 700; color: var(--primary);">${record.puntaje_total || 0}</td>
                <td style="padding: 12px; border-bottom: 1px solid var(--border-color);"><span style="padding: 4px 8px; border-radius: 4px; font-weight: 600; font-size: 0.8rem; background-color: var(--primary-light); color: var(--primary);">${record.nivel_desempeno || ""}</span></td>
            `;
            tableBody.appendChild(tr);
        });
    })
    .catch(error => {
        console.error("Error al cargar datos de administración:", error);
        tableBody.innerHTML = `<tr><td colspan="7" style="text-align: center; padding: 20px; color: var(--color-nulo);">Error de conexión: No se pudieron cargar los datos de Supabase.</td></tr>`;
    });
}

function downloadAdminExcel() {
    if (!state.adminRecords || state.adminRecords.length === 0) {
        alert("No hay registros para descargar.");
        return;
    }

    // Definir los encabezados en el orden exacto del Excel original (del script de python)
    const headers = [
        "fechaEnvio",
        "nombreCompleto",
        "identificacion",
        "telefono",
        "correo",
        "cargo",
        "institucion",
        "puntajeTotal",
        "nivelDesempeno"
    ];
    
    // Agregar encabezados de dominios 1-8
    for (let i = 1; i <= 8; i++) {
        headers.push(`dominio_${i}_puntaje`);
        headers.push(`dominio_${i}_porcentaje`);
    }
    
    // Agregar encabezados de preguntas 1-43
    for (let i = 1; i <= 43; i++) {
        headers.push(`pregunta_${i}`);
    }

    // Generar las filas del archivo CSV
    const rows = state.adminRecords.map(record => {
        const localDate = record.created_at 
            ? new Date(record.created_at).toLocaleString("es-CO", { timeZone: "America/Bogota" })
            : "";
            
        const rowValues = [
            localDate,
            record.nombre_completo || "",
            record.identificacion || "",
            record.telefono || "",
            record.correo || "",
            record.cargo || "",
            record.institucion || "",
            record.puntaje_total !== undefined ? record.puntaje_total : "",
            record.nivel_desempeno || ""
        ];

        // Añadir puntajes y porcentajes por dominio
        for (let i = 1; i <= 8; i++) {
            rowValues.push(record[`dominio_${i}_puntaje`] !== undefined ? record[`dominio_${i}_puntaje`] : "");
            rowValues.push(record[`dominio_${i}_porcentaje`] !== undefined ? record[`dominio_${i}_porcentaje`] : "");
        }

        // Añadir respuestas de las 43 preguntas
        for (let i = 1; i <= 43; i++) {
            rowValues.push(record[`pregunta_${i}`] || "");
        }

        // Escapar comillas y punto y coma (delimitador preferido en España/América Latina para Excel)
        return rowValues.map(val => {
            let str = String(val).replace(/"/g, '""');
            if (str.includes(";") || str.includes("\n") || str.includes('"')) {
                return `"${str}"`;
            }
            return str;
        }).join(";");
    });

    // Añadir el BOM de UTF-8 al inicio (\uFEFF) para que Excel reconozca las tildes y la eñe
    const csvContent = "\uFEFF" + [headers.join(";"), ...rows].join("\n");

    // Descargar el archivo
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Reporte_Autoevaluacion_Telesalud_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
