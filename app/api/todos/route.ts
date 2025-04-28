import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  host: process.env.POSTGRES_HOST,
  port: Number(process.env.POSTGRES_PORT),
  database: process.env.POSTGRES_DB,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
});

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const nombre = searchParams.get('nombre');
    const estado = searchParams.get('estado');
    let query = 'SELECT * FROM todos';
    const params: any[] = [];
    const conditions: string[] = [];
    if (nombre) {
      conditions.push('nombre ILIKE $' + (params.length + 1));
      params.push(`%${nombre}%`);
    }
    if (estado) {
      conditions.push('estado = $' + (params.length + 1));
      params.push(estado);
    }
    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }
    query += ' ORDER BY id DESC';
    const { rows } = await pool.query(query, params);
    return NextResponse.json(rows);
  } catch (error) {
    return NextResponse.json({ error: 'Error al obtener tareas', details: error }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { nombre, descripcion, estado } = await req.json();
    if (!nombre) {
      return NextResponse.json({ error: 'El nombre es obligatorio' }, { status: 400 });
    }
    const { rows } = await pool.query(
      'INSERT INTO todos (nombre, descripcion, estado) VALUES ($1, $2, $3) RETURNING *',
      [nombre, descripcion || '', estado || 'pendiente']
    );
    return NextResponse.json(rows[0]);
  } catch (error) {
    return NextResponse.json({ error: 'Error al crear tarea', details: error }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { id, nombre, descripcion, estado } = await req.json();
    if (!id) {
      return NextResponse.json({ error: 'El id es obligatorio' }, { status: 400 });
    }
    const { rows } = await pool.query(
      'UPDATE todos SET nombre = $1, descripcion = $2, estado = $3 WHERE id = $4 RETURNING *',
      [nombre, descripcion, estado, id]
    );
    if (rows.length === 0) {
      return NextResponse.json({ error: 'Tarea no encontrada' }, { status: 404 });
    }
    return NextResponse.json(rows[0]);
  } catch (error) {
    return NextResponse.json({ error: 'Error al modificar tarea', details: error }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { id, estado } = await req.json();
    if (!id || !estado) {
      return NextResponse.json({ error: 'El id y el estado son obligatorios' }, { status: 400 });
    }
    const { rows } = await pool.query(
      'UPDATE todos SET estado = $1 WHERE id = $2 RETURNING *',
      [estado, id]
    );
    if (rows.length === 0) {
      return NextResponse.json({ error: 'Tarea no encontrada' }, { status: 404 });
    }
    return NextResponse.json(rows[0]);
  } catch (error) {
    return NextResponse.json({ error: 'Error al actualizar estado', details: error }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();
    if (!id) {
      return NextResponse.json({ error: 'El id es obligatorio' }, { status: 400 });
    }
    const { rowCount } = await pool.query('DELETE FROM todos WHERE id = $1', [id]);
    if (rowCount === 0) {
      return NextResponse.json({ error: 'Tarea no encontrada' }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Error al eliminar tarea', details: error }, { status: 500 });
  }
} 