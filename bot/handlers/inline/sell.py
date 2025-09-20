from aiogram import Router, types
from keyboards.inline import get_sell_menu
from keyboards.translations import TEXTS
from api.language import get_user_language

router = Router()

@router.callback_query(lambda c: c.data == "sell")
async def sell_handler(callback: types.CallbackQuery):
    user_lang = get_user_language(callback.from_user.id)
    text = TEXTS[user_lang]["sell"]
    keyboard = get_sell_menu()
    await callback.message.answer(text, reply_markup=keyboard)
    await callback.answer()
