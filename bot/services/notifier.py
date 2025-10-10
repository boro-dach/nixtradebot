from aiogram.types import InlineKeyboardButton, InlineKeyboardMarkup

from bot_config import bot, ADMIN_IDS
async def notify_admin_new_transaction(
    user_id: str,
    crypto_name: str,
    amount: str,
    tx_type: str,
    transaction_id: str
):
    """
    Отправляет уведомление администраторам о новой транзакции.
    """
    text = (
        f"💰 <b>Новая транзакция</b>\n\n"
        f"Пользователь: <code>{user_id}</code>\n"
        f"Актив: <b>{crypto_name}</b>\n"
        f"Сумма: <code>{amount}</code>\n"
        f"Тип: <b>{tx_type}</b>"
    )

    keyboard = InlineKeyboardMarkup(
        inline_keyboard=[
            [
                InlineKeyboardButton(
                    text="✅ Подтвердить",
                    callback_data=f"tx_confirm_{transaction_id}"
                ),
                InlineKeyboardButton(
                    text="❌ Отклонить",
                    callback_data=f"tx_cancel_{transaction_id}"
                )
            ]
        ]
    )

    for admin_id in ADMIN_IDS:
        await bot.send_message(
            chat_id=admin_id, 
            text=text, 
            reply_markup=keyboard, 
            parse_mode="HTML"
        )