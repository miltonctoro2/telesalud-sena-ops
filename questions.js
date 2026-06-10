const dominios = {
  1: {
    nombre: "Dominio de conocimiento general",
    descripcion: "Competencias iniciales indispensables que enmarcan los conceptos y características de la telesalud."
  },
  2: {
    nombre: "Dominio disciplinar",
    descripcion: "Conjunto de saberes sobre la telesalud orientados a mejorar la prestación del servicio según la especialidad."
  },
  3: {
    nombre: "Dominio ético",
    descripcion: "Competencias éticas, confidencialidad y privacidad que enmarcan la atención en salud a distancia."
  },
  4: {
    nombre: "Dominio asistencial",
    descripcion: "Competencias clínicas que posibilitan ofrecer servicios de diagnóstico, tratamiento y seguimiento a través de la telesalud."
  },
  5: {
    nombre: "Dominio de salud pública",
    descripcion: "Competencias para la educación, promoción de la salud y vigilancia epidemiológica apoyadas en la telesalud."
  },
  6: {
    nombre: "Dominio comunicacional y socioemocional",
    descripcion: "Habilidades para una comunicación asertiva, empática y con calidez humana durante la teleconsulta."
  },
  7: {
    nombre: "Dominio tecnológico",
    descripcion: "Competencias digitales para el manejo de herramientas, dispositivos y resolución de problemas técnicos básicos."
  },
  8: {
    nombre: "Dominio sociocomunitario",
    descripcion: "Trabajo colaborativo interdisciplinario y en red, adaptado al contexto sociocultural de la comunidad."
  }
};

