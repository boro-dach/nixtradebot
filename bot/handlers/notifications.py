from aiogram import Router
from aiogram.types import CallbackQuery
import httpx
import logging

from bot_config import API_BASE_URL

router = Router()

@router.callback_query(lambda c: c.data.startswith("tx_confirm_"))
async def handle_confirm_transaction(callback: CallbackQuery):
    logging.info(f"Confirmation handler started for callback: {callback.data}")

    transaction_id = callback.data.split("_")[-1]


    url = f"{API_BASE_URL}/transaction/accept"
    payload = {"id": transaction_id}
    logging.info(f"Attempting to send POST request to {url} with payload {payload}")

    async with httpx.AsyncClient() as client:
        try:
            response = await client.post(url, json=payload, timeout=10.0)
            logging.info(f"Received response from backend. Status: {response.status_code}, Content: {response.text}")
            
            response.raise_for_status()
        except httpx.RequestError as e:
            logging.error(f"HTTP Request Error for transaction {transaction_id}: {e}")
            await callback.answer("❌ Ошибка сети: не удалось связаться с сервером.", show_alert=True)
            return
        except httpx.HTTPStatusError as e:
            logging.error(f"HTTP Status Error for transaction {transaction_id}: {e}")
            await callback.answer("❌ Ошибка сервера: бэкенд ответил ошибкой.", show_alert=True)
            return

    await callback.message.edit_text(f"✅ Транзакция {transaction_id} подтверждена.")
    await callback.answer()


@router.callback_query(lambda c: c.data.startswith("tx_cancel_"))
async def handle_cancel_transaction(callback: CallbackQuery):
    transaction_id = callback.data.split("_")[-1]

    async with httpx.AsyncClient() as client:
        try:
            response = await client.post(
                f"{API_BASE_URL}/transaction/reject",
                json={"id": transaction_id},
                timeout=10.0
            )
            logging.info(f"Received response from backend. Status: {response.status_code}, Content: {response.text}")
            response.raise_for_status()
        except httpx.HTTPError as e:
            logging.error(f"API Error rejecting transaction {transaction_id}: {e}")
            await callback.answer("❌ Ошибка: не удалось отклонить транзакцию.", show_alert=True)
            return

    await callback.message.edit_text(f"❌ Транзакция {transaction_id} отклонена.")
    await callback.answer()