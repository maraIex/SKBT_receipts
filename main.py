import requests

# Данные из QR-кода
qr_data = "t=20240101T1200&s=100.00&fn=9289000100&i=12345&fp=1234567890"

# Парсим параметры
params = dict(x.split('=') for x in qr_data.split('&'))
fn = params['fn']
i = params['i']
fp = params['fp']
t = params['t']  # формат: 20240101T1200 → 2024-01-01T12:00:00

# Форматируем дату
formatted_date = f"{t[:4]}-{t[4:6]}-{t[6:8]}T{t[9:11]}:{t[11:13]}:00"

# Ваш токен ФНС
API_TOKEN = "32628.CIPPhHYjg8dOqz8ql"

# URL запроса
url = f"https://api-fns.ru/api/v1/ofds//inns//fss/{fn}/operations/1/tickets/{i}"

# Параметры запроса
params = {
    "fiscalSign": fp,
    "date": formatted_date,
    "key": API_TOKEN  # ваш API-ключ
}

# Отправка GET-запроса
response = requests.get(url, params=params)

# Обработка ответа
if response.status_code == 200:
    print("Чек найден:", response.json())
else:
    print("Ошибка:", response.status_code, response.text)