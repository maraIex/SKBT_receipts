import requests
import json

import changeWords

text = """
КАССОВЫЙ ЧЕК |\nПРИХОД\nПродажа 1.29526 ©\nци. 29526 Смена (280\n1.0)\nХлеб, 00 х 4И.00 =40 .00\nы 2.000 х2 24\nКомпот из сухофруктов, 90.00\n1,000 x 20,00 22\nKPacHoe море 90 220.00\n| 1.000 х 50.00 250,00\nparent 200A. ПРЯМОУГ.С КРЫШК\n1.000 х 6.00 =6.00\n: HAC 20x =1.00\n/ WTO =120.0u\n| Cuma HAC 20x =1.00\n° Съмма БЕЗ НАС 2114.00\nDE SHAMIM 2128.3\nНоРРоНЬНОе POC Hart Theil: важетное |\nОБРа Збательное УЧРЕxДЕНИЕ ВЫСШЕГО 6\n` озозания Саратовский гГосчмарственный\nтехнический чниверситет инени Гагарииа\n| WAL\n© 91605460 Copa ruts, Si TOMA KOA He\nКассир Гнусарева Юия\n— Несто восче ние Столовая 25\n| си: оси\n| HBR MS Ви ВЕ 0003925690017\n‚ смена 126 WEEKES P0030 7400b62904\n| Hi 14357 Caw PIC: wu. NATGE. SOU. PU\nре: 154005925 ИК 7380440801193957\nГ 25.04,25 13:01 ИНН; 6459064119\n} Get\n‚ ри,\nWE\n| Е\n4. д a\nнь И\nmeee\nwalt. О\nayeKACCA ABOLOP\naHiIAMH-KACCN\n~OPOUE Tt о дыя*\nАР УМ
"""

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

    # Красивый вывод результата
    print("Обработанные данные чека:")
    print(json.dumps(receipt_data, indent=2, ensure_ascii=False))

    # Можно сохранить в файл
    with open('receipt.json', 'w', encoding='utf-8') as f:
        json.dump(receipt_data, f, indent=2, ensure_ascii=False)
    print("\nДанные сохранены в receipt.json")
except json.JSONDecodeError:
    print("Ошибка: Не удалось распарсить JSON из ответа AI")
    print("Ответ AI:", ai_content)
except Exception as e:
    print("Произошла ошибка:", str(e))