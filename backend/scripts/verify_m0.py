import asyncio
import sys
from pathlib import Path

# Add backend directory to path
backend_dir = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(backend_dir))

from app.db.session import engine
from sqlalchemy import text


async def verify():
    print("Testing connection to database...")
    try:
        async with engine.connect() as conn:
            # Check connection
            res = await conn.execute(text("SELECT 1"))
            print(f"Database query result: {res.scalar()}")

            # Check pgvector extension
            res = await conn.execute(text("SELECT extname, extversion FROM pg_extension WHERE extname = 'vector'"))
            row = res.fetchone()
            if row:
                print(f"pgvector extension installed! Version: {row[1]}")
            else:
                print("pgvector extension NOT installed!")
                sys.exit(1)

            # Check tables created
            res = await conn.execute(text("""
                SELECT table_name 
                FROM information_schema.tables 
                WHERE table_schema = 'public' 
                ORDER BY table_name;
            """))
            tables = [r[0] for r in res.fetchall()]
            print(f"Installed tables ({len(tables)}): {', '.join(tables)}")

            required_tables = {
                "users", "profiles", "jobs", "job_interactions", "match_explanations",
                "chat_threads", "user_memories", "llm_calls", "ingestion_runs", "eval_runs"
            }
            missing = required_tables - set(tables)
            if missing:
                print(f"Missing tables: {missing}")
                sys.exit(1)

            print("M0 database schema verification PASSED successfully!")
    except Exception as e:
        print(f"Verification error: {e}")
        sys.exit(1)


if __name__ == "__main__":
    asyncio.run(verify())
