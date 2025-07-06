from databases import Database
from app.core.config import settings # Assuming your settings are in app.core.config

# The DATABASE_URL should be your PostgreSQL connection string
# e.g., "postgresql://user:password@host:port/dbname"
DATABASE_URL = settings.DATABASE_URL

# Create a Database instance
# This instance will be used to connect and disconnect in your app's lifespan events
# or on a per-request basis depending on your setup.
database = Database(DATABASE_URL)

async def connect_db():
    """Connects to the database."""
    await database.connect()
    print("Database connection established.")

async def disconnect_db():
    """Disconnects from the database."""
    await database.disconnect()
    print("Database connection closed.")

# You can also define functions here to get a database connection/session
# for use in your repository/service layer if you don't want to manage it
# directly in path operations or dependencies.

# Example of how it might be used in main.py for app lifespan:
# from app.db.database import connect_db, disconnect_db
#
# @app.on_event("startup")
# async def startup_db_client():
#     await connect_db()
#
# @app.on_event("shutdown")
# async def shutdown_db_client():
#     await disconnect_db()

# For individual queries, you'd use `database.execute()`, `database.fetch_one()`, `database.fetch_all()` etc.
# Example:
# query = "SELECT * FROM users WHERE id = :id"
# user = await database.fetch_one(query=query, values={"id": user_id})
```
