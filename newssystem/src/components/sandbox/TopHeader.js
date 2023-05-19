//import './TopHeader.css'
import React, { useState } from 'react'

import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SmileOutlined ,
  UserOutlined
} from '@ant-design/icons';
import { Layout ,Dropdown,Space,Avatar} from 'antd';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

const { Header } = Layout;

function TopHeader(props) {
  console.log(props);
  const [collapsed,setCollapsed] = useState(false);
  const changeCollapsed=()=>{
    setCollapsed(!collapsed);
  }

  // 获取登陆的用户信息
  const {role:{roleName},username} = JSON.parse(localStorage.getItem("token"));

  //items对应下拉菜单里面的选项内容
  const items = [
    {
      key: '1',
      label: (
        <a>
          {roleName}
        </a>
      ),
    },
    {
      key: '4',
      danger: true,
      label: 
        <a onClick={()=>{
          localStorage.removeItem("token");
          props.history.replace("/login")
        }}>
          退出 
        </a>,
    },
  ];

  return (
      <Header
      style={{
        padding: 0,
      }}
    >
        {/* {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
          className: 'trigger',
          onClick: () => setCollapsed(!collapsed),
        })} */}
        {collapsed ? < MenuUnfoldOutlined className= 'trigger' onClick={changeCollapsed}/> 
        :< MenuFoldOutlined className= 'trigger' onClick={changeCollapsed}/>}
        {/* 右上角用户管理标志div */}
        <div style={{float:"right", paddingRight:20 }}>  
          <span style={{color:"white", paddingRight:5}}>欢迎<span style={{color:"#1890ff"}}>{username}</span>回来</span>
          {/* 下拉菜单Dropdown */}
          <Dropdown
              menu={{
                items,
              }}
            >
              <a onClick={(e) => e.preventDefault()}>
                <Space>
                  {/* 头像图标 Avata UserOutlined*/}
                  <Avatar size="large" icon={<UserOutlined />} />
                </Space>
              </a>
            </Dropdown>
        </div>
      </Header>

  )
}

const mapStateToProps = ()=>{
  return {
    a:1

  }
}

// export default connect(mapStateToProps)(withRouter (TopHeader));
export default withRouter (TopHeader);


// // 将state中的状态映射成一个属性，传给组件
// const mapStateToProps = ({ CollapsedReducer: { isCollapsed } }) => {
//   return {
//       isCollapsed
//   }
// }
// // 将state中的方法映射成一个属性，传给组件
// const mapDispatchToProps = {
//   changeCollapsed() {
//       return {
//           type: "change_collapsed"
//           // payload:
//       }//action 
//   }
// }
// // connect用法，connect()执行一次，返回一个高阶函数，再执行这个高阶函数,connect可以拿到store中的state和方法
// // 将数据和处理数据的方法提交至高阶组件connect中
// export default connect(mapStateToProps, mapDispatchToProps)(withRouter(TopHeader))