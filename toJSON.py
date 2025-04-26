import requests
import json

import changeWords

text = """
"KrlCUUBЫИ ЧЕК ПIРИХUI ПРодажа   Il29526 Емвна Цн1 IL280 1 ,00U x 40,00 =40,00 Хлеб 2.0UU х 2,0М =4 ,0И КомПот Mз ЕУХОФРЧК ТОB 1,00M x 20,00 =20,00 КРасное кfaP; 1,000 х 50.00 =50,00 КонТейнет 2QOMл . ПРЯНЕУГ КРЫШК ой 1 (U0 х 6.00 6 ,00 НДС 20% 21 .00 итог =12ш wu Счмма ндС 20* i1.00 Сзнма БЕЗ НдС =114 00 БЕ ~нЯЛИЧНЫми =1zu . gw 1il; 1 +iibiiui: FU('ilart [Ltillk  Llжe | HUё ui Pa juija i ЁflblIUL  ЧlцiРНИР {Ы Ш&Г 0 Ulx i ijijaiilii| ;Ёuia | UВCKИЙ {Uf `titaPE {НЕНПЫЙ 4₽хМ'Еf КИЙ чi {HLEPEMTET iitit:tIи ГаГаРиt .f: 4iйU34,1   . Ё;/  1 | 1l, 'Jfl  ПtпlитекпнчеЕ:Ках; Ц. 77 Kaf [M; Гн:aPeпа Юнlя {Ii:1 1& Ка [ Ч Ii ' }и] : ('1(INая 25 CHU: IC:II ii  ё _ 1  kt : (J(J(J : l;Zli3-itJujl7'70 Iiffin 12i3 JIt tkl: +0U3UY106b62954  14357 ЁаЙ| 'tli' WWlil. Ild ]Ug oU.ru 15348 {6925 7ЗЖ6Ч U5U1 ]93957 Mlll:   6+5+064 IiJU 25.U9.25 13:41\n{НЛНЙН-KHCCn 3U]Np хоРошЕт < щН Я 
"""

prompt = f"""
Проанализируй текст чека и верни данные в формате JSON. Структура:
{{
  "store": "название магазина",
  "date": "дата в формате YYYY-MM-DD",
  "time": "время в формате HH:MM",
  "items": [
    {{"name": "название товара", "price": цена}},
    ...
  ],
  "total": общая_сумма
}}

Текст чека:
{text}
"""

url = "https://openrouter.ai/api/v1/chat/completions"
api_key = "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"

headers = {
    "Authorization": f"Bearer {api_key}",
    "HTTP-Referer": "https://github.com/maraIex/SKBT_receipts",
    "X-Title": "My AI Project",
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