from fastapi import FastAPI
from app.core.config import settings

app = FastAPI(
    title=settings.APP_NAME,
    debug=settings.DEBUG_MODE
)

@app.get("/")
async def root():
    return {"message": f"Welcome to {settings.APP_NAME}"}

@app.get("/health")
async def health_check():
    # In a real application, you might add checks here, e.g., database connectivity
    return {"status": "healthy"}

# Import database lifespan events and API routers
from app.db.database import connect_db, disconnect_db
from app.apis.v1.endpoints import historical_sales

@app.on_event("startup")
async def startup_db_client():
    await connect_db()

@app.on_event("shutdown")
async def shutdown_db_client():
    await disconnect_db()

# Include API routers
app.include_router(
    historical_sales.router,
    prefix="/api/v1/historical_sales",
    tags=["Historical Sales"]
)

# Placeholder for other routers
from app.apis.v1.endpoints import properties, legal_info, valuations
app.include_router(properties.router, prefix="/api/v1/properties", tags=["Properties"])
app.include_router(legal_info.router, prefix="/api/v1/legal-info", tags=["Legal Information"])
app.include_router(valuations.router, prefix="/api/v1/valuations", tags=["Valuations & Comparables"])


if __name__ == "__main__":
    import uvicorn
    # This is for local development running directly with `python app/main.py`
    # For production, you'd typically use Gunicorn + Uvicorn workers
    uvicorn.run(app, host="0.0.0.0", port=8000)
```
