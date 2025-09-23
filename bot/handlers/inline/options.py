import aiohttp
from aiogram import Router, types, F
from aiogram.enums import ParseMode
from aiogram.types import InlineKeyboardMarkup, InlineKeyboardButton
from keyboards.translations import TEXTS 
from api.language import get_user_language
from typing import Union # 1. Импортируем Union из модуля typing

router = Router()

COINS_LIST = [
    "Bitcoin", "Qtum", "Ethereum", "Tron", "Litecoin", "Ripple",
    "Cardano", "Solana", "Luna", "Doge", "Polkadot", "Avalanche",
    "Uniswap", "Aptos", "Flow", "EOS", "Chainlink", "Quant",
    "Maker", "Trump"
]
COINS_CALLBACK_DATA = [coin.lower() for coin in COINS_LIST]

# --- Функция для получения курса с CoinGecko API ---
# 2. Заменяем "float | None" на "Union[float, None]"
async def get_crypto_price(coin_id: str) -> Union[float, None]:
    """
    Получает цену криптовалюты в USD с помощью API CoinGecko.
    """
    if coin_id == "trump":
        coin_id = "maga"
        
    url = f"https://api.coingecko.com/api/v3/simple/price?ids={coin_id}&vs_currencies=usd"
    try:
        async with aiohttp.ClientSession() as session:
            async with session.get(url) as response:
                if response.status == 200:
                    data = await response.json()
                    if coin_id in data and 'usd' in data[coin_id]:
                        return data[coin_id]['usd']
    except Exception as e:
        print(f"Ошибка при получении курса для {coin_id}: {e}")
    return None

def get_coins_menu(lang="ru") -> InlineKeyboardMarkup:
    coins_layout = [
        ["Bitcoin", "Qtum"], ["Ethereum", "Tron"], ["Litecoin", "Ripple"],
        ["Cardano", "Solana"], ["Luna", "Doge"], ["Polkadot", "Avalanche"],
        ["Uniswap", "Aptos"], ["Flow", "EOS"], ["Chainlink", "Quant"],
        ["Maker", "Trump"]
    ]

    keyboard_buttons = []
    for pair in coins_layout:
        row = [InlineKeyboardButton(text=coin, callback_data=coin.lower()) for coin in pair]
        keyboard_buttons.append(row)

    return InlineKeyboardMarkup(inline_keyboard=keyboard_buttons)


@router.message(F.text == "📊 Опционы")
async def options_handler(message: types.Message):
    user_lang = get_user_language(message.from_user.id)
    text = TEXTS[user_lang]["options"]
    keyboard = get_coins_menu(user_lang)
    await message.answer(text, parse_mode=ParseMode.HTML, reply_markup=keyboard)


@router.callback_query(F.data.in_(COINS_CALLBACK_DATA))
async def invest_coin_handler(callback: types.CallbackQuery):
    await callback.answer()

    coin_id = callback.data
    coin_name = coin_id.capitalize()

    price = await get_crypto_price(coin_id)

    if price is not None:
        formatted_price = f"{price:,.2f}$"
        
        text = (
            f"🌐 Введите сумму, которую хотите инвестировать в {coin_name}.\n\n"
            f"Минимальная сумма инвестиций - 100₽\n"
            f"Курс монеты - <b>{formatted_price}</b>\n\n"
            f"Ваш денежный баланс: 0₽"
        )
    else:
        text = f"❌ Не удалось получить актуальный курс для {coin_name}. Попробуйте позже."

    keyboard = InlineKeyboardMarkup(inline_keyboard=[
        [InlineKeyboardButton(text="Обновить курс", callback_data=f"update_{coin_id}")],
        [InlineKeyboardButton(text="Отмена", callback_data="cancel_investment")]
    ])
    
    await callback.message.edit_text(text, reply_markup=keyboard, parse_mode=ParseMode.HTML)


@router.callback_query(F.data.startswith("update_"))
async def update_price_handler(callback: types.CallbackQuery):
    await callback.answer(text="Курс обновлен!", show_alert=True)

@router.callback_query(F.data == "cancel_investment")
async def cancel_investment_handler(callback: types.CallbackQuery):
    await callback.message.delete()
    await callback.answer("Действие отменено.")