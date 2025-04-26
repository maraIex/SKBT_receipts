/** @format */
import { Layout, Card, Row, Col, Button, Statistic, List } from "antd"
import { Body } from "./Body";
import { colors } from '../theme/colors';
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
      <Layout>
        <Header style={headerStyle}><h1>Анализ чеков</h1></Header>
        <Content style={contentStyle}>
          <Body
            totalSpending={totalSpending} 
            topCategories={topCategories} 
          />
        </Content>
        <Footer style={footerStyle}>Receipt Analyzer ©2025</Footer>
      </Layout>
    );
  }

export default App
