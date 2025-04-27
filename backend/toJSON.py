import requests
import json
import receiptParser
import getNumOfRec

def textScaner(file_name):
    text = receiptParser.process_receipt(file_name)

    prompt = f"""
    Проанализируй текст чека, и верни данные в формате JSON. Структура:
    {{
      "store": "название магазина",
      "date": "дата в формате YYYY-MM-DD",
      "time": "время в формате HH:MM",
      "items": [
        {{"name": "название товара", "price": цена, "quantity": количество}},
        ...
      ],
      "total": общая_сумма
    }}
    
    Текст чека:
    {text}
    Магазин существует в реальности, надо подобрать название ближайшее к нему. Количество умноженное на
    цену и суммированное по всем продуктам должно быть равно итоговой сумме. Все названия реальные, подбирай те, которые подходят.
    """

    url = "https://openrouter.ai/api/v1/chat/completions"
    api_key = "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"

    headers = {
        "Authorization": f"Bearer {api_key}",
        "HTTP-Referer": "https://github.com/maraIex/SKBT_receipts",
        "X-Title": "AI Project",
        "Content-Type": "application/json"
    }

    data = {
        "model": "openchat/openchat-7b",  # ✅ Правильный формат
        "messages": [
            {"role": "user", "content": prompt}
        ]
    }

    try:
        response = requests.post(url, headers=headers, json=data, timeout=30)
        response.raise_for_status()

        json_response = response.json()

        # Извлекаем содержимое ответа AI
        ai_content = json_response['choices'][0]['message']['content']

        # Пытаемся распарсить JSON из ответа AI
        receipt_data = json.loads(ai_content)

        # Можно сохранить в файл
        with open('receipt.json', 'w', encoding='utf-8') as f:
            json.dump(receipt_data, f, indent=2, ensure_ascii=False)

        getNumOfRec.process_receipt("receipt.json", "out_receipt.json")

    except json.JSONDecodeError:
        print("Ошибка: Не удалось распарсить JSON из ответа AI")
        print("Ответ AI:", ai_content)
    except Exception as e:
        print("Произошла ошибка:", str(e))