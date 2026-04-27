from fastapi import FastAPI, Query
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import yfinance as yf
from typing import List, Optional
import datetime

#Ashwin Suthar MT2025024 - IIIT B SPE Major project FinTech JavaSpringBoot PythonFastAPI DevOps
app = FastAPI(title="Price Prediction Service", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class PredictionRequest(BaseModel):
    ticker: str
    days: int = 5

@app.get("/api/predict/health")
def health_check():
    return {"status": "ok", "service": "price-prediction-service"}

@app.get("/api/predict/price/{ticker}")
def get_price(ticker: str):
    try:
        stock = yf.Ticker(ticker)
        data = stock.history(period="1d")
        if data.empty:
            return {"error": "Ticker not found"}
        current_price = data['Close'].iloc[-1]
        return {
            "ticker": ticker,
            "price": round(float(current_price), 2),
            "timestamp": int(data.index[-1].timestamp() * 1000)
        }
    except Exception as e:
        return {"error": str(e)}

@app.get("/api/predict/history/{ticker}")
def get_history(ticker: str, period: str = Query("1d")):
    # period can be 1d, 5d, 1mo, 1y, ytd, max
    try:
        stock = yf.Ticker(ticker)
        # Determine interval based on period
        interval = "1m" if period == "1d" else "5m" if period == "5d" else "1h" if period == "1mo" else "1d"
        data = stock.history(period=period, interval=interval)
        
        history_list = []
        for index, row in data.iterrows():
            history_list.append({
                "timestamp": int(index.timestamp() * 1000),
                "price": round(float(row['Close']), 2)
            })
        
        return {
            "ticker": ticker,
            "period": period,
            "history": history_list
        }
    except Exception as e:
        return {"error": str(e)}

@app.post("/api/predict/stock")
def predict_stock(req: PredictionRequest):
    # Dummy mock machine learning / ML moving average logic
    data = {"ticker": req.ticker, "predicted_prices": [105.0, 106.5, 104.2, 110.0, 112.1][:req.days]}
    return data

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
