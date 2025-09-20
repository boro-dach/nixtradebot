from aiogram import Router, types
from keyboards.inline import get_profile_menu
from keyboards.translations import TEXTS
from api.language import get_user_language

router = Router()

@router.callback_query(lambda c: c.data == "profile")
async def back_to_profile_handler(callback: types.CallbackQuery):
    user_lang = get_user_language(callback.from_user.id)
    text = TEXTS[user_lang]["profile"].format(user_id=callback.from_user.id)
    keyboard = get_profile_menu()
    await callback.message.edit_text(text, reply_markup=keyboard)
    await callback.answer()

@router.message(lambda m: m.text == "💼 Личный кабинет")
async def profile_handler(message: types.Message):
    user_lang = get_user_language(message.from_user.id)
    text = TEXTS[user_lang]["profile"].format(user_id=message.from_user.id)
    keyboard = get_profile_menu()
    await message.answer(text, reply_markup=keyboard)
