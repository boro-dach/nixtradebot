from aiogram import Router, types
from keyboards.inline import get_profile_menu
from keyboards.translations import TEXTS
from api.language import get_user_language

router = Router()

@router.message(lambda m: m.text == "💼 Личный кабинет")
async def profile_handler(message: types.Message):
    user_lang = get_user_language(message.from_user.id)

    # Подставляем текст с учётом языка
    text = TEXTS[user_lang]["profile"].format(user_id=message.from_user.id)

    keyboard = get_profile_menu()

    await message.answer(text, reply_markup=keyboard)
