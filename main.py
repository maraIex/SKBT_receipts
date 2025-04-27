import subprocess
import sys
import os
import signal

processes = []

def run_detached_command(command, cwd=None, shell=False):
    kwargs = {
        'cwd': cwd,
        'shell': shell,
        'stdin': subprocess.DEVNULL,
        'stdout': None,  # Показываем вывод
        'stderr': None,  # Показываем ошибки
    }

    if sys.platform.startswith('win'):
        kwargs['creationflags'] = subprocess.CREATE_NEW_PROCESS_GROUP
    else:
        kwargs['start_new_session'] = True

    proc = subprocess.Popen(command, **kwargs)
    processes.append(proc)
    return proc

def shutdown():
    for p in processes:
        try:
            if sys.platform != "win32":
                os.killpg(os.getpgid(p.pid), signal.SIGTERM)
            else:
                p.terminate()
        except ProcessLookupError:
            continue

def main():
    base_dir = os.getcwd()
    
    # Запуск бэкенда
    backend_path = os.path.join(base_dir, 'backend')
    run_detached_command([sys.executable, 'main.py'], cwd=backend_path)

    # Запуск npm start
    run_detached_command(['uvicorn', 'index:app', '--reload'], cwd=base_dir, shell=True)

    # Запуск фронтенда
    frontend_path = os.path.join(base_dir, 'frontend')
    run_detached_command(
        ['npm', 'run', 'dev', '--', '--host', '0.0.0.0'], 
        cwd=frontend_path, 
        shell=True
    )

if __name__ == "__main__":
    try:
        main()
        input("Нажмите Enter для остановки всех процессов...\n")
    finally:
        shutdown()
