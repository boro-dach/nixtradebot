from aiogram import Router, types, F
from keyboards.inline import currency_menu
import config as g

router = Router()

# Хендлер открытия меню выбора валюты
@router.callback_query(F.data == "currency")
async def currency_handler(callback: types.CallbackQuery):
    text = "Выберите валюту:"
    await callback.message.edit_text(text, reply_markup=currency_menu)
    await callback.answer()

# Хендлер выбора валюты
@router.callback_query(F.data.in_({"rub", "uah", "kzt"}))
async def set_currency(callback: types.CallbackQuery):
    g.currency = callback.data.upper()

    await callback.answer(f"Валюта изменена на {g.currency} ✅")
    await callback.message.edit_text(
        f"Текущая валюта: {g.currency}",
        reply_markup=currency_menu
    )
