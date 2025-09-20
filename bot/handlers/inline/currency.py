from aiogram import Router, types, F
from keyboards.inline import get_currency_menu
from api.language import get_user_language

router = Router()

@router.callback_query(F.data == "currency")
async def currency_handler(callback: types.CallbackQuery):
    user_lang = get_user_language(callback.from_user.id)
    text = "Выберите валюту:" if user_lang == "RU" else "Choose currency"
    keyboard = get_currency_menu()
    await callback.message.edit_text(text, reply_markup=keyboard)
    await callback.answer()
