import os
import time
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler
from toJSON import textScaner

# Настройки
FOLDER_TO_WATCH = "/path/to/your/folder"  # Укажите свою папку для отслеживания
FILE_EXTENSION = ".jpg"  # Фильтр по расширению (None для всех файлов)


class NewFileHandler(FileSystemEventHandler):
    def on_created(self, event):
        if not event.is_directory:
            if FILE_EXTENSION is None or event.src_path.endswith(FILE_EXTENSION):
                textScaner(event.src_path)


def start_monitoring():
    # Проверяем существование папки
    if not os.path.exists(FOLDER_TO_WATCH):
        os.makedirs(FOLDER_TO_WATCH)
        print(f"Создана папка: {FOLDER_TO_WATCH}")

    # Настраиваем наблюдатель
    event_handler = NewFileHandler()
    observer = Observer()
    observer.schedule(event_handler, FOLDER_TO_WATCH, recursive=False)

    # Запускаем наблюдение
    observer.start()
    print(f"Начинаем наблюдение за папкой: {FOLDER_TO_WATCH}")

    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        observer.stop()
    observer.join()


if __name__ == "__main__":
    start_monitoring()
