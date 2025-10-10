from aiogram import Router, types
from aiogram.types import FSInputFile
from aiogram.enums import ParseMode
from keyboards.inline import get_profile_menu
from keyboards.translations import TEXTS
from api.language import get_user_language
from api.balance import get_user_balance
from pathlib import Path
import logging

router = Router()
CURRENT_FILE_PATH = Path(__file__).resolve().parent
PHOTO_PATH = CURRENT_FILE_PATH.parent.parent.joinpath("images", "profile.jpg")

@router.message(lambda m: m.text == "💼 Личный кабинет")
async def profile_handler(message: types.Message):
    try:
        user_lang = get_user_language(message.from_user.id)
        user_id = message.from_user.id
        
        # Fetch balance with fallback
        balance_value = await get_user_balance(tgid=user_id)
        balance = balance_value 
        # if balance_value is not None else 0.0
        
        # Format the text
        text = TEXTS[user_lang]["profile"].format(user_id=user_id, balance=balance)
        
        keyboard = get_profile_menu()
        photo = FSInputFile(PHOTO_PATH)
        
        await message.answer_photo(
            photo=photo,
            caption=text,
            parse_mode=ParseMode.HTML,
            reply_markup=keyboard
        )
        
    except Exception as e:
        logging.error(f"Error in profile_handler: {e}")
        await message.answer("❌ Произошла ошибка при загрузке профиля. Попробуйте позже.")