from aiogram import Router, types
from aiogram.types import FSInputFile
from aiogram.enums import ParseMode
from keyboards.inline import get_profile_menu
from keyboards.translations import TEXTS
from api.language import get_user_language
from pathlib import Path

router = Router()

CURRENT_FILE_PATH = Path(__file__).resolve().parent

PHOTO_PATH = CURRENT_FILE_PATH.parent.parent.joinpath("images", "profile.jpg")


@router.message(lambda m: m.text == "💼 Личный кабинет")
async def profile_handler(message: types.Message):
    user_lang = get_user_language(message.from_user.id)
    text = TEXTS[user_lang]["profile"].format(user_id=message.from_user.id)
    keyboard = get_profile_menu()

    photo = FSInputFile(PHOTO_PATH)

    await message.answer_photo(
        photo=photo,
        caption=text,
        parse_mode=ParseMode.HTML,
        reply_markup=keyboard
    )