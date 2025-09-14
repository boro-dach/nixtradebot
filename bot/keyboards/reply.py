from aiogram.types import ReplyKeyboardMarkup, KeyboardButton

main_menu = ReplyKeyboardMarkup(
    keyboard=[
        [KeyboardButton(text="💼 Личный кабинет"), KeyboardButton(text="📊 Опционы")],
        [KeyboardButton(text="🔷 О сервисе"), KeyboardButton(text="👨‍💻 Тех. Поддержка")],
        [KeyboardButton(text="🌐 Наш веб сайт")]
    ],
    resize_keyboard=True,
    one_time_keyboard=False
)
