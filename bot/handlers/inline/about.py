from aiogram import Router, types
from keyboards.inline import get_about_menu
from aiogram.enums import ParseMode
from keyboards.translations import TEXTS
from api.language import get_user_language

router = Router()

@router.message(lambda m: m.text == "🔷 О сервисе")
async def about_handler(message: types.Message):
    user_lang = get_user_language(message.from_user.id)
    text = TEXTS[user_lang]["about"]
    keyboard = get_about_menu()
    await message.answer(text, parse_mode=ParseMode.HTML, reply_markup=keyboard)
