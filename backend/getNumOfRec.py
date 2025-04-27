import json
import re
from sentence_transformers import SentenceTransformer
import numpy as np

# Инициализация модели
model = SentenceTransformer('sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2')  # Более мощная модель

# Описания категорий
category_descriptions = {
    0: "продукты бакалея хлеб молоко сыр колбаса соки напитки снеки",
    1: "лекарства аптека витамины медтехника бинты мазь сироп таблетки суспензии",
    2: "тренажеры спортзал кроссовки мячи фитнес тренировки спортивное питание гантели оборудование",
    3: "книги рукоделие рисование музыка инструменты коллекционирование моделизм",
    4: "еда напитки пицца суши бургер столовая кафе кофе ресторан меню",
    5: "запчасти шины мойка бензин масло автомобиль тюнинг аккумулятор",
    6: "другое неклассифицируемое море океан экзотика специализированное искусство предметы роскоши"
}

category_embeddings = {cid: model.encode(desc) for cid, desc in category_descriptions.items()}

def preprocess_name(name):
    # Приводим к нижнему регистру, удаляем спецсимволы и лишние пробелы
    name = name.lower()
    name = re.sub(r'[^\w\s]', '', name)
    name = re.sub(r'\s+', ' ', name).strip()
    return name

def cosine_similarity(a, b):
    return np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b))


def categorize_items(items, threshold=0.35):
    processed = []

    for item in items:
        clean_name = preprocess_name(item['name'])

        item_embedding = model.encode(clean_name)

        best_category = 6
        best_similarity = threshold
        for cid, c_emb in category_embeddings.items():
            sim = cosine_similarity(item_embedding, c_emb)
            if sim > best_similarity:
                best_similarity = sim
                best_category = cid
        processed.append({**item, "category": best_category})
    return processed


def process_receipt(input_path, output_path):
    # Чтение входного файла
    try:
        with open(input_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
    except Exception as e:
        print(f"Ошибка чтения файла: {str(e)}")
        return

    # Обработка товаров
    data['items'] = categorize_items(data['items'])

    # Сохранение результата
    try:
        # Создаем директорию для выходного файла если нужно
        with open(output_path, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        print(f"Файл успешно сохранен: {output_path}")
    except Exception as e:
        print(f"Ошибка сохранения: {str(e)}")