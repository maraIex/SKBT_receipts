/** @format */
import Webcam from "react-webcam"
import { useRef } from "react"
import { Button, message } from "antd"

export default function Camera({ setShowCamera }) {
    const webcamRef = useRef(null)

    const saveToLocalStorage = (base64Data) => {
        const photos = JSON.parse(localStorage.getItem("photos") || "[]")
        photos.push(base64Data)
        localStorage.setItem("photos", JSON.stringify(photos))
    }

    const capturePhoto = () => {
        if (webcamRef.current) {
            const photo = webcamRef.current.getScreenshot()

            // Сохраняем фото в localStorage
            // sendPhotoToServer(photo)
            saveToLocalStorage(photo)

            // Создаем и скачиваем файл
            downloadPhoto(photo)
            setShowCamera(false)
        }
    }

    const sendPhotoToServer = async (base64Data) => {
        try {
            // Удаляем префикс "data:image/jpeg;base64,"
            const base64WithoutPrefix = base64Data.split(',')[1];
            
            // Конвертируем Base64 в Blob
            const blob = await fetch(`data:image/jpeg;base64,${base64WithoutPrefix}`)
                .then(res => res.blob());
            
            // Создаем FormData и добавляем файл
            const formData = new FormData();
            const filename = `photo-${new Date().toISOString()}.jpg`;
            formData.append('image', blob, filename);
    
            // Отправляем на сервер
            const response = await fetch('https://your-api-endpoint/upload', {
                method: 'POST',
                body: formData,
                // Не указываем Content-Type, браузер сам добавит multipart/form-data
            });
    
            if (!response.ok) throw new Error('Ошибка при отправке фото');
            const result = await response.json();
            message.success('Фото успешно отправлено!');
            return result;
        } catch (error) {
            console.error('Ошибка:', error);
            message.error('Не удалось отправить фото');
        }
    };
    
    // В capturePhoto (так же, как в Варианте 1)

    // Временно
    const downloadPhoto = (base64Data) => {
        try {
            // Создаем временную ссылку
            const link = document.createElement("a")
            link.href = base64Data

            // Генерируем имя файла с текущей датой
            const timestamp = new Date().toISOString().replace(/[:.]/g, "-")
            link.download = `photo-${timestamp}.jpg`

            // Имитируем клик для скачивания
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)

            message.success("Фото сохранено!")
        } catch (error) {
            console.error("Ошибка при сохранении фото:", error)
            message.error("Не удалось сохранить фото")
        }
    }

    return (
        <div
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: "rgba(0,0,0,0.9)",
                zIndex: 1000,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
            }}>
            <Webcam
                ref={webcamRef}
                audio={false}
                screenshotFormat="image/jpeg"
                style={{ maxWidth: "100%" }}
                videoConstraints={{
                    facingMode: "environment" // Использует заднюю камеру
                  }}
            />
            <div style={{ marginTop: 20 }}>
                <Button onClick={capturePhoto} type="primary">
                    Сделать фото
                </Button>
                <Button onClick={() => setShowCamera(false)} style={{ marginLeft: 10 }}>
                    Отмена
                </Button>
            </div>
        </div>
    )
}
