import sqlite3
import os
import json
from datetime import datetime

DB_PATH = r"D:\AI\app\gallery.db"

DEFAULT_CHARACTERS = [
    {
        "id": "zaria",
        "name": "Zaria",
        "tagline": "Heterochromia Fashion Model",
        "color": "sky",
        "prompt": """masterpiece, best quality, 1girl, adult woman, tall woman, lean athletic body, flat chest, slim hips, long legs, narrow elegant silhouette, pale skin, calm confident expression, slightly detached gaze, subtle smirk, artistic fashion model aura, cool artistic woman, editorial fashion, unconventional styling, effortlessly stylish

short asymmetrical cyan blue hair, messy layered crop cut, uneven side bangs, longer side strand on one side, heterochromia, one golden amber eye and one cyan blue eye,

olive green asymmetrical halter crop top, high neck strap detail, exposed shoulders, oversized black jacket worn loose and slipping off shoulders, high waisted black shorts, black thigh straps, chunky black combat boots, gold hoop earring, intentional asymmetry, avant garde casual outfit,

white background, full body character design, clean anime illustration.""",
        "is_default": 1
    },
    {
        "id": "nixia",
        "name": "Nixia",
        "tagline": "Petite Gothic Mesugaki",
        "color": "purple",
        "prompt": """masterpiece, best quality, 1girl, bratty, pale skin, flat chest, thick thighs, smug expression, mesugaki look

short silver hair, purple highlights, side bangs, side locks, twin buns, crimson eyes,

black gothic corset and simple short skirt, black thigh highs,

white background.""",
        "is_default": 1
    },
    {
        "id": "angela",
        "name": "Angela",
        "tagline": "Curvy Secretary & Lab Coat",
        "color": "cyan",
        "prompt": """masterpiece, best quality, Anime girl, amber eyes, secretary look, huge breasts, curvy body,

short light blue hair, messy bob cut, side bangs,

white lab coat, light blue shirt, blue necktie, black pencil skirt, black thighhighs, formal attire, confident expression

white background.""",
        "is_default": 1
    },
    {
        "id": "virelia",
        "name": "Virelia",
        "tagline": "Gentle Maid & Pastel Pink",
        "color": "pink",
        "prompt": """masterpiece, best quality, 1girl, mature woman, cute elegant maid, golden eyes, freckles, soft blush, gentle smile, warm soft expression

pastel pink hair, long soft hair, low twin tied hair,

pink collared dress, white apron, white frilled maid headpiece, flower hair clip,

white background.""",
        "is_default": 1
    },
    {
        "id": "vivianne",
        "name": "Vivianne",
        "tagline": "Sleepy Seductive & Oversized Sweater",
        "color": "slate",
        "prompt": """masterpiece, best quality, 1woman, adult woman, tall mature anime woman, elongated adult proportions, natural adult anatomy, pale skin,

extremely long flowing silver-white hair reaching the ankles, silky straight hair, long face framing strands, soft layered bangs, crimson red eyes, sleepy half-lidded eyes, calm expressionless kuudere face,

flat chest, slender upper body, narrow shoulders, defined natural waist, moderately wide hips, noticeably thick rounded thighs, full soft upper legs, naturally thick thighs extending toward the knees, balanced lower body proportions, smooth gradual taper toward the calves, long legs, elegant mature feminine silhouette,

loose oversized black knit sweater ending at upper thighs, matching black thighhigh stockings on both legs, symmetrical stockings, barefoot, relaxed standing pose, full body, white background, clean anime character illustration""",
        "is_default": 1
    }
]

def get_connection():
    os.makedirs(os.path.dirname(DB_PATH), exist_ok=True)
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_connection()
    with conn:
        conn.execute("""
            CREATE TABLE IF NOT EXISTS generations (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                job_id TEXT UNIQUE,
                filename TEXT NOT NULL,
                file_path TEXT NOT NULL,
                prompt TEXT,
                negative_prompt TEXT,
                model TEXT,
                aspect_ratio TEXT,
                width INTEGER,
                height INTEGER,
                steps INTEGER,
                cfg REAL,
                sampler TEXT,
                scheduler TEXT,
                seed INTEGER,
                elapsed_seconds REAL,
                created_at TEXT,
                favorite INTEGER DEFAULT 0
            )
        """)
        conn.execute("""
            CREATE TABLE IF NOT EXISTS characters (
                id TEXT PRIMARY KEY,
                name TEXT NOT NULL,
                tagline TEXT,
                color TEXT,
                prompt TEXT NOT NULL,
                is_default INTEGER DEFAULT 0,
                created_at TEXT
            )
        """)
        conn.execute("""
            CREATE TABLE IF NOT EXISTS albums (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT UNIQUE NOT NULL,
                created_at TEXT
            )
        """)
        conn.execute("""
            CREATE TABLE IF NOT EXISTS album_items (
                album_id INTEGER,
                job_id TEXT,
                added_at TEXT,
                PRIMARY KEY (album_id, job_id)
            )
        """)
        conn.execute("""
            CREATE TABLE IF NOT EXISTS settings (
                key TEXT PRIMARY KEY,
                value TEXT
            )
        """)
        # Seed default characters if empty or missing any
        for char in DEFAULT_CHARACTERS:
            existing = conn.execute("SELECT id FROM characters WHERE id = ?", (char["id"],)).fetchone()
            if not existing:
                conn.execute("""
                    INSERT OR REPLACE INTO characters (id, name, tagline, color, prompt, is_default, created_at)
                    VALUES (:id, :name, :tagline, :color, :prompt, :is_default, :created_at)
                """, {
                    **char,
                    "created_at": datetime.now().isoformat()
                })
    conn.close()

