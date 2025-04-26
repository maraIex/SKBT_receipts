/** @format */
import Webcam from "react-webcam"
import { useRef } from "react"
import { Button } from "antd"

export default function Camera({ setShowCamera }) {
    const webcamRef = useRef(null)

    const capturePhoto = () => {
        if (webcamRef.current) {
            const photo = webcamRef.current.getScreenshot()
            console.log(photo) // base64-строка
            setShowCamera(false) // Закрываем камеру после съёмки
        }
    }
    return (
        <>
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
        </>
    )
}
