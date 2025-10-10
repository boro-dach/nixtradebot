from fastapi import FastAPI
from services.notifier import notify_admin_new_transaction
import logging

app = FastAPI()

logging.basicConfig(level=logging.INFO)

@app.post("/notify-transaction")
async def notify_transaction(payload: dict):
    logging.info(f"Payload received: {payload}")

    user_id = payload.get("user_id")
    crypto_name = payload.get("crypto_name")
    amount = payload.get("amount")
    tx_type = payload.get("tx_type")
    transaction_id = payload.get("transaction_id")

    if not all([user_id, crypto_name, amount, tx_type, transaction_id]):
        logging.warning("Payload missing required fields")
        return {"status": "error", "message": "Missing fields"}

    logging.info(f"Sending notification for transaction {transaction_id}")
    await notify_admin_new_transaction(user_id, crypto_name, amount, tx_type, transaction_id)
    logging.info(f"Notification sent for transaction {transaction_id}")
    return {"status": "ok"}
