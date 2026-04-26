from fastapi import FastAPI
from pydantic import BaseModel
import pandas as pd
import yfinance as yf

app = FastAPI(title="Price Prediction Service", version="1.0.0")

class PredictionRequest(BaseModel):
    ticker: str
    days: int = 5

@app.get("/api/predict/health")
def health_check():
    return {"status": "ok", "service": "price-prediction-service"}

@app.post("/api/predict/stock")
def predict_stock(req: PredictionRequest):
    # Dummy mock machine learning / ML moving average logic
    data = {"ticker": req.ticker, "predicted_prices": [105.0, 106.5, 104.2, 110.0, 112.1][:req.days]}
    return data

@app.get("/api/predict/history/{ticker}")
def get_history(ticker: str):
    # Just a mock to show the use of yfinance + pandas conceptually without heavy load
    return {"ticker": ticker, "mock_history": [100.0, 101.5, 102.3, 100.1, 99.5]}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
