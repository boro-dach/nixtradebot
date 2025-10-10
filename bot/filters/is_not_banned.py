# Файл: bot/filters/is_not_banned.py
from aiogram.filters import BaseFilter
from aiogram.types import Message, CallbackQuery
from typing import Union

from api.user import get_user_by_id

class IsNotBanned(BaseFilter):
    async def __call__(self, event: Union[Message, CallbackQuery]) -> bool:
        user_id = event.from_user.id
        
        user_data = await get_user_by_id(user_id)
        
        if not user_data:
            return False
            
        is_banned = user_data.get("isBannedInBot", False)
        
        if is_banned:
            if isinstance(event, Message):
                await event.answer("❌ Ваш аккаунт заблокирован. Обратитесь в поддержку.")
            elif isinstance(event, CallbackQuery):
                await event.answer("❌ Ваш аккаунт заблокирован.", show_alert=True)
            return False 
        
        return True 