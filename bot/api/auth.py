import os
import logging
import aiohttp
from dotenv import load_dotenv
from typing import Optional, Dict, Any

load_dotenv()

BASE_URL = os.getenv("API_BASE_URL")

async def login_user(tgid: int) -> Optional[Dict[str, Any]]:
    url = f"{BASE_URL}/auth/login" 
    
    payload = {
        "tgid": str(tgid)
    }
    
    logging.info(f"Attempting to login user with payload: {payload}")
    
    try:
        async with aiohttp.ClientSession() as session:
            async with session.post(url, json=payload) as response:
                if response.status in [200, 201]:
                    user_data = await response.json()
                    logging.info(f"Successfully logged in user {tgid}.")
                    return user_data
                else:
                    logging.error(
                        f"Failed to login user {tgid}. "
                        f"Status: {response.status}, "
                        f"Response: {await response.text()}"
                    )
                    return None
    except aiohttp.ClientConnectorError as e:
        logging.error(f"API connection error during login: {e}")
        return None