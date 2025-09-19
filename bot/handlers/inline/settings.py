from aiogram import Router, types, F
from aiogram.types import InlineKeyboardMarkup, InlineKeyboardButton
from keyboards.inline import settings_menu

router = Router()

@router.callback_query(lambda c: c.data == "settings")
async def settings_handler(callback: types.CallbackQuery):
    text = "Выберите:"
    await callback.message.answer(text, reply_markup=settings_menu)
    await callback.answer()