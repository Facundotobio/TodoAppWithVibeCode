-- Insertar tarea 1: Una tarea pendiente
INSERT INTO todos (nombre, descripcion, estado, fecha_creacion, fecha_actualizacion)
VALUES (
    'Implementar autenticación',
    'Agregar sistema de login y registro de usuarios usando Next-Auth',
    'pendiente',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);

-- Insertar tarea 2: Una tarea completada
INSERT INTO todos (nombre, descripcion, estado, fecha_creacion, fecha_actualizacion)
VALUES (
    'Diseñar interfaz de usuario',
    'Crear diseño responsive utilizando Tailwind CSS y componentes modernos',
    'completada',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
); 