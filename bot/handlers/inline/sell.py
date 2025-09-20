from aiogram import Router, types
from keyboards.inline import sell_menu

router = Router()

@router.callback_query(lambda c: c.data == "sell")
async def sell_handler(callback: types.CallbackQuery):

    text = (
        "ℹ️ Продажа актива по текущей цене на момент заключения "
        "сделки. В контексте финансовых рынков, спот-сделки  "
        "обычно заключаются на валютных и товарных рынках. При "
        "продаже спотов, трейдер продает актив и получает за него "
        "деньги по текущей рыночной цене.\n\n "
        "Популярные монеты на споте с низкими комиссиями:"
        )

    await callback.message.answer(text, reply_markup=sell_menu)
    await callback.answer()