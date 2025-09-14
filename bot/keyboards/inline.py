from aiogram.types import InlineKeyboardMarkup, InlineKeyboardButton

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
        [InlineKeyboardButton(text="Bitcoin"), InlineKeyboardButton("Qtum")],
        [InlineKeyboardButton(text="Ethereum"), InlineKeyboardButton("Tron")],
        [InlineKeyboardButton(text="Litecoin"), InlineKeyboardButton("Ripple")],
        [InlineKeyboardButton(text="Cardano"), InlineKeyboardButton("Solana")],
        [InlineKeyboardButton(text="Luna"), InlineKeyboardButton("Doge")],
        [InlineKeyboardButton(text="Polkadot"), InlineKeyboardButton("Avalanche")],
        [InlineKeyboardButton(text="Uniswap"), InlineKeyboardButton("Aptos")],
        [InlineKeyboardButton(text="Flow"), InlineKeyboardButton("EOS")],
        [InlineKeyboardButton(text="Chainlink"), InlineKeyboardButton("Quant")],
        [InlineKeyboardButton(text="Maker"), InlineKeyboardButton("Trump")],
    ]
)