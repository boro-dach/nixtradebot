import aiohttp
import logging
from typing import Union, Optional, Dict, Any 

async def create_transaction(
    user_id: Union[str, int],
    amount: float,
    currency: str,
    transaction_type: str = "DEPOSIT"
) -> Optional[Dict[str, Any]]:
    url = "http://localhost:5000/transaction/create"
    payload = {
        "user_id": str(user_id),
        "amount": amount,
        "currency": currency.upper(),
        "type": transaction_type
    }
    
    try:
        async with aiohttp.ClientSession() as session:
            async with session.post(url, json=payload) as response:
                if response.status == 200:
                    try:
                        data = await response.json()
                        logging.info(f"Transaction created successfully: {data}")
                        return data
                    except Exception as e:
                        logging.error(f"Error parsing transaction response: {e}")
                        return None
                else:
                    error_text = await response.text()
                    logging.error(f"Transaction API Error: Status {response.status}, Response: {error_text}")
                    return None
                    
    except aiohttp.ClientError as e:
        logging.error(f"Connection error to transaction API: {e}")
        return None
    except Exception as e:
        logging.error(f"Unexpected error in create_transaction: {e}")
        return None