import React from 'react'
import SideMenu from '../../components/sandbox/SideMenu'
import TopHeader from '../../components/sandbox/TopHeader'
import NProgress from 'nprogress'
import  'nprogress/nprogress.css'

import './NewsSandBox.css'
import { Layout} from 'antd';
import NewsRouter from '../../components/sandbox/NewsRouter';
import { useEffect } from 'react'
const {  Content } = Layout;

export default function NewsSandBox() {
  // 进度条
  NProgress.start();
  useEffect(()=>{
    NProgress.done();
  })
  return (
    <Layout 
        // style={{
        //   height:"700px"
        // }}
    >
      {/* NewsSandBox */}
      <SideMenu></SideMenu>
      <Layout className="site-layout" >
        <TopHeader></TopHeader>
        <Content
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
            backgroundColor:'white',
            flex:1,"overflow":"auto",        
          }}
        >
        <NewsRouter></NewsRouter>

        </Content>
      </Layout>
    </Layout>
  )
}
