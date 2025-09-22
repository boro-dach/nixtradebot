from aiogram import Router, types
from keyboards.inline import get_coins_menu
from aiogram.enums import ParseMode
from keyboards.translations import TEXTS
from api.language import get_user_language

router = Router()

@router.message(lambda m: m.text == "📊 Опционы")
async def options_handler(message: types.Message):
    user_lang = get_user_language(message.from_user.id)
    text = TEXTS[user_lang]["options"]
    keyboard = get_coins_menu(user_lang)
    await message.answer(text, parse_mode=ParseMode.HTML, reply_markup=keyboard)
