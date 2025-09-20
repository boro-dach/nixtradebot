from aiogram import Router, types
from aiogram.filters import Command
from keyboards.reply import main_menu
from api.login import login

router = Router()

@router.message(Command("start"))
async def cmd_start(message: types.Message):

    tgid = message.from_user.id

    login_result = await login(tgid)
    print("Ответ api: ", login_result)

    await message.answer(
    "🔷 Добро пожаловать на криптовалютную биржу NIX TRADE!\n\n"
    "Мы рады приветствовать Вас на нашей платформе, где Вы можете "
    "торговать различными криптовалютами и получать прибыль от изменения их курсов. "
    "NIX TRADE предоставляет удобный и безопасный способ покупки, продажи и обмена "
    "самых разных криптовалют, а также множество инструментов для анализа "
    "и принятия решений на основе данных.\n\n"
    "Наша команда постоянно работает над улучшением нашей платформы, "
    "чтобы обеспечить нашим клиентам лучший опыт торговли криптовалютами. "
    "Мы также гарантируем полную безопасность Ваших средств. "
    "Если у Вас возникнут вопросы или затруднения, наша служба поддержки "
    "всегда готова помочь Вам.\n\n"
    "Спасибо, что выбрали NIX TRADE! Мы надеемся на долгосрочное сотрудничество "
    "с Вами и желаем Вам успешной торговли на нашей платформе.",
        reply_markup=main_menu
    )
