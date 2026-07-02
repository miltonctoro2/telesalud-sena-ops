# Documentación y Memoria Técnica: Herramienta de Autoevaluación de Competencias en Telesalud (OPS/SENA)

Este documento sirve como bitácora y especificación técnica del proyecto de digitalización de la herramienta de autoevaluación de competencias en telesalud para el personal de salud del SENA, basado en los estándares de la Organización Panamericana de la Salud (OPS/OMS).

---

## 1. Introducción y Requerimientos del Proyecto

### El Desafío
Convertir un instrumento físico (PDF en papel de la OPS) en una plataforma digital interactiva y fluida que permita diagnosticar el nivel de competencias tecnológicas, éticas, asistenciales y comunicacionales de los profesionales de salud, centralizando los datos de manera automática e impidiendo la manipulación de resultados.

### Requerimientos Clave
1. **Registro de Información:** Capturar nombre, identificación, teléfono, correo, cargo e institución del profesional evaluado antes de iniciar.
2. **Cuestionario Dinámico:** 43 preguntas ordenadas a través de 8 dominios de conocimiento definidos por la OPS.
3. **Escala de Valoración Likert:** Del 1 al 5 (Nulo, Inicial, Intermedio, Avanzado, Muy avanzado) y la opción "No Aplica" (N/A), que otorga 0 puntos.
4. **Cálculo de Resultados:** Determinar el puntaje acumulado total (máximo de 215 puntos) y mapearlo a 5 niveles de desempeño (semaforización visual por colores).
5. **Reportes por Dominio:** Calcular los puntajes y porcentajes específicos obtenidos en cada uno de los 8 dominios, y representarlos en un gráfico interactivo.
6. **Almacenamiento Seguro e Inmediato:** Guardar las respuestas directamente en una base de datos central en la nube al momento de hacer clic en finalizar, de forma invisible para el usuario para evitar el fraude o la pérdida de datos.
7. **Panel de Control:** Un acceso restringido para los administradores que permita auditar los datos y exportarlos en formato de hoja de cálculo (Excel).

---

## 2. Arquitectura de Software y Plataformas Utilizadas

Para garantizar velocidad de carga instantánea, costo cero de mantenimiento y máxima confiabilidad, se optó por una arquitectura serverless:

* **Frontend (Interfaz de Usuario):**
  * **HTML5:** Código semántico y estructurado.
  * **CSS3 (Diseño Visual):** Sistema de diseño premium adaptativo (Mobile-First) con tipografía *Outfit* de Google Fonts, variables CSS para manejo ágil de colores de semáforo, efectos de desenfoque de cristal (glassmorphic) y microanimaciones de transición suaves.
  * **Vanilla JavaScript:** Código nativo sin frameworks pesados ni dependencias externas, logrando una carga del sitio inferior a 1 segundo.
* **Backend de Base de Datos (BaaS):**
  * **Supabase (PostgreSQL):** Base de datos relacional robusta en la nube. La comunicación se realiza de manera segura mediante la API REST nativa de Supabase (`fetch` HTTPS), utilizando llaves públicas de acceso y políticas de seguridad RLS (Row Level Security) que permiten la inserción de filas desde el navegador pero restringen la lectura masiva únicamente a los administradores.
* **Alojamiento y Red (Hosting):**
  * **GitHub Pages:** Alojamiento estático seguro y gratuito con certificado SSL/TLS (HTTPS) forzado.
  * **Dominio Personalizado:** Configurado en la red mediante el subdominio `telesaludsenaops.misioninnova.org`.

> [!NOTE]
> **Decisión de Diseño Importante:** Inicialmente se consideró utilizar *Microsoft Power Automate* y *OneDrive Excel*. Esta opción fue **descartada** debido a problemas de latencia (tiempos de espera muy altos en la red), ventanas intrusivas de licenciamiento premium de Office 365, y políticas de seguridad CORS del navegador que bloqueaban la conexión. La solución de Supabase resolvió estos inconvenientes de forma definitiva.

---

## 3. Estructura de Archivos del Proyecto

El código fuente local está almacenado en `D:\En Proceso\OPS` y consta de los siguientes archivos:

1. **[index.html](file:///D:/En%20Proceso/OPS/index.html):** Contenedor principal estructurado en 4 pantallas: Bienvenida y Registro, Cuestionario Dinámico (Wizard), Ficha de Resultados con gráficos, y el Panel Secreto de Administración.
2. **[styles.css](file:///D:/En%20Proceso/OPS/styles.css):** Hoja de estilos centralizada. Controla los colores temáticos (SENA y OPS), los colores de semáforo de los niveles de desempeño y la maquetación responsiva para computadoras, tabletas y teléfonos.
3. **[app.js](file:///D:/En%20Proceso/OPS/app.js):** Cerebro lógico de la aplicación. Realiza la navegación entre dominios, valida que no queden preguntas sin responder, calcula las sumas, renderiza los gráficos de barras, interactúa con la base de datos de Supabase (POST de resultados y GET de administración) y gestiona la exportación a Excel.
4. **[questions.js](file:///D:/En%20Proceso/OPS/questions.js):** Base de datos estática en JavaScript que contiene los textos de los 8 dominios, las 43 preguntas, y los rangos de puntajes con las descripciones y recomendaciones pedagógicas oficiales de la OPS.

---

## 4. Enlaces de Acceso y Credenciales

### Acceso Público (Profesionales de Salud)
Para realizar el cuestionario de autoevaluación:
👉 **[https://telesaludsenaops.misioninnova.org](https://telesaludsenaops.misioninnova.org)**

### Acceso de Administración (Coordinadores / Jefes)
Para ver la lista de respuestas y descargar el archivo de Excel:
👉 **[https://telesaludsenaops.misioninnova.org/?admin=true](https://telesaludsenaops.misioninnova.org/?admin=true)**
* 🔑 Contraseña de acceso: **`SenaOps2026`**

---

## 5. Instrucciones de Operación y Manual de Uso

### A. Para el Evaluado (Profesional de Salud)
1. Ingresa a la web pública, llena el formulario de registro y pulsa **Comenzar**.
2. Lee cada pregunta y marca la opción que mejor describa su nivel actual (del 1 al 5 o N/A).
3. Avanza por los dominios con el botón **Siguiente**. El sistema no le permitirá avanzar si hay preguntas pendientes de valorar.
4. En el dominio 8, al pulsar **Calcular y Ver Resultados**, la pantalla se bloqueará por 1 segundo mostrando un aviso de guardado seguro. Los datos se transmiten a la base de datos central en segundo plano.
5. Inmediatamente se abre la pantalla final que contiene:
   * Puntaje acumulado y Nivel (con el color de semáforo representativo).
   * Interpretación del nivel y lista de recomendaciones para fortalecer sus debilidades.
   * Gráfico de barras interactivo con el porcentaje de desempeño por dominio.
   * Botón para **Imprimir o Guardar en PDF** localmente su hoja de resultados.

### B. Para el Administrador (Visualización y Descarga a Excel)
1. Ingrese al enlace secreto agregando `?admin=true` al final del dominio.
2. Escriba la contraseña de acceso (`SenaOps2026`) y presione **Ingresar**.
3. La interfaz mostrará el contador de registros totales almacenados.
4. Se cargará una tabla interactiva con las respuestas ordenadas de la más reciente a la más antigua, mostrando los datos básicos, el puntaje total y el nivel de cada profesional.
5. Para exportar la base de datos a Excel, haga clic en el botón azul **Descargar Reporte Excel (.csv)**.
6. El navegador descargará un archivo CSV codificado con *UTF-8 BOM* y delimitado por punto y coma (`;`), asegurando que al abrirse en Microsoft Excel en español se muestren correctamente los nombres, correos, acentos y la letra Ñ en sus respectivas columnas.

---

## 6. Mantenimiento y Modificaciones Futuras

### Modificar la Contraseña del Administrador
Si en el futuro requieres cambiar la clave de acceso del panel administrador:
1. Abre el archivo local [app.js](file:///D:/En%20Proceso/OPS/app.js) con cualquier editor de texto plano (como el *Bloc de notas* de Windows o *Notepad*).
2. Ubica la **línea 9** donde dice:
   ```javascript
   const ADMIN_PASSWORD = "SenaOps2026";
   ```
3. Reemplaza el texto entre comillas por tu nueva contraseña (ej. `"NuevaClave123"`).
4. Guarda el archivo.
5. Sube el archivo `app.js` modificado a tu repositorio de GitHub para aplicar el cambio en internet.

### Prevenir Pausa de Supabase (Mantenimiento del Servidor)
En el plan gratuito de Supabase, si la base de datos pasa **más de 7 días continuos sin recibir consultas ni inserciones**, se pausará de forma automática para liberar recursos del servidor cloud.
* **Cómo mantenerla activa:** El simple hecho de que un usuario complete la autoevaluación o que un administrador ingrese al panel (`?admin=true`) reactiva el contador de inactividad por otros 7 días.
* **Cómo reactivarla si se pausa:** Si el sitio web llega a alertar un error de conexión, ingresa a tu consola de [Supabase Dashboard](https://supabase.com/dashboard), haz clic sobre tu proyecto y pulsa el botón verde **Restore Project** (Restaurar Proyecto). En menos de 10 segundos el servicio estará activo de nuevo sin perder ningún dato.

---

*Documento redactado y validado técnicamente para el control del proyecto de autoevaluación SENA/OPS.*
