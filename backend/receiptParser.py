import cv2
import numpy as np
import pytesseract
import re
import threading

# ========== ГЛОБАЛЬНЫЕ НАСТРОЙКИ ========== #
# Укажите путь к Tesseract (если требуется)
pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"

# ========== ОСНОВНЫЕ ФУНКЦИИ ========== #
def four_point_transform(image, pts):
    """Выравнивает область документа по четырём точкам."""
    rect = order_points(pts)
    (tl, tr, br, bl) = rect

    widthA = np.sqrt(((br[0] - bl[0]) ** 2) + ((br[1] - bl[1]) ** 2))
    widthB = np.sqrt(((tr[0] - tl[0]) ** 2) + ((tr[1] - tl[1]) ** 2))
    maxWidth = max(int(widthA), int(widthB))

    heightA = np.sqrt(((tr[0] - br[0]) ** 2) + ((tr[1] - br[1]) ** 2))
    heightB = np.sqrt(((tl[0] - bl[0]) ** 2) + ((tl[1] - bl[1]) ** 2))
    maxHeight = max(int(heightA), int(heightB))

    dst = np.array([
        [0, 0],
        [maxWidth - 1, 0],
        [maxWidth - 1, maxHeight - 1],
        [0, maxHeight - 1]
    ], dtype="float32")

    M = cv2.getPerspectiveTransform(rect, dst)
    warped = cv2.warpPerspective(image, M, (maxWidth, maxHeight))
    return warped

def order_points(pts):
    """Упорядочивает 4 точки."""
    rect = np.zeros((4, 2), dtype="float32")
    s = pts.sum(axis=1)
    rect[0] = pts[np.argmin(s)]
    rect[2] = pts[np.argmax(s)]

    diff = np.diff(pts, axis=1)
    rect[1] = pts[np.argmin(diff)]
    rect[3] = pts[np.argmax(diff)]
    return rect


# ========== ПРЕДОБРАБОТКА ========== #
def preprocess_image(image_path, debug=False):
    try:
        img = cv2.imread(image_path)
        if img is None:
            raise FileNotFoundError(f"Изображение {image_path} не найдено")

        # Сохраняем оригинал для отладки
        if debug: cv2.imwrite("0_original.jpg", img)

        # Конвертация в серый + шумоподавление
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        gray = cv2.medianBlur(gray, 3)
        if debug: cv2.imwrite("1_gray.jpg", gray)

        # Адаптивный контраст с уменьшенным clipLimit
        clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8, 8))
        enhanced = clahe.apply(gray)
        if debug: cv2.imwrite("2_clahe.jpg", enhanced)

        # Адаптивная бинаризация с меньшим размером блока
        binary = cv2.adaptiveThreshold(enhanced, 255,
                                       cv2.ADAPTIVE_THRESH_GAUSSIAN_C,
                                       cv2.THRESH_BINARY, 11, 2)
        if debug: cv2.imwrite("3_binary.jpg", binary)

        # Морфологическое закрытие для устранения разрывов
        kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (3, 3))
        closed = cv2.morphologyEx(binary, cv2.MORPH_CLOSE, kernel)
        if debug: cv2.imwrite("4_closed.jpg", closed)

        # Детекция границ с оптимизированными параметрами
        edged = cv2.Canny(closed, 30, 100)
        if debug: cv2.imwrite("5_edges.jpg", edged)

        # Поиск контуров с фильтрацией по площади
        contours, _ = cv2.findContours(edged, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        min_contour_area = img.shape[0] * img.shape[1] * 0.1  # 10% от площади изображения
        contours = [c for c in contours if cv2.contourArea(c) > min_contour_area]
        contours = sorted(contours, key=cv2.contourArea, reverse=True)[:5]

        # Поиск прямоугольного контура с улучшенными параметрами
        screenCnt = None
        for c in contours:
            peri = cv2.arcLength(c, True)
            approx = cv2.approxPolyDP(c, 0.02 * peri, True)
            if len(approx) == 4:
                screenCnt = approx
                break

        # Перспективная коррекция с проверкой координат
        if screenCnt is not None:
            # Проверка валидности координат
            pts = screenCnt.reshape(4, 2).astype('float32')
            if np.any(pts < 0) or np.any(pts > np.array([img.shape[1], img.shape[0]])):
                raise ValueError("Некорректные координаты контура")

            warped = four_point_transform(img, pts)
            if debug: cv2.imwrite("6_warped.jpg", warped)
        else:
            warped = img  # Fallback

        # Увеличение резкости с уменьшенным ядром
        sharpen_kernel = np.array([[0, -0.5, 0],
                                   [-0.5, 3, -0.5],
                                   [0, -0.5, 0]])
        sharpened = cv2.filter2D(warped, -1, sharpen_kernel)
        if debug: cv2.imwrite("7_final.jpg", sharpened)

        return sharpened

    except Exception as e:
        print(f"Ошибка предобработки: {e}")
        return cv2.imread(image_path)


# ========== OCR ========== #
def ocr_core(image):
    """Улучшенное распознавание с постобработкой"""
    results = []

    # Tesseract с кастомными настройками для чеков
    try:
        tess_config = r'--oem 3 --psm 6 -l rus+eng+digits'
        tess_text = pytesseract.image_to_string(
            image,
            config=tess_config,
            timeout=30  # Защита от зависаний
        )
        results.extend(tess_text.split('\n'))
    except Exception as e:
        print(f"Ошибка Tesseract: {e}")

    # Расширенная постобработка
    processed = []
    replacements = {
        'Ж': 'x', '%': 'x', 'Ё': 'Е',
        '..seeeereeesceeeee': '', '„ие еаненесьь': ''
    }

    for line in results:
        # Автозамена ошибок OCR
        for wrong, correct in replacements.items():
            line = line.replace(wrong, correct)

        # Фильтрация шумовых строк
        if re.match(r'^[\W_]+$', line):
            continue

        processed.append(line.strip())

    return '\n'.join(list(dict.fromkeys(processed)))  # Удаление дубликатов с сохранением порядка

# ========== ПОСТОБРАБОТКА ========== #
def clean_text(text):
    """Очистка текста от мусора"""
    cleaned = re.sub(r'[^\w\s.,%-₽рРуб$€]', '', text)
    cleaned = '\n'.join([line.strip() for line in cleaned.split('\n') if len(line.strip()) > 1])
    return cleaned


# ========== ГЛАВНАЯ ФУНКЦИЯ ========== #
def process_receipt(image_path, ocr_engine='easyocr'):
    try:
        # 1. Предобработка
        processed_img = preprocess_image(image_path)

        # 2. Сохранение для отладки (с потокобезопасным именем)
        output_path = f"processed_{threading.get_ident()}_{image_path}"
        cv2.imwrite(output_path, processed_img)

        # 3. OCR с обработкой ошибок
        raw_text = ocr_core(processed_img)

        # 4. Очистка текста
        cleaned_text = clean_text(raw_text)
        print(cleaned_text)
        return {
            'processed_image': output_path,
            'cleaned_text': cleaned_text,
        }

    except Exception as e:
        print(f"Ошибка обработки чека: {e}")
        return {
            'error': str(e),
            'processed_image': None,
            'cleaned_text': None,
        }

