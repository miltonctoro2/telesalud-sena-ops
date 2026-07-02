-- Crear tabla de instituciones para el dropdown dinámico
CREATE TABLE IF NOT EXISTS instituciones (
  id SERIAL PRIMARY KEY,
  nombre TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insertar las 15 instituciones del proyecto
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

-- Políticas RLS: permitir lectura a todos (anon), solo inserción/edición a admin
ALTER TABLE instituciones ENABLE ROW LEVEL SECURITY;

-- Permitir SELECT a cualquier usuario (incluso anónimo)
CREATE POLICY "Instituciones visibles para todos" ON instituciones
  FOR SELECT USING (true);

-- Solo el service_role puede insertar/actualizar/eliminar
CREATE POLICY "Solo admin puede modificar instituciones" ON instituciones
  FOR INSERT WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Solo admin puede actualizar instituciones" ON instituciones
  FOR UPDATE USING (auth.role() = 'service_role');

CREATE POLICY "Solo admin puede eliminar instituciones" ON instituciones
  FOR DELETE USING (auth.role() = 'service_role');