const preguntas = [
  // Dominio de conocimiento general (1-10)
  { id: 1, dominioId: 1, texto: "Tengo conocimiento sobre la eficiencia de la telesalud en términos de tiempo y recursos" },
  { id: 2, dominioId: 1, texto: "Comprendo el beneficio de la telesalud sobre la continuidad de la atención en situaciones donde la movilidad del paciente está restringida (aspectos geográficos, discapacidad u otras razones)" },
  { id: 3, dominioId: 1, texto: "Conozco el rol que tiene la telesalud en la mejora de la gestión de enfermedades crónicas a largo plazo" },
  { id: 4, dominioId: 1, texto: "Entiendo las barreras tecnológicas, culturales o generacionales que enfrentan los pacientes al acceder a los servicios de telesalud" },
  { id: 5, dominioId: 1, texto: "Tengo conocimiento sobre la legislación y las regulaciones en materia de telesalud" },
  { id: 6, dominioId: 1, texto: "Entiendo los beneficios de la telesalud para la gestión de emergencias sanitarias en áreas aisladas" },
  { id: 7, dominioId: 1, texto: "Comprendo cómo la telesalud contribuye a la educación y capacitación continua de profesionales de la salud" },
  { id: 8, dominioId: 1, texto: "Soy capaz de explicar las funciones, características y modelos de atención que ofrece la telesalud" },
  { id: 9, dominioId: 1, texto: "Estoy actualizado en temas relacionados con mi quehacer como personal de salud sobre los temas de telesalud" },
  { id: 10, dominioId: 1, texto: "Identifico la estructura organizacional y las herramientas tecnológicas básicas necesarias para realizar las teleconsultas" },

  // Dominio disciplinar (11-13)
  { id: 11, dominioId: 2, texto: "Soy capaz de aplicar conocimientos específicos de mi especialidad en un contexto de telesalud" },
  { id: 12, dominioId: 2, texto: "Soy capaz de integrar las mejores prácticas clínicas en la prestación de servicios de telesalud" },
  { id: 13, dominioId: 2, texto: "Soy capaz de manejar situaciones clínicas inesperadas en la teleconsulta, como una emergencia médica" },

  // Dominio ético (14-16)
  { id: 14, dominioId: 3, texto: "Conozco los aspectos relacionados con la confidencialidad y la privacidad del paciente que accede a servicios de telesalud" },
  { id: 15, dominioId: 3, texto: "Sé dónde revisar las normas éticas relacionadas con la telesalud en mi ámbito de atención" },
  { id: 16, dominioId: 3, texto: "Soy capaz de manejar dilemas éticos durante las teleconsultas" },

  // Dominio asistencial (17-24)
  { id: 17, dominioId: 4, texto: "Identifico los principales tipos de teleconsultas existentes para brindar el mejor servicio asistencial" },
  { id: 18, dominioId: 4, texto: "Reconozco la importancia de acceder a la historia clínica del paciente para identificar sus necesidades y brindar la mejor atención a través de la telesalud" },
  { id: 19, dominioId: 4, texto: "Reconozco que documentar la información clínica durante la teleconsulta es igual que en cualquier otro proceso de asistencia" },
  { id: 20, dominioId: 4, texto: "Tengo la competencia suficiente para realizar diagnósticos utilizando tecnología de telesalud" },
  { id: 21, dominioId: 4, texto: "Soy capaz de gestionar tratamientos a través de la telesalud" },
  { id: 22, dominioId: 4, texto: "Soy capaz de realizar seguimientos clínicos de manera remota" },
  { id: 23, dominioId: 4, texto: "Identifico las acciones que pueden asegurar la calidad de los servicios asistenciales a través de la telesalud" },
  { id: 24, dominioId: 4, texto: "Utilizo herramientas de telesalud para actualizarme y capacitarme" },

  // Dominio de salud pública (25-30)
  { id: 25, dominioId: 5, texto: "Utilizo la telesalud para la educación y promoción de la salud en pacientes y comunidades" },
  { id: 26, dominioId: 5, texto: "Reconozco el impacto que tiene la telesalud en mejorar la accesibilidad" },
  { id: 27, dominioId: 5, texto: "Utilizo la telesalud para contribuir a minimizar riesgos o daños asociados a los determinantes sociales de la salud de la población" },
  { id: 28, dominioId: 5, texto: "Soy capaz de utilizar la telesalud en la vigilancia epidemiológica" },
  { id: 29, dominioId: 5, texto: "Soy capaz de integrar la telesalud en campañas de salud pública" },
  { id: 30, dominioId: 5, texto: "Soy capaz de utilizar la telesalud para mejorar los resultados de salud en la comunidad" },

  // Dominio comunicacional y socioemocional (31-35)
  { id: 31, dominioId: 6, texto: "Reconozco y manejo los desafíos de la interacción paciente-profesional en la teleasistencia" },
  { id: 32, dominioId: 6, texto: "Soy capaz de describir las estrategias básicas comunicacionales y socioemocionales que deben ser aplicadas para mejorar la prestación de los servicios de telesalud" },
  { id: 33, dominioId: 6, texto: "Durante la teleasistencia pongo en práctica mis habilidades de comunicación asertiva y escucha activa hacia el paciente" },
  { id: 34, dominioId: 6, texto: "Conozco cómo generar seguridad y confianza con los pacientes y sus familias durante los servicios de telesalud logrando un ambiente de empatía y calidez" },
  { id: 35, dominioId: 6, texto: "Sé cómo manejar situaciones emocionales críticas o de estrés durante una teleconsulta" },

  // Dominio tecnológico (36-39)
  { id: 36, dominioId: 7, texto: "Utilizo herramientas digitales para ofrecer servicios de teleconsulta, teleasistencia y tele-educación de calidad" },
  { id: 37, dominioId: 7, texto: "Puedo resolver problemas técnicos básicos cuando utilizo la telesalud" },
  { id: 38, dominioId: 7, texto: "Estoy familiarizado con las medidas de seguridad necesarias para proteger la información del paciente" },
  { id: 39, dominioId: 7, texto: "Soy capaz de utilizar dispositivos digitales remotos (como monitores de signos vitales domiciliarios) en una teleconsulta o telemonitoreo" },

  // Dominio sociocomunitario (40-43)
  { id: 40, dominioId: 8, texto: "Trabajo de forma colaborativa con colegas, otros actores e instituciones sanitarias para garantizar una adecuada prestación de los servicios de telesalud a la población desde un enfoque integral (teleconsulta conjunta)" },
  { id: 41, dominioId: 8, texto: "Intercambio experiencias y buenas prácticas en telesalud que contribuyan a la discusión y reflexión entre pares y otros trabajadores de salud a fin de mejorar mi quehacer cotidiano" },
  { id: 42, dominioId: 8, texto: "Organizo la prestación de los servicios de telesalud a partir de las necesidades y los contextos socioculturales de las personas, familias y comunidades para que sean pertinentes y aceptados" },
  { id: 43, dominioId: 8, texto: "Tengo la capacidad para coordinar servicios con otros profesionales de salud en un entorno de atención a distancia (derivación)" }
];

