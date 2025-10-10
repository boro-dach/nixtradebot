import os
from dotenv import load_dotenv
from aiogram.filters import BaseFilter
from aiogram.types import Message

load_dotenv()

ADMIN_IDS = [int(admin_id) for admin_id in os.getenv("ADMIN_IDS").split(',')]

class IsAdmin(BaseFilter):
    async def __call__(self, message: Message) -> bool:
        return message.from_user.id in ADMIN_IDS