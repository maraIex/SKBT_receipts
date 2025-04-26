from spellchecker import SpellChecker

spell = SpellChecker(language='ru')  # Загружаем русский словарь


def correct_text(text):
    words = text.split()  # Разбиваем строку на слова
    corrected_words = []

    for word in words:
        # Исправляем каждое слово (если есть варианты)
        corrected_word = spell.correction(word)
        corrected_words.append(corrected_word if corrected_word is not None else word)

    return ' '.join(corrected_words)  # Собираем обратно в строку


# Пример использования
text = ""
corrected_text = correct_text(text)
print(corrected_text)  # Выведет что-то вроде "никакой как дела"