const nivelesDesempeno = {
  nulo: {
    min: 0,
    max: 64,
    nombre: "Nulo",
    color: "#e74c3c", // Rojo
    descripcion: "Usted ha demostrado no dominar las competencias esenciales que requiere el personal de salud, por lo que debe buscar asesoría y entrenamiento para fortalecer sus competencias y brindar un servicio de calidad a los usuarios de los servicios de telesalud.",
    recomendaciones: [
      "Comprender los conceptos básicos de la telesalud: Definición, modalidades, beneficios y limitaciones.",
      "Familiarizarse con las tecnologías utilizadas: Plataformas de videoconferencia, historial clínico electrónico y herramientas de diagnóstico remoto.",
      "Conocer aspectos legales y éticos: Confidencialidad de los datos y protección de la privacidad.",
      "Desarrollar habilidades técnicas básicas: Configurar y utilizar la plataforma de telesalud elegida, realizar videollamadas, compartir pantalla, utilizar herramientas básicas de diagnóstico y gestionar el historial clínico en el entorno virtual."
    ]
  },
  inicial: {
    min: 65,
    max: 115,
    nombre: "Inicial",
    color: "#f1c40f", // Amarillo
    descripcion: "Tiene un bajo grado de dominio de las competencias esenciales que requiere el personal de salud, por lo que le invitamos a redoblar sus esfuerzos para asumir con profesionalismo y compromiso los servicios que brinda en pos de la salud de la población.",
    recomendaciones: [
      "Fortalecer las habilidades básicas: Profundizar en conceptos, dominar tecnologías (funciones avanzadas), asegurar el cumplimiento legal y ético, y entrenar comunicación asertiva y escucha activa.",
      "Comenzar a implementar la teleasistencia en la práctica: Identificar pacientes aptos, seleccionar la modalidad adecuada (sincrónica, asincrónica o remota), realizar teleconsultas con conexión y empatía, documentar las teleconsultas adecuadamente."
    ]
  },
  intermedio: {
    min: 116,
    max: 165,
    nombre: "Intermedio",
    color: "#e67e22", // Naranja
    descripcion: "Tiene un grado de dominio intermedio de las competencias esenciales que requiere el personal de salud. Esto demuestra su compromiso con la salud de la población y su capacidad de asumir desafíos.",
    recomendaciones: [
      "Utilizar la telesalud de manera habitual: Usar herramientas de diagnóstico remoto avanzadas (dermatoscopios, auscultación digital), integrar la telesalud con otros sistemas, aprovechar la tecnología para educación y colaboración interdisciplinaria.",
      "Promover la telesalud en la organización: Difundir protocolos, transferir conocimiento a pares, promover la adopción en la comunidad y evaluar el impacto de la teleasistencia en los pacientes."
    ]
  },
  avanzado: {
    min: 166,
    max: 194,
    nombre: "Avanzado",
    color: "#2ecc71", // Verde
    descripcion: "Tiene un alto grado de dominio de las competencias esenciales que requiere el personal de salud, así como capacidad para aplicar estas habilidades con eficacia y compromiso en la práctica diaria.",
    recomendaciones: [
      "Convertirse en un experto en telesalud: Realizar investigaciones sobre la efectividad y rentabilidad de la telesalud, publicar artículos y dictar conferencias, y ser un referente para recomendar buenas prácticas dentro de su especialidad.",
      "Promover la telesalud más allá de la organización: Abogar por políticas públicas de apoyo a la telesalud, eliminar barreras de acceso y promover la telesalud para mejorar la salud global."
    ]
  },
  muyAvanzado: {
    min: 195,
    max: 215, // 43 * 5
    nombre: "Muy avanzado",
    color: "#3498db", // Azul
    descripcion: "Demuestra un dominio excepcional de las competencias esenciales de telesalud que requiere el personal de salud. Si se encuentra en este grupo, usted supera las expectativas para el desempeño profesional y constituye un potencial candidato para capacitarse y especializarse en transformación digital aplicada a la salud. ¡Felicitaciones!",
    recomendaciones: [
      "Liderar la transformación digital en telesalud: Diseñar e implementar estrategias innovadoras (IA, interoperabilidad), evaluar tecnologías emergentes y coordinar proyectos de adopción tecnológica de alto impacto.",
      "Transmitir conocimientos y profundizar la especialización: Desarrollar programas de capacitación y mentoría, especializarse en estándares internacionales (como FHIR) e innovación digital, y publicar investigaciones clave."
    ]
  }
};
