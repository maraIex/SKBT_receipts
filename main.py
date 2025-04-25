import cv2
import numpy as np
import re
from paddleocr import PaddleOCR
import os


class ReceiptOCR:
    def __init__(self):
        self.ocr = self.init_ocr()

    def init_ocr(self):
        """Инициализация OCR с оптимизированными параметрами"""
        return PaddleOCR(
            lang='ru',
            det_db_thresh=0.05,
            det_db_unclip_ratio=2.5,
            use_dilation=True,
            table=False,  # Включить при наличии таблиц
            layout=False,  # Включить при сложной структуре
            show_log=False
        )

    def preprocess_image(self, img_path, debug=False):
        """Улучшенная предобработка изображения"""
        try:
            # Загрузка и увеличение разрешения
            img = cv2.imread(img_path)
            if img is None:
                raise FileNotFoundError(f"Изображение {img_path} не найдено")

            img = cv2.resize(img, None, fx=1.5, fy=1.5, interpolation=cv2.INTER_CUBIC)

            # Улучшение контраста в LAB-пространстве
            lab = cv2.cvtColor(img, cv2.COLOR_BGR2LAB)
            l, a, b = cv2.split(lab)
            clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(16, 16))
            l_contrast = clahe.apply(l)
            enhanced = cv2.merge((l_contrast, a, b))

            # Адаптивная бинаризация
            gray = cv2.cvtColor(enhanced, cv2.COLOR_BGR2GRAY)
            binary = cv2.adaptiveThreshold(
                gray, 255,
                cv2.ADAPTIVE_THRESH_GAUSSIAN_C,
                cv2.THRESH_BINARY, 45, 8
            )

            # Удаление шума
            kernel = np.ones((2, 2), np.uint8)
            cleaned = cv2.morphologyEx(binary, cv2.MORPH_OPEN, kernel)

            if debug:
                self.save_debug_images(img, enhanced, binary, cleaned)

            return cv2.cvtColor(cleaned, cv2.COLOR_GRAY2BGR)

        except Exception as e:
            raise RuntimeError(f"Ошибка предобработки: {str(e)}")

    def save_debug_images(self, *images):
        """Сохранение этапов обработки для отладки"""
        debug_dir = 'ocr_debug'
        os.makedirs(debug_dir, exist_ok=True)

        names = [
            '0_original.jpg',
            '1_lab_enhanced.jpg',
            '2_binary.jpg',
            '3_cleaned.jpg'
        ]

        for img, name in zip(images, names):
            cv2.imwrite(os.path.join(debug_dir, name), img)

    def postprocess_text(self, text):
        """Постобработка распознанного текста"""
        # Коррекция чисел
        text = re.sub(r'(\d)\.(\d{3})', r'\1,\2', text)  # Тысячные
        text = re.sub(r'(\d)\.(\d{2})', r'\1,\2', text)  # Десятичные
        return text

    def process_receipt(self, img_path):
        """Основной процесс обработки"""
        try:
            # Предобработка
            processed_img = self.preprocess_image(img_path, debug=True)

            # Распознавание
            result = self.ocr.ocr(processed_img, cls=False)

            # Извлечение текста
            texts = [line[1][0] for line in result[0]] if result else []
            raw_text = '\n'.join(texts)

            # Постобработка
            final_text = self.postprocess_text(raw_text)

            return final_text

        except Exception as e:
            return f"Ошибка: {str(e)}"


if __name__ == "__main__":
    processor = ReceiptOCR()
    result = processor.process_receipt(r"C:\Users\User\Desktop\test.jpg")
    print("Результат распознавания:\n", result)