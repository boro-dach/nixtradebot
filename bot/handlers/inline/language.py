from aiogram import Router, types, F
from keyboards.inline import language_menu
import config as g

router = Router()

@router.callback_query(F.data == "language")
async def currency_handler(callback: types.CallbackQuery):
    text = "Выберите язык:"
    await callback.message.edit_text(text, reply_markup=language_menu)
    await callback.answer()

@router.callback_query(F.data.in_({"russian", "english"}))
async def set_currency(callback: types.CallbackQuery):
    g.language = callback.data.upper()
    await callback.answer(f"Язык изменён на {g.language} ✅")
    await callback.message.edit_text(
        f"Текущий язык: {g.language}",
        reply_markup=language_menu
    )
