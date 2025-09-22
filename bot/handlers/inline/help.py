from aiogram import Router, types
from aiogram.enums import ParseMode
from keyboards.inline import get_help_menu
from keyboards.translations import TEXTS
from api.language import get_user_language

router = Router()

@router.message(lambda m: m.text == "👨‍💻 Тех. Поддержка")
async def help_handler(message: types.Message):
    user_lang = get_user_language(message.from_user.id)
    text = TEXTS[user_lang]["help"].format(user_id=message.from_user.id)
    keyboard = get_help_menu()

    await message.answer(
        text=text,
        parse_mode=ParseMode.HTML,
        reply_markup=keyboard
    )