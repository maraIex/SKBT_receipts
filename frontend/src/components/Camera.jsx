/** @format */

import Webcam from "react-webcam"
import { useRef, useState } from "react"
import { Button, message } from "antd"

export default function Camera({ setShowCamera }) {
    const webcamRef = useRef(null)
    const [loading, setLoading] = useState(false)

    const capturePhoto = async () => {
        if (webcamRef.current) {
            try {
                setLoading(true)
                const photo = webcamRef.current.getScreenshot()

                console.log("Base64 data:", photo.substring(0, 50) + "...") // Логируем начало строки

                await sendPhotoToServer(photo)
                message.success("Фото успешно отправлено!")
            } catch (error) {
                console.error("Полная ошибка:", {
                    message: error.message,
                    stack: error.stack,
                    name: error.name,
                })
                message.error(`Ошибка: ${error.message}`)
            } finally {
                setLoading(false)
                setShowCamera(false)
            }
        }
    }

    const sendPhotoToServer = async (base64Data) => {
        try {
            // Конвертация в Blob
            const blob = await fetch(base64Data).then((res) => res.blob())

            // Формирование FormData
            const formData = new FormData()
            const filename = `photo-${Date.now()}.jpg`
            formData.append("image", blob, filename)

            // Отправка на сервер
            const response = await fetch("http://localhost:8000/upload-photo/", {
                method: "POST",
                body: formData,
            })

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.detail || "Ошибка сервера")
            }

            return await response.json()
        } catch (error) {
            throw new Error(`Ошибка отправки: ${error.message}`)
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
                style={{
                    width: "100%",
                    maxWidth: "100%",
                    height: "auto",
                    maxHeight: "90vh",
                    objectFit: "cover",
                }}
                videoConstraints={{
                    facingMode: "environment",
                }}
            />

            <div
                style={{
                    position: "absolute",
                    bottom: "5%",
                    display: "flex",
                    gap: "20px",
                }}>
                <Button
                    onClick={capturePhoto}
                    type="primary"
                    loading={loading}
                    disabled={loading}
                    size="large">
                    {loading ? "Отправка..." : "Сделать фото"}
                </Button>

                <Button onClick={() => setShowCamera(false)} size="large" disabled={loading}>
                    Отмена
                </Button>
            </div>
        </div>
    )
}
