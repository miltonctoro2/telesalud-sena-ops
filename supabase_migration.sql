-- ========================================
-- MIGRACIÓN COMPLETA - PROYECTO TELESALUD OPS
-- ========================================

-- 1. TABLA DE RESPUESTAS (evaluaciones)
CREATE TABLE IF NOT EXISTS respuestas (
  id SERIAL PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  nombre_completo TEXT,
  identificacion TEXT,
  telefono TEXT,
  correo TEXT,
  cargo TEXT,
  institucion TEXT,
  puntaje_total INTEGER,
  nivel_desempeno TEXT,
  dominio_1_puntaje INTEGER,
  dominio_1_porcentaje INTEGER,
  dominio_2_puntaje INTEGER,
  dominio_2_porcentaje INTEGER,
  dominio_3_puntaje INTEGER,
  dominio_3_porcentaje INTEGER,
  dominio_4_puntaje INTEGER,
  dominio_4_porcentaje INTEGER,
  dominio_5_puntaje INTEGER,
  dominio_5_porcentaje INTEGER,
  dominio_6_puntaje INTEGER,
  dominio_6_porcentaje INTEGER,
  dominio_7_puntaje INTEGER,
  dominio_7_porcentaje INTEGER,
  dominio_8_puntaje INTEGER,
  dominio_8_porcentaje INTEGER,
  pregunta_1 TEXT, pregunta_2 TEXT, pregunta_3 TEXT,
  pregunta_4 TEXT, pregunta_5 TEXT, pregunta_6 TEXT,
  pregunta_7 TEXT, pregunta_8 TEXT, pregunta_9 TEXT,
  pregunta_10 TEXT, pregunta_11 TEXT, pregunta_12 TEXT,
  pregunta_13 TEXT, pregunta_14 TEXT, pregunta_15 TEXT,
  pregunta_16 TEXT, pregunta_17 TEXT, pregunta_18 TEXT,
  pregunta_19 TEXT, pregunta_20 TEXT, pregunta_21 TEXT,
  pregunta_22 TEXT, pregunta_23 TEXT, pregunta_24 TEXT,
  pregunta_25 TEXT, pregunta_26 TEXT, pregunta_27 TEXT,
  pregunta_28 TEXT, pregunta_29 TEXT, pregunta_30 TEXT,
  pregunta_31 TEXT, pregunta_32 TEXT, pregunta_33 TEXT,
  pregunta_34 TEXT, pregunta_35 TEXT, pregunta_36 TEXT,
  pregunta_37 TEXT, pregunta_38 TEXT, pregunta_39 TEXT,
  pregunta_40 TEXT, pregunta_41 TEXT, pregunta_42 TEXT,
  pregunta_43 TEXT
);

-- Políticas RLS: cualquiera puede insertar, solo admin leer
ALTER TABLE respuestas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Cualquiera puede insertar respuestas" ON respuestas
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Solo admin puede leer respuestas" ON respuestas
  FOR SELECT USING (auth.role() = 'service_role');

CREATE POLICY "Solo admin puede actualizar respuestas" ON respuestas
  FOR UPDATE USING (auth.role() = 'service_role');

-- 2. TABLA DE INSTITUCIONES (dropdown dinámico)
CREATE TABLE IF NOT EXISTS instituciones (
  id SERIAL PRIMARY KEY,
  nombre TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO instituciones (nombre) VALUES
  ('Centro de Salud de Puerto Santander'),
  ('Hospital San Francisco de Fortul'),
  ('E.S.E. Hospital San Rafael de San Vicente del Caguan'),
  ('E.S.E. Unidad de Atención en Salud de Guapi'),
  ('(López de Micay) Empresa Social del Estado de Occidente'),
  ('(Timbiquí) Empresa Social del Estado de Occidente'),
  ('CXAYU`CE JXTU Empresa Social del Estado'),
  ('E.S.E. Hospital Eduardo Santos de Istmina'),
  ('Empresa Social del Estado Centro de Salud Nuestra Señora del Carmen'),
  ('E.S.E. Hospital Sagrado Corazón de Jesús'),
  ('E.S.E. Hospital San José de Tierra Alta'),
  ('(San José del Guaviare) E.S.E. Red de Servicios de Primer Nivel'),
  ('E.S.E. Hospital San Rafael'),
  ('E.S.E. Hospital María Angelines'),
  ('E.S.E. Hospital San Agustín')
ON CONFLICT (nombre) DO NOTHING;

ALTER TABLE instituciones ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Instituciones visibles para todos" ON instituciones
  FOR SELECT USING (true);

CREATE POLICY "Solo admin puede modificar instituciones" ON instituciones
  FOR INSERT WITH CHECK (auth.role() = 'service_role');
