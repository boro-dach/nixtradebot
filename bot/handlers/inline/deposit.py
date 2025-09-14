from aiogram import Router, types
from keyboards.inline import deposit_menu

router = Router()

@router.callback_query(lambda c: c.data == "deposit")
async def deposit_handler(callback: types.CallbackQuery):
    await callback.message.answer("Выберите вариант пополнения баланса:", reply_markup=deposit_menu)
    await callback.answer()