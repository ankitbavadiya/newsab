import React, { Suspense } from 'react';
import 'antd/dist/antd.css';
import './Layout.css';
import { Layout, Menu } from 'antd';
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  StockOutlined,
} from '@ant-design/icons';
import { fetchSources } from '../api';

const NewsSection = React.lazy(() => import('./NewsSection'));
const News = React.lazy(() => import('./News'));

const { Header, Sider, Content } = Layout;

class MainLayout extends React.Component {
  state = {
    collapsed: false,
    sources: [],
    homePage: true,
    query: '',
  };

  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  };

  async componentDidMount() {
    const sources = await fetchSources();

    this.setState({ sources });
  }

  loadNews(query) {
    this.setState({
      homePage: false,
      query: query
    });
  }

  
  render() {
    function setTheme() {
      var sta = document.getElementById('themeBox').checked;
     if(sta==true){
         document.documentElement.style.setProperty('--clr-bg','#33135c');
         document.documentElement.style.setProperty('--clr-light','#1f1f1f');
         document.documentElement.style.setProperty('--clr-light1','#030303');
         document.documentElement.style.setProperty('--clr-details','#fbfbfb');
         document.documentElement.style.setProperty('--clr-heading','#c3c3c3');
     }
     else{
         document.documentElement.style.setProperty('--clr-bg','#f9f9f9');
         document.documentElement.style.setProperty('--clr-light','#c3c3c3');
         document.documentElement.style.setProperty('--clr-details','#6b6b6b');
         document.documentElement.style.setProperty('--clr-light1','#838383'); 
         document.documentElement.style.setProperty('--clr-heading','#030303');
     }
  }

    return (
      <Layout>
        
        <Sider className="sidebarclr" trigger={null} collapsible collapsed={!this.state.collapsed}>
          <div className="logo"><h2>{!this.state.collapsed ? 'AB' : 'NewsAB'}</h2></div>
          <div className="themeBtn">
                <input type="checkbox" id="themeBox" className="tBox" onChange={setTheme} />
                <label for="themeBox">
                    <i className="fas fa-sun"></i>
                    <i className="fas fa-moon"></i>
                </label>
          </div>
          <Menu className="menuclr" mode="inline" defaultSelectedKeys={['-1']}>
            <Menu.Item onClick={() => this.setState({ homePage: true })} key="-1" icon={<StockOutlined />}>
              Top News
            </Menu.Item>
            {this.state.sources.map((source) =>
              <Menu.Item onClick={() => this.loadNews(source.name)} key={source.name}>
                {source.name}
              </Menu.Item>
            )}
          </Menu>
        </Sider>
        <Layout className="site-layout">
          <Header className="site-layout-background" style={{ padding: 0 }}>
            {React.createElement(!this.state.collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
              className: 'trigger',
              onClick: this.toggle,
            })}
            
          </Header>
          <Content
            className="site-layout-background"
            style={{
              margin: '24px 16px',
              padding: 24,
              paddingRight: 0,
              minHeight: 280,
            }}
          >
            <Suspense fallback={<h1 style={{ fontSize: '30px' }}>Loading...</h1>}>
              {this.state.homePage === true ? <News /> : <NewsSection category='everything' query={'q=' + this.state.query} topHeading={this.state.query} results='100' />}
            </Suspense>
          </Content>
        </Layout>
      </Layout>
    );
  }
}

export default MainLayout;