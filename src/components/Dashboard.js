import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Layout, Avatar, Typography, Spin, Button, notification, Select, Row, Col, DatePicker, List, Card } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import axios from 'axios';
import './Dashboard.css'; // Add your custom CSS
import { symbolGroups } from './symbols';

const { Meta } = Card;
const { Header, Content } = Layout;
const { Text } = Typography;
const { Option } = Select;

const Dashboard = () => {
  const [username, setUsername] = useState('');
  const [stocks, setStocks] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState('group1');
  const [timeframe, setTimeframe] = useState('15');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    axios.post(process.env.REACT_APP_BASE_URL + 'api/auth/profile')
      .then(response => {
        if (response.status === 200) {
          setUsername(response.data.name);
          notification.success({
            message: 'Success',
            description: 'Logged In',
            placement: 'topRight'
          });
        } else {
          navigate('/login');
        }
      })
      .catch(error => {
        console.error('Error fetching profile:', error);
        notification.error({
          message: 'Error',
          description: 'Failed to fetch profile information',
          placement: 'topRight'
        });
        navigate('/login');
      });
  }, []);

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleGroupChange = (value) => {
    setSelectedGroup(value);
  };

  const handleTimeframeChange = (value) => {
    setTimeframe(value);
  };

  const fetchStocks = async () => {
    try {
      if (!selectedDate) {
        return alert('Please select a date.');
      }
      setLoading(true);
      const date = selectedDate.format('YYYY-MM-DD');
      const symbols = symbolGroups[selectedGroup];

      const response = await axios.post(process.env.REACT_APP_BASE_URL + 'api/screener/sevenpercent', {
        date,
        symbols,
        timeframe
      });
      console.log(response.data);

      setStocks(response.data.stocks);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching stocks:', error);
      notification.error({
        message: 'Error',
        description: 'Failed to fetch stock symbols',
        placement: 'topRight'
      });
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      const response = await axios.post(process.env.REACT_APP_BASE_URL + 'api/auth/signout');
      if (response.status === 200) {
        notification.success({
          message: 'Success',
          description: 'Signed Out',
          placement: 'topRight'
        });
        navigate('/login');
      } else {
        throw new Error('Sign out failed');
      }
    } catch (error) {
      console.error('Error signing out:', error);
      notification.error({
        message: 'Error',
        description: 'Failed to sign out',
        placement: 'topRight'
      });
    }
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header className="header">
        <div className="logo">
          <Text className="app-name">FY Screener</Text>
        </div>
        <div className="profile-info">
          <Avatar size="large" icon={<UserOutlined />} />
          <div className="profile-details">
            <Text>{username}</Text>
            <Button type="link" onClick={handleSignOut} style={{ marginLeft: 16 }}>Sign Out</Button>
          </div>
        </div>
      </Header>
      {loading ? <Spin tip="Loading" size="large"></Spin> :
        <Layout>
          <Content style={{ padding: '0 24px', minHeight: 280 }}>
            <div className="dashboard-container">
              <div className="cards-container">
                {['Seven Percent'].map((_, index) => (
                  <Card
                    key={index}
                    style={{ width: 300, margin: '16px' }}
                    cover={<img alt="example" src={`https://via.placeholder.com/300?text=Card+${index + 1}`} />}
                  >
                    <Row gutter={16} justify="center">
                      <Col>
                        <DatePicker onChange={handleDateChange} />
                      </Col>
                      <Col>
                        <Select defaultValue="group1" style={{ width: 120 }} onChange={handleGroupChange}>
                          <Option value="group1">Group 1</Option>
                          <Option value="group2">Group 2</Option>
                          <Option value="group3">Group 3</Option>
                          <Option value="group4">Group 4</Option>
                        </Select>
                      </Col>
                      <Col>
                        <Select defaultValue="15" style={{ width: 120 }} onChange={handleTimeframeChange}>
                          <Option value="15">15 minutes</Option>
                          <Option value="5">5 minutes</Option>
                          <Option value="45">45 minutes</Option>
                        </Select>
                      </Col>
                    </Row>

                    <Meta title={`Screener ${_}`} description="" />
                    <Button type="primary" onClick={fetchStocks} style={{ marginTop: '16px' }}>
                      Get Stocks
                    </Button>
                  </Card>
                ))}
              </div>
              <div className="stocks-list">
                <h2>Stocks List:</h2>
                <List
                  bordered
                  dataSource={stocks}
                  renderItem={item => (
                    <List.Item>{item}</List.Item>
                  )}
                />
              </div>
            </div>
          </Content>
        </Layout>}
    </Layout>
  );
};

export default Dashboard;
