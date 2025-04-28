"use client";
import React, { useEffect, useState } from "react";

interface Tarea {
  id: number;
  nombre: string;
  descripcion: string;
  estado: "pendiente" | "completada";
  fecha_creacion: string;
  fecha_actualizacion: string;
}

export default function Home() {
  const [tareas, setTareas] = useState<Tarea[]>([]);
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [estado, setEstado] = useState<"pendiente" | "completada">("pendiente");
  const [filtroNombre, setFiltroNombre] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("");
  const [editando, setEditando] = useState<Tarea | null>(null);
  const [mensaje, setMensaje] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const cargarTareas = async () => {
    let url = "/api/todos";
    const params = [];
    if (filtroNombre) params.push(`nombre=${encodeURIComponent(filtroNombre)}`);
    if (filtroEstado) params.push(`estado=${encodeURIComponent(filtroEstado)}`);
    if (params.length) url += `?${params.join("&")}`;
    const res = await fetch(url);
    const data = await res.json();
    setTareas(data);
  };

  useEffect(() => {
    cargarTareas();
  }, [filtroNombre, filtroEstado]);

  const limpiarFormulario = () => {
    setNombre("");
    setDescripcion("");
    setEstado("pendiente");
    setEditando(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensaje(null);
    setError(null);
    if (!nombre) {
      setError("El nombre es obligatorio");
      return;
    }
    try {
      if (editando) {
        const res = await fetch("/api/todos", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: editando.id,
            nombre,
            descripcion,
            estado,
          }),
        });
        if (!res.ok) throw new Error("Error al modificar tarea");
        setMensaje("Tarea modificada correctamente");
      } else {
        const res = await fetch("/api/todos", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ nombre, descripcion, estado }),
        });
        if (!res.ok) throw new Error("Error al crear tarea");
        setMensaje("Tarea creada correctamente");
      }
      limpiarFormulario();
      cargarTareas();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleEditar = (tarea: Tarea) => {
    setEditando(tarea);
    setNombre(tarea.nombre);
    setDescripcion(tarea.descripcion);
    setEstado(tarea.estado);
  };

  const handleEliminar = async (id: number) => {
    if (!confirm("¿Seguro que deseas eliminar esta tarea?")) return;
    setMensaje(null);
    setError(null);
    try {
      const res = await fetch("/api/todos", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) throw new Error("Error al eliminar tarea");
      setMensaje("Tarea eliminada correctamente");
      cargarTareas();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleCompletar = async (tarea: Tarea) => {
    setMensaje(null);
    setError(null);
    try {
      const res = await fetch("/api/todos", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: tarea.id, estado: tarea.estado === "pendiente" ? "completada" : "pendiente" }),
      });
      if (!res.ok) throw new Error("Error al actualizar estado");
      setMensaje("Estado actualizado");
      cargarTareas();
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <main className="container">
      <h1>TODO App</h1>
      <form onSubmit={handleSubmit} className="form-group">
        <h2>{editando ? "Editar tarea" : "Nueva tarea"}</h2>
        <div className="input-group">
          <input
            type="text"
            placeholder="Nombre"
            value={nombre}
            onChange={e => setNombre(e.target.value)}
            required
          />
        </div>
        <div className="input-group">
          <textarea
            placeholder="Descripción"
            value={descripcion}
            onChange={e => setDescripcion(e.target.value)}
          />
        </div>
        <div className="input-group">
          <select value={estado} onChange={e => setEstado(e.target.value as any)}>
            <option value="pendiente">Pendiente</option>
            <option value="completada">Completada</option>
          </select>
        </div>
        <div className="button-group">
          <button type="submit" className="btn-primary">
            {editando ? "Guardar cambios" : "Agregar tarea"}
          </button>
          {editando && (
            <button type="button" onClick={limpiarFormulario} className="btn-secondary">
              Cancelar
            </button>
          )}
        </div>
      </form>

      <div className="filters">
        <h3>Filtros</h3>
        <div className="filter-group">
          <input
            type="text"
            placeholder="Filtrar por nombre"
            value={filtroNombre}
            onChange={e => setFiltroNombre(e.target.value)}
          />
          <select value={filtroEstado} onChange={e => setFiltroEstado(e.target.value)}>
            <option value="">Todos</option>
            <option value="pendiente">Pendiente</option>
            <option value="completada">Completada</option>
          </select>
        </div>
      </div>

      {mensaje && <div className="message success">{mensaje}</div>}
      {error && <div className="message error">{error}</div>}

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Descripción</th>
              <th>Estado</th>
              <th>Creación</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {tareas.map(t => (
              <tr key={t.id} className={t.estado === "completada" ? "completed" : ""}>
                <td>{t.nombre}</td>
                <td>{t.descripcion}</td>
                <td>
                  <button
                    onClick={() => handleCompletar(t)}
                    className={t.estado === "pendiente" ? "btn-success" : "btn-secondary"}
                  >
                    {t.estado === "pendiente" ? "Marcar como completada" : "Marcar como pendiente"}
                  </button>
                </td>
                <td>{new Date(t.fecha_creacion).toLocaleString()}</td>
                <td>
                  <div className="button-group">
                    <button onClick={() => handleEditar(t)} className="btn-primary">
                      Editar
                    </button>
                    <button onClick={() => handleEliminar(t.id)} className="btn-danger">
                      Eliminar
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
