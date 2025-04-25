/** @format */
import { Layout } from "antd"

const headerStyle = {
    textAlign: "center",
    color: "#fff",
    height: 60,
    paddingInline: 48,
    lineHeight: "64px",
    backgroundColor: "#4096ff",
}
const contentStyle = {
    textAlign: "center",
    minHeight: "calc(100vh - 120px)",
    color: "#fff",
    backgroundColor: "#0958d9",
}
const footerStyle = {
    height: 60,
    textAlign: "center",
    color: "#fff",
    backgroundColor: "#4096ff",
}

function App() {
    return (
        <>
            <Layout>
                <Layout.Header style={headerStyle}>Header</Layout.Header>
                <Layout.Content style={contentStyle}>Content</Layout.Content>
                <Layout.Footer style={footerStyle}>Footer</Layout.Footer>
            </Layout>
        </>
    )
}

export default App
