import requests

def extract_category(message):

    categories = [
        "chairs", "desks", "tables", "beds", "sofas",
        "wardrobes", "cabinets", "bookshelves",
        "tv units", "dining sets",
        "office furniture", "outdoor furniture"
    ]

    prompt = f"""
You are a classifier.

User message: {message}

Available categories:
{categories}

Return ONLY the best matching category name.
If nothing matches return: none
"""

    res = requests.post(
        "http://localhost:11434/api/generate",
        json={
            "model": "phi",
            "prompt": prompt,
            "stream": False
        }
    )

    result = res.json()["response"].strip().lower()

    return result if result in categories else None