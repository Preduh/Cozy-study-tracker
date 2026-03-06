import { NextResponse } from 'next/server';
import db, { seedInitialData } from '@/lib/db';

export async function GET() {
  try {
    seedInitialData();
    
    const subjects = db.prepare('SELECT * FROM subjects').all();
    const areas = db.prepare('SELECT * FROM areas').all();
    const topics = db.prepare('SELECT * FROM topics').all();
    const sessions = db.prepare('SELECT * FROM sessions').all();
    
    return NextResponse.json({ subjects, areas, topics, sessions });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { type, data } = await req.json();
    
    if (type === 'subject') {
      const { id, name, color } = data;
      db.prepare('INSERT INTO subjects (id, name, color) VALUES (?, ?, ?)').run(id, name, color);
    } else if (type === 'area') {
      const { id, subjectId, name } = data;
      db.prepare('INSERT INTO areas (id, subjectId, name) VALUES (?, ?, ?)').run(id, subjectId, name);
    } else if (type === 'topic') {
      const { id, areaId, name, completed } = data;
      db.prepare('INSERT INTO topics (id, areaId, name, completed) VALUES (?, ?, ?, ?)').run(id, areaId, name, completed ? 1 : 0);
    } else if (type === 'session') {
      const { id, topicId, duration, timestamp } = data;
      db.prepare('INSERT INTO sessions (id, topicId, duration, timestamp) VALUES (?, ?, ?, ?)').run(id, topicId, duration, timestamp);
      
      // Update total seconds in topic
      db.prepare('UPDATE topics SET totalSeconds = totalSeconds + ? WHERE id = ?').run(duration, topicId);
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Failed to save data' }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const { type, id, data } = await req.json();
    
    if (type === 'topic') {
      const { completed, name } = data;
      if (completed !== undefined) {
        db.prepare('UPDATE topics SET completed = ? WHERE id = ?').run(completed ? 1 : 0, id);
      }
      if (name !== undefined) {
        db.prepare('UPDATE topics SET name = ? WHERE id = ?').run(name, id);
      }
    } else if (type === 'area') {
      const { name } = data;
      if (name !== undefined) {
        db.prepare('UPDATE areas SET name = ? WHERE id = ?').run(name, id);
      }
    } else if (type === 'subject') {
      const { name, color } = data;
      if (name !== undefined) {
        db.prepare('UPDATE subjects SET name = ? WHERE id = ?').run(name, id);
      }
      if (color !== undefined) {
        db.prepare('UPDATE subjects SET color = ? WHERE id = ?').run(color, id);
      }
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Failed to update data' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type');
    const id = searchParams.get('id');
    
    if (!id) return NextResponse.json({ error: 'Missing ID' }, { status: 400 });
    
    if (type === 'subject') {
      db.prepare('DELETE FROM subjects WHERE id = ?').run(id);
    } else if (type === 'area') {
      db.prepare('DELETE FROM areas WHERE id = ?').run(id);
    } else if (type === 'topic') {
      db.prepare('DELETE FROM topics WHERE id = ?').run(id);
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Failed to delete data' }, { status: 500 });
  }
}
