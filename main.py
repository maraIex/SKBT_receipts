import subprocess
import sys
import os
from subprocess import DEVNULL

def run_detached_command(command, cwd=None, shell=False):
    """Запускает команду в отдельном отсоединённом процессе"""
    kwargs = {
        'cwd': cwd,
        'shell': shell,
        'stdin': DEVNULL,
        'stdout': DEVNULL,
        'stderr': DEVNULL,
    }

    # Параметры для отсоединения процесса (зависит от ОС)
    if sys.platform.startswith('win'):
        kwargs['creationflags'] = (
            subprocess.CREATE_NEW_PROCESS_GROUP |
            subprocess.DETACHED_PROCESS
        )
    else:
        kwargs['start_new_session'] = True

    return subprocess.Popen(command, **kwargs)

def main():
    base_dir = os.getcwd()
    
    # Запуск бэкенда
    backend_path = os.path.join(base_dir, 'backend')
    print(f"🚀 Запуск бэкенда ({backend_path})")
    run_detached_command([sys.executable, 'main.py'], cwd=backend_path)

    # Запуск npm start (основной сервера)
    print("⚡ Запуск сервера")
    run_detached_command(['npm', 'start'], cwd=base_dir, shell=True)

    # Запуск фронтенда с параметрами
    frontend_path = os.path.join(base_dir, 'frontend')
    print(f"🌐 Запуск фронтенда ({frontend_path})")
    run_detached_command(
        ['npm', 'run', 'dev', '--', '--host', '0.0.0.0'], 
        cwd=frontend_path, 
        shell=True
    )

    print("✅ Все компоненты успешно запущены!")

if __name__ == "__main__":
    main()