def list_characters():
    conn = get_connection()
    rows = conn.execute("SELECT * FROM characters ORDER BY is_default DESC, id ASC").fetchall()
    conn.close()
    return [dict(r) for r in rows]

def save_character(data: dict):
    conn = get_connection()
    with conn:
        conn.execute("""
            INSERT OR REPLACE INTO characters (id, name, tagline, color, prompt, is_default, created_at)
            VALUES (:id, :name, :tagline, :color, :prompt, :is_default, :created_at)
        """, {
            "id": data.get("id"),
            "name": data.get("name"),
            "tagline": data.get("tagline", ""),
            "color": data.get("color", "blue"),
            "prompt": data.get("prompt", ""),
            "is_default": 1 if data.get("is_default") else 0,
            "created_at": data.get("created_at", datetime.now().isoformat())
        })
    conn.close()

def delete_character(char_id: str):
    conn = get_connection()
    with conn:
        conn.execute("DELETE FROM characters WHERE id = ?", (char_id,))
    conn.close()
    return True

def reset_default_characters():
    conn = get_connection()
    with conn:
        for char in DEFAULT_CHARACTERS:
            conn.execute("""
                INSERT OR REPLACE INTO characters (id, name, tagline, color, prompt, is_default, created_at)
                VALUES (:id, :name, :tagline, :color, :prompt, :is_default, :created_at)
            """, {
                **char,
                "created_at": datetime.now().isoformat()
            })
    conn.close()

def save_generation(data: dict):
    conn = get_connection()
    with conn:
        conn.execute("""
            INSERT OR REPLACE INTO generations (
                job_id, filename, file_path, prompt, negative_prompt,
                model, aspect_ratio, width, height, steps, cfg,
                sampler, scheduler, seed, elapsed_seconds, created_at, favorite
            ) VALUES (
                :job_id, :filename, :file_path, :prompt, :negative_prompt,
                :model, :aspect_ratio, :width, :height, :steps, :cfg,
                :sampler, :scheduler, :seed, :elapsed_seconds, :created_at, :favorite
            )
        """, {
            "job_id": data.get("job_id"),
            "filename": data.get("filename"),
            "file_path": data.get("file_path"),
            "prompt": data.get("prompt", ""),
            "negative_prompt": data.get("negative_prompt", ""),
            "model": data.get("model", ""),
            "aspect_ratio": data.get("aspect_ratio", "Custom"),
            "width": data.get("width", 768),
            "height": data.get("height", 1152),
            "steps": data.get("steps", 8),
            "cfg": data.get("cfg", 1.0),
            "sampler": data.get("sampler", "euler"),
            "scheduler": data.get("scheduler", "sgm_uniform"),
            "seed": data.get("seed", 0),
            "elapsed_seconds": data.get("elapsed_seconds", 0.0),
            "created_at": data.get("created_at", datetime.now().isoformat()),
            "favorite": 1 if data.get("favorite") else 0
        })
        if data.get("album_id") and data.get("job_id"):
            conn.execute(
                "INSERT OR IGNORE INTO album_items (album_id, job_id, added_at) VALUES (?, ?, ?)",
                (data["album_id"], data["job_id"], datetime.now().isoformat())
            )
    conn.close()

def list_albums():
    conn = get_connection()
    rows = conn.execute("""
        SELECT a.id, a.name, a.created_at, COUNT(ai.job_id) as count
        FROM albums a
        LEFT JOIN album_items ai ON a.id = ai.album_id
        GROUP BY a.id
        ORDER BY a.name COLLATE NOCASE ASC
    """).fetchall()
    conn.close()
    return [dict(r) for r in rows]

def create_album(name: str):
    conn = get_connection()
    now = datetime.now().isoformat()
    with conn:
        conn.execute("INSERT OR IGNORE INTO albums (name, created_at) VALUES (?, ?)", (name, now))
        row = conn.execute("SELECT id, name, created_at FROM albums WHERE name = ?", (name,)).fetchone()
    conn.close()
    return {"id": row["id"], "name": row["name"], "created_at": row["created_at"], "count": 0} if row else None

def delete_album(album_id: int):
    conn = get_connection()
    with conn:
        conn.execute("DELETE FROM album_items WHERE album_id = ?", (album_id,))
        conn.execute("DELETE FROM albums WHERE id = ?", (album_id,))
    conn.close()
    return True

def add_to_album(album_id: int, job_ids: list):
    conn = get_connection()
    now = datetime.now().isoformat()
    added = 0
    with conn:
        for jid in job_ids:
            cur = conn.execute("INSERT OR IGNORE INTO album_items (album_id, job_id, added_at) VALUES (?, ?, ?)", (album_id, jid, now))
            if cur.rowcount > 0:
                added += 1
    conn.close()
    return added

def remove_from_album(album_id: int, job_ids: list):
    conn = get_connection()
    removed = 0
    with conn:
        for jid in job_ids:
            cur = conn.execute("DELETE FROM album_items WHERE album_id = ? AND job_id = ?", (album_id, jid))
            removed += cur.rowcount
    conn.close()
    return removed

def list_generations(limit: int = 500, offset: int = 0, search: str = None, favorites_only: bool = False, album_id: int = None):
    conn = get_connection()
    params = []
    if album_id:
        query = """
            SELECT g.* FROM generations g
            INNER JOIN album_items ai ON g.job_id = ai.job_id
            WHERE ai.album_id = ?
        """
        params.append(album_id)
    else:
        query = "SELECT g.* FROM generations g WHERE 1=1"

    if favorites_only:
        query += " AND g.favorite = 1"
    if search:
        query += " AND (g.prompt LIKE ? OR g.model LIKE ?)"
        params.extend([f"%{search}%", f"%{search}%"])
    query += " ORDER BY g.id DESC LIMIT ? OFFSET ?"
    params.extend([limit, offset])
    
    rows = conn.execute(query, params).fetchall()
    conn.close()
    return [dict(r) for r in rows]

def toggle_favorite(job_id: str):
    conn = get_connection()
    with conn:
        row = conn.execute("SELECT favorite FROM generations WHERE job_id = ?", (job_id,)).fetchone()
        if row:
            new_val = 0 if row["favorite"] else 1
            conn.execute("UPDATE generations SET favorite = ? WHERE job_id = ?", (new_val, job_id))
            conn.close()
            return new_val
    conn.close()
    return None

def delete_generation(job_id: str):
    conn = get_connection()
    with conn:
        row = conn.execute("SELECT file_path FROM generations WHERE job_id = ?", (job_id,)).fetchone()
        if row and row["file_path"] and os.path.exists(row["file_path"]):
            try:
                os.remove(row["file_path"])
                json_path = os.path.splitext(row["file_path"])[0] + ".json"
                if os.path.exists(json_path):
                    os.remove(json_path)
            except Exception as e:
                print(f"Error removing files: {e}")
        conn.execute("DELETE FROM album_items WHERE job_id = ?", (job_id,))
        conn.execute("DELETE FROM generations WHERE job_id = ?", (job_id,))
    conn.close()
    return True

def get_generation_by_job_id(job_id: str):
    conn = get_connection()
    row = conn.execute("SELECT * FROM generations WHERE job_id = ?", (job_id,)).fetchone()
    conn.close()
    return dict(row) if row else None

def batch_delete_generations(job_ids: list):
    if not job_ids:
        return 0
    conn = get_connection()
    deleted_count = 0
    with conn:
        for job_id in job_ids:
            row = conn.execute("SELECT file_path FROM generations WHERE job_id = ?", (job_id,)).fetchone()
            if row and row["file_path"] and os.path.exists(row["file_path"]):
                try:
                    os.remove(row["file_path"])
                    json_path = os.path.splitext(row["file_path"])[0] + ".json"
                    if os.path.exists(json_path):
                        os.remove(json_path)
                except Exception as e:
                    print(f"Error removing file {row['file_path']}: {e}")
            conn.execute("DELETE FROM album_items WHERE job_id = ?", (job_id,))
            cur = conn.execute("DELETE FROM generations WHERE job_id = ?", (job_id,))
            deleted_count += cur.rowcount
    conn.close()
    return deleted_count

def get_setting(key: str, default: str = None) -> str:
    conn = get_connection()
    row = conn.execute("SELECT value FROM settings WHERE key = ?", (key,)).fetchone()
    conn.close()
    return row["value"] if row else default

def set_setting(key: str, value: str):
    conn = get_connection()
    with conn:
        conn.execute("INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)", (key, str(value)))
    conn.close()
