import json

# Словарь категорий и ключевых слов
from transformers import pipeline


def predict_category(text):
    result = classifier(text.lower(), truncation=True, max_length=64)
    return result[0]['label']


# Инициализируем классификатор на основе ruBERT
classifier = pipeline(
    "text-classification",
    model="blanchefort/rubert-base-cased-sentiment"
)

# Загрузка данных
with open('receipt_data.json', 'r', encoding='utf-8') as f:
    products = json.load(f)

# Добавление категории в каждый продукт
for item in products['items']:
    name = item['name']
    item['category'] = predict_category(name)

# Сохранение обновленного чека
with open('updated_receipt.json', 'w', encoding='utf-8') as f:
    json.dump(products, f, ensure_ascii=False, indent=4)
