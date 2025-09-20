from aiogram import Router, types
from keyboards.inline import actives_menu

router = Router()

@router.callback_query(lambda c: c.data == "actives")
async def actives_handler(callback: types.CallbackQuery):

    text = (
        "Активы - это финансовые инструменты, которые "
        "трейдеры покупают или продают на рынке для "
        "получения прибыли. Это могут быть различные "
        "виды финансовых инструментов, включая акции, "
        "валюты, сырьевые товары, облигации, опционы и "
        "другие. \n\n"
        "🗄 Активы:\n"
        "┏ BTC: 0.0\n"
        "┣ ETH: 0.0\n"
        "┣ USDT: 0.0\n"
        "┣ SHIB: 0.0\n"
        "┗ ATOM: 0.0"
        )

    await callback.message.answer(text, reply_markup=actives_menu)
    await callback.answer()