from pathlib import Path
from aiogram import Router, types
from aiogram.filters import Command
from aiogram.enums import ParseMode
from aiogram.types import InlineKeyboardButton, InlineKeyboardMarkup, CallbackQuery, FSInputFile

from keyboards.inline import get_web_app_menu
from keyboards.translations import TEXTS
from api.auth import login_user

router = Router()

BOT_ROOT = Path.cwd()
PHOTO_PATH = BOT_ROOT.joinpath("images", "welcome.jpg")


@router.message(Command("start"))
async def cmd_start(message: types.Message):
    api_response = await login_user(tgid=message.from_user.id)

    if api_response is None:
        await message.answer(
            "К сожалению, произошла ошибка при подключении к серверу. "
            "Пожалуйста, попробуйте снова позже."
        )
        return
    
    keyboard = InlineKeyboardMarkup(
        inline_keyboard=[
            [
                InlineKeyboardButton(text="Русский", callback_data="lang_ru"),
                InlineKeyboardButton(text="English", callback_data="lang_en"),
            ]
        ]
    )
    await message.answer("Выберите язык / Choose language", reply_markup=keyboard)


@router.callback_query(lambda c: c.data and c.data.startswith('lang_'))
async def process_language_select(callback: types.CallbackQuery):
    if not PHOTO_PATH.exists():
        error_text = f"Ошибка: не удалось найти изображение по пути: {PHOTO_PATH}"
        print(error_text)
        await callback.message.answer(error_text)
        await callback.answer()
        return

    code = callback.data.split('_')[1]
    photo = FSInputFile(PHOTO_PATH)
    text = TEXTS.get(code, {}).get("welcome", "Welcome text not found.")
    keyboard = get_web_app_menu()

    await callback.message.answer_photo(
        photo=photo,
        caption=text,
        parse_mode=ParseMode.HTML,
        reply_markup=keyboard
    )

    await callback.answer()
    await callback.message.delete()