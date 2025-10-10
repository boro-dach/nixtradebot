import os
import logging
import aiohttp
from dotenv import load_dotenv
from typing import Union, List 

load_dotenv()

BASE_URL = os.getenv("API_BASE_URL")

async def get_user_balance(user_id: int) -> Union[List[dict], None]:
    url = f"{BASE_URL}/balance/{user_id}"
    try:
        async with aiohttp.ClientSession() as session:
            async with session.get(url) as response:
                if response.status == 200:
                    return await response.json()
                elif response.status == 404:
                    logging.warning(f"User with ID {user_id} not found in API.")
                    return [] 
                else:
                    logging.error(
                        f"Failed to get balance for user {user_id}. "
                        f"Status: {response.status}, "
                        f"Response: {await response.text()}"
                    )
                    return None
    except aiohttp.ClientConnectorError as e:
        logging.error(f"API connection error: {e}")
        return None

async def update_asset_balance(asset_balance_id: str, new_amount: float) -> bool:
    # ...
    return False