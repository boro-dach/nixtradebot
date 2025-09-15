from aiogram.types import InlineKeyboardMarkup, InlineKeyboardButton, WebAppInfo

profile_menu = InlineKeyboardMarkup(
    inline_keyboard=[
        [InlineKeyboardButton(text="💳 Пополнить", callback_data="deposit"),
         InlineKeyboardButton(text="📤 Вывести", callback_data="withdraw")],
        [InlineKeyboardButton(text="🔐 Верификация", callback_data="verify"),
         InlineKeyboardButton(text="⚙️ Настройки", callback_data="settings")],
        [InlineKeyboardButton(text="📂 Мои активы", callback_data="assets")]
    ]
)

deposit_menu = InlineKeyboardMarkup(
    inline_keyboard=[
        [InlineKeyboardButton(text="💳 Пополнить через банковскую карту", callback_data="bankcard")],
        [InlineKeyboardButton(text="💱 Пополнить криптовалютой", callback_data="crypto")],
        [InlineKeyboardButton(text="🎁 Ввести промокод", callback_data="promocode")],
    ]
)

coins_menu = InlineKeyboardMarkup(
    inline_keyboard=[
        [InlineKeyboardButton(text="Bitcoin", callback_data="btc"), InlineKeyboardButton(text="Qtum", callback_data="qtum")],
        [InlineKeyboardButton(text="Ethereum", callback_data="eth"), InlineKeyboardButton(text="Tron", callback_data="tron")],
        [InlineKeyboardButton(text="Litecoin", callback_data="ltc"), InlineKeyboardButton(text="Ripple", callback_data="ripple")],
        [InlineKeyboardButton(text="Cardano", callback_data="cardano"), InlineKeyboardButton(text="Solana", callback_data="solano")],
        [InlineKeyboardButton(text="Luna", callback_data="luna"), InlineKeyboardButton(text="Doge", callback_data="doge")],
        [InlineKeyboardButton(text="Polkadot", callback_data="polkadot"), InlineKeyboardButton(text="Avalanche", callback_data="avalanche")],
        [InlineKeyboardButton(text="Uniswap", callback_data="uni"), InlineKeyboardButton(text="Aptos", callback_data="aptos")],
        [InlineKeyboardButton(text="Flow", callback_data="flow"), InlineKeyboardButton(text="EOS", callback_data="eos")],
        [InlineKeyboardButton(text="Chainlink", callback_data="chain"), InlineKeyboardButton(text="Quant", callback_data="quant")],
        [InlineKeyboardButton(text="Maker", callback_data="maker"), InlineKeyboardButton(text="Trump", callback_data="trump")],
    ]
)

about_menu = InlineKeyboardMarkup(
    inline_keyboard=[
        [InlineKeyboardButton(text="📖 Условия", callback_data="terms"), InlineKeyboardButton(text="📜 Сертификат", callback_data="certificate")],
        [InlineKeyboardButton(text="📚 Документация", callback_data="docs"), InlineKeyboardButton(text="Гарантия сервиса", callback_data="garancy")],
        [InlineKeyboardButton(text="📈 Состояние сети", callback_data="network"), InlineKeyboardButton(text="⚙️ Реферальная система", callback_data="referal")]
    ]
)

web_app_menu = InlineKeyboardMarkup(
    inline_keyboard=[
        [InlineKeyboardButton(text="🌐 Наш веб сайт", web_app=WebAppInfo(url="https://nixtradebot.vercel.app"))]
    ]
)