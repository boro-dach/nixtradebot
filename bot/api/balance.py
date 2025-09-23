import aiohttp
import logging
from typing import Union, Optional

async def fetch_balance(tgid: Union[str, int], amount: int = 0) -> Optional[float]:
    url = f"http://localhost:5000/balance/get"
    payload = {
        "tgid": str(tgid),
        "amount": amount
    }
    
    try:
        async with aiohttp.ClientSession() as session:
            async with session.post(url, json=payload) as response:
                if response.status == 200:
                    data = await response.json()
                    balance = data.get("balance")
                    
                    # Ensure we return a float or None
                    if balance is not None:
                        return float(balance)
                    else:
                        logging.warning(f"Balance not found in API response for tgid: {tgid}")
                        return None
                        
                else:
                    error_text = await response.text()
                    logging.error(f"API Error: Status {response.status}, Response: {error_text}")
                    return None
                    
    except aiohttp.ClientError as e:
        logging.error(f"Connection error to API: {e}")
        return None
    except ValueError as e:
        logging.error(f"Error parsing API response: {e}")
        return None
    except Exception as e:
        logging.error(f"Unexpected error in fetch_balance: {e}")
        return None