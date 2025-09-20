from aiogram import Router, types
from keyboards.inline import get_deposit_menu
from api.language import get_user_language

router = Router()

@router.callback_query(lambda c: c.data == "deposit")
async def deposit_handler(callback: types.CallbackQuery):
    user_lang = get_user_language(callback.from_user.id)
    keyboard = get_deposit_menu()
    text = "Выберите вариант пополнения баланса:" if user_lang == "RU" else "Choose a deposit method:"
    await callback.message.answer(text, reply_markup=keyboard)
    await callback.answer()
