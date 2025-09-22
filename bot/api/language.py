import requests
import logging

logger = logging.getLogger(__name__)


def set_user_language(user_id: int, language: str) -> bool:
    try:
        response = requests.post(
            "http://localhost:5000/user/set-language",
            json={"tgid": str(user_id), "language": language.upper()},
            timeout=5
        )
        response.raise_for_status()
        logger.info(f"Language for user {user_id} set to {language.upper()} via API")
        return True
    except Exception as e:
        logger.error(f"Failed to set language for user {user_id}: {e}")
        return False


def get_user_language(user_id: int):
    # try:
    #     response = requests.post(
    #         "http://localhost:5000/user/get-language", 
    #         json={"tgid": str(user_id)},
    #         timeout=5
    #     )
    #     response.raise_for_status()
        
    #     result = response.json()
    #     print(f"API response: {result}")
        
    #     lang = result.get("language", "RU")
    #     return lang.lower()
    # except Exception as e:
    #     logger.error(f"Failed to get language for user {user_id}: {e}")
    #     return "ru"

    return "ru"

