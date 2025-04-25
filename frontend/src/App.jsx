/** @format */
import { Layout } from "antd"
import AppHeader from "./components/AppHeader"

const items = Array.from({ length: 3 }).map((_, index) => ({
    key: String(index + 1),
    label: `nav ${index + 1}`,
}))

function App() {
    return (
        <>
            <Layout>
                <AppHeader />
                <Layout.Content>
                    <div
                        style={{
                            padding: 24,
                            minHeight: 380,
                        }}>
                        Content
                    </div>
                </Layout.Content>

                <Layout.Footer style={{ textAlign: "center" }}>
                    Ant Design ©{new Date().getFullYear()} Created by Ant UED
                </Layout.Footer>
            </Layout>
        </>
    )
}

export default App
