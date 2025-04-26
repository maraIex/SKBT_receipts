from spellchecker import SpellChecker

spell = SpellChecker(language='ru')  # Требуется словарь для русского
corrected = spell.correction("нидкией")
print(corrected)  # Выведет "привет"