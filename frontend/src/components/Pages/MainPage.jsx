/** @format */
import { Body } from "../Body"

const contentStyle = {
    textAlign: "center",
    minHeight: "calc(100vh - 60px)",
    color: "#fff",
    padding: "20px",
    backgroundColor: "#0958d9",
}


export default function MainPage({ onNavigate, showCamera, setShowCamera }) {
    return (
        <div style={contentStyle}>
            <Body 
                onShowHistory={() => onNavigate("history")}
                onShowStatistics={() => onNavigate("statistic")}
                showCamera={showCamera}
                setShowCamera={setShowCamera}
            />
        </div>
    )
}
