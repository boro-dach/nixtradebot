from aiogram.types import InlineKeyboardMarkup, InlineKeyboardButton, WebAppInfo
from keyboards.translations import BUTTONS

# Профиль
def get_profile_menu(lang="ru"):
    b = BUTTONS[lang]
    return InlineKeyboardMarkup(
        inline_keyboard=[
            [InlineKeyboardButton(text=b["deposit"], callback_data="deposit"),
             InlineKeyboardButton(text=b["withdraw"], callback_data="withdraw")],
            [InlineKeyboardButton(text=b["verify"], callback_data="verify"),
             InlineKeyboardButton(text=b["settings"], callback_data="settings")],
            [InlineKeyboardButton(text=b["actives"], callback_data="actives")]
        ]
    )

# Пополнение
def get_deposit_menu(lang="ru"):
    b = BUTTONS[lang]
    return InlineKeyboardMarkup(
        inline_keyboard=[
            [InlineKeyboardButton(text=b["bankcard"], callback_data="bankcard")],
            [InlineKeyboardButton(text=b["crypto"], callback_data="crypto")],
            [InlineKeyboardButton(text=b["promocode"], callback_data="promocode")],
        ]
    )

def get_deposit_crypto_menu():
    return InlineKeyboardMarkup(
        inline_keyboard=[
            [InlineKeyboardButton(text="TON", callback_data="deposit_ton")],
            [InlineKeyboardButton(text="USDT TRC20", callback_data="deposit_usdt")],
            [InlineKeyboardButton(text="Bitcoin", callback_data="deposit_bitcoin")],
            [InlineKeyboardButton(text="Ethereum", callback_data="deposit_eth")]
        ]
    )

# Криптовалюты
def get_coins_menu(lang="ru") -> InlineKeyboardMarkup:
    coins = [
        ["Bitcoin", "Qtum"], ["Ethereum", "Tron"], ["Litecoin", "Ripple"],
        ["Cardano", "Solana"], ["Luna", "Doge"], ["Polkadot", "Avalanche"],
        ["Uniswap", "Aptos"], ["Flow", "EOS"], ["Chainlink", "Quant"],
        ["Maker", "Trump"]
    ]

    # inline_keyboard должен быть списком списков кнопок
    keyboard_buttons = []
    for pair in coins:
        row = [InlineKeyboardButton(text=coin, callback_data=coin.lower()) for coin in pair]
        keyboard_buttons.append(row)

    keyboard = InlineKeyboardMarkup(inline_keyboard=keyboard_buttons)
    return keyboard

# О платформе
def get_about_menu(lang="ru"):
    b = BUTTONS[lang]
    return InlineKeyboardMarkup(
        inline_keyboard=[
            [InlineKeyboardButton(text=b["terms"], callback_data="terms"),
             InlineKeyboardButton(text=b["certificate"], callback_data="certificate")],
            [InlineKeyboardButton(text=b["docs"], callback_data="docs"),
             InlineKeyboardButton(text=b["garancy"], callback_data="garancy")],
            [InlineKeyboardButton(text=b["network"], callback_data="network"),
             InlineKeyboardButton(text=b["referal"], callback_data="referal")]
        ]
    )

# Веб-приложение
def get_web_app_menu():
    return InlineKeyboardMarkup(
        inline_keyboard=[
            [InlineKeyboardButton(text="🌐 Website", web_app=WebAppInfo(url="https://nixtradebot.vercel.app"))]
        ]
    )

# Настройки
def get_settings_menu(lang="ru"):
    b = BUTTONS[lang]
    return InlineKeyboardMarkup(
        inline_keyboard=[
            [InlineKeyboardButton(text=b["currency"], callback_data="currency")],
            [InlineKeyboardButton(text=b["language"], callback_data="language")],
            [InlineKeyboardButton(text=b["back"], callback_data="profile")]
        ]
    )

# Язык
def get_language_menu():
    return InlineKeyboardMarkup(
        inline_keyboard=[
            [InlineKeyboardButton(text="🇺🇸 ENG", callback_data="eng")],
            [InlineKeyboardButton(text="🇷🇺 RUS", callback_data="ru")],
            [InlineKeyboardButton(text="🔙", callback_data="profile")]
        ]
    )

# Валюта
def get_currency_menu(lang="ru"):
    b = BUTTONS[lang]
    return InlineKeyboardMarkup(
        inline_keyboard=[
            [InlineKeyboardButton(text="🇷🇺 RUB", callback_data="rub")],
            [InlineKeyboardButton(text="🇰🇿 KZT", callback_data="kzt")],
            [InlineKeyboardButton(text="🇺🇦 UAH", callback_data="uah")],
            [InlineKeyboardButton(text=b["back"], callback_data="profile")]
        ]
    )

# Активы
def get_actives_menu(lang="ru"):
    b = BUTTONS[lang]
    return InlineKeyboardMarkup(
        inline_keyboard=[
            [InlineKeyboardButton(text=b["buy"], callback_data="buy"),
             InlineKeyboardButton(text=b["sell"], callback_data="sell")],
            [InlineKeyboardButton(text=b["back"], callback_data="profile")]
        ]
    )

# Покупка
def get_buy_menu():
    coins = ["BTC", "ETH", "USDT", "SHIB", "ATOM"]
    keyboard = InlineKeyboardMarkup()
    # Первая строка 3 кнопки
    keyboard.row(*[InlineKeyboardButton(text=coin, callback_data=f"buy_{coin.lower()}") for coin in coins[:3]])
    # Вторая строка 2 кнопки
    keyboard.row(*[InlineKeyboardButton(text=coin, callback_data=f"buy_{coin.lower()}") for coin in coins[3:]])
    # Кнопка назад
    keyboard.add(InlineKeyboardButton(text="🔙", callback_data="profile"))
    return keyboard

# Продажа
def get_sell_menu():
    coins = ["BTC", "ETH", "USDT", "SHIB", "ATOM"]
    keyboard = InlineKeyboardMarkup()
    keyboard.row(*[InlineKeyboardButton(text=coin, callback_data=f"sell_{coin.lower()}") for coin in coins[:3]])
    keyboard.row(*[InlineKeyboardButton(text=coin, callback_data=f"sell_{coin.lower()}") for coin in coins[3:]])
    keyboard.add(InlineKeyboardButton(text="🔙", callback_data="profile"))
    return keyboard

def get_help_menu(lang="ru"):
    b = BUTTONS[lang]
    return InlineKeyboardMarkup(
        inline_keyboard = [
            [InlineKeyboardButton(text=b["help"], url="https://t.me/nixmoderator")]
        ]
    )