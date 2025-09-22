from aiogram import Router, types
from aiogram.types import FSInputFile
from keyboards.inline import get_deposit_menu
from api.language import get_user_language
from pathlib import Path

CURRENT_FILE_PATH = Path(__file__).resolve().parent

PHOTO_PATH = CURRENT_FILE_PATH.parent.parent.joinpath("images", "deposit.jpg")

router = Router()

@router.callback_query(lambda c: c.data == "deposit")
async def deposit_handler(callback: types.CallbackQuery):
    user_lang = get_user_language(callback.from_user.id)
    keyboard = get_deposit_menu()

    photo = FSInputFile(PHOTO_PATH)

    text = "Выберите вариант пополнения баланса:" if user_lang == "RU" else "Choose a deposit method:"
    await callback.message.answer_photo(photo=photo, caption=text, reply_markup=keyboard)
    await callback.answer()
