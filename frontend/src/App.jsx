/** @format */
import { Layout, Card, Row, Col, Button, Statistic, List } from "antd"

const { Header, Content, Footer } = Layout;
    
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

    const totalSpending = 12500; // Общие траты за месяц
    const topCategories = [
    { name: "Продукты", amount: 6500 },
    { name: "Кафе", amount: 3200 },
    { name: "Транспорт", amount: 2800 },
    ];

    return (
        <>
            <Layout>
                <Layout.Header style={headerStyle}><h1>Анализ чеков</h1></Layout.Header>
                <Layout.Content style={contentStyle}>
                    <Row gutter={[16, 16]} style={{ marginBottom: '20px' }}>
                        <Col span={24}>
                            <Card title="Общая статистика">
                                <Row gutter={16}>
                                    <Col span={12}>
                                        <Statistic
                                        title="Траты за месяц"
                                        value={totalSpending}
                                        prefix="₽"
                                        />
                                    </Col>
                                    <Col span={12}>
                                        <Statistic
                                        title="Популярные категории"
                                        value={topCategories.length}
                                        prefix={<PieChartOutlined />}
                                    />
                                </Col>
                                </Row>
                            </Card>
                        </Col>
                    </Row>

                    {/* Топ-3 категории */}
                    <Row gutter={[16, 16]} style={{ marginBottom: '20px' }}>
                        <Col span={24}>
                            <Card title="Топ-3 категории">
                                <List
                                dataSource={topCategories}
                                renderItem={(item) => (
                                <List.Item>
                                    <List.Item.Meta
                                    avatar={<ShoppingCartOutlined />}
                                    title={item.name}
                                    description={`${item.amount} ₽`}
                                    />
                                </List.Item>
                                )}
                                />
                            </Card>
                        </Col>
                    </Row>

                    {/* Кнопка сканера */}
                    <Row>
                        <Col span={24} style={{ textAlign: 'center' }}>
                            <Button 
                            type="primary" 
                            size="large" 
                            icon={<ScanOutlined />}
                            onClick={() => console.log('Переход на сканер')}
                            >
                            Сканировать чек
                            </Button>
                        </Col>
                    </Row>
                </Layout.Content>
                <Layout.Footer style={footerStyle}>Receipt Analyzer ©2025</Layout.Footer>
            </Layout>
        </>
    )
}

export default App
