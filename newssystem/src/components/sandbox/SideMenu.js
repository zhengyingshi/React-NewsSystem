//引入css
import './index.css'
import {
  MailOutlined,
  SettingOutlined,
  AppstoreOutlined,
  AimOutlined,
  BuildOutlined,
  CalendarOutlined
} from '@ant-design/icons';
import { Layout, Menu} from 'antd';
import React,{useEffect, useState} from 'react';
import { useHistory,withRouter } from 'react-router-dom';
import axios from 'axios';
import { CollapsedReducer } from '../../redux/reducers/CollapsedReducer';
import { connect } from 'react-redux';

const { Sider} = Layout;



// 侧边栏getItem函数
function getItem(label, key, icon, children, type) {
  return {
    key,
    icon,
    children,
    label,
    type,
  };
}
// // 侧边栏嵌套数据内容
// const menuList = [
//   //为了设置不一样的key值，取名为home1
//   getItem('首页', '/home1', <MailOutlined />, [
//     getItem('首页', '/home'),
//   ]),
//   getItem('用户管理', '/user-manage', <AppstoreOutlined />, [
//     getItem('用户列表', '/user-manage/list'),
//   ]),
//   {
//     type: 'divider',
//   },
//   getItem('权限管理', '/right-manage', <SettingOutlined />, [
//     getItem('权限列表', '/right-manage/right/list'),
//     getItem('角色列表', '/right-manage/role/list'),
//   ]),
//   // getItem('Group', 'grp', null, [getItem('Option 13', '13'), getItem('Option 14', '14')], 'group'),
// ];

const iconList ={
  "/home":<MailOutlined />,
  "/user-manage":<AppstoreOutlined />,
  "/right-manage":<SettingOutlined />,
  "/news-manage":<AimOutlined />,
  "/audit-manage":<BuildOutlined />,
  "/publish-manage":<CalendarOutlined />,

}


 function SideMenu (props) {

  // 取jsonserver上的数据
  const [menu,setmenu] = useState([ ]);
  useEffect(()=>{
    axios.get("http://localhost:5000/rights?_embed=children").then(res=>{
      console.log(res.data);
      getData(res.data);
    })
  },[])

  //修改数据格式为getItem格式并且赋值给menu
  function getData(menuL){
    // console.log(menuL);
    setmenu(menuL.map((item)=>{
      // console.log(pagepermisson);
      if(checkPagePermission(item))  
      {
        if(item.key==="/home"){
          let newChildren = [getItem("返回首页", "/")]
          console.log(getItem("返回首页", "/"))
          return getItem(item.title,item.key,iconList[item.key],newChildren)
        }else{
          let newChildren = item.children.map(item=>{
          if(checkPagePermission(item)){
            return getItem(item.title,item.key)
          }
          })
          return getItem(item.title,item.key,iconList[item.key],newChildren)}
        }
    }));
  }
  // console.log(menu)

  // 获取登陆的用户信息
  const {role:{rights}} = JSON.parse(localStorage.getItem("token"));

  // 检查是否有权限显示左侧栏该功能
  function checkPagePermission (item){
      return (item.pagepermisson==1)&&rights.includes(item.key);
  }
  
  // 使用了usehistory来进行跳转，新版应该用useNavigate
  const history = useHistory();
  const onClick = (e) => {
    console.log(e.key);
    history.push(e.key)
  };

  // console.log(props.location.pathname);
  // 刷新之后仍然显示高亮以及展开二级菜单
  const selectKeys = [props.location.pathname];
  const openKeys = ["/"+(props.location.pathname).split("/")[1]]
  return (
    // collapsible 可折叠的 sider 侧边栏板块
    <Sider  collapsible  >
        {/* 设置行内样式使得侧栏overflow的时候有单独的滚动条出现 */}
        <div style={{display:"flex",height:"100vh","flexDirection":"column"}}> 
          <div className="logo">全球新闻发布管理系统</div>
          {/* theme主题 mode对齐方式 defaultSelectedKeys高亮显示：设置哪个元素高亮(改成selectKeys是受控组件)  defaultOpenKeys展开显示：设置那个元素展开 */}     
          <div style={{flex:1,"overflow":"auto"}}>
            <Menu
              theme="dark"
              onClick={onClick}
              selectedKeys={selectKeys}
              defaultOpenKeys={openKeys}
              mode="inline"
              items={menu}
            />
          </div>
        </div>
      </Sider>
  )
}

export default withRouter(SideMenu); 


// const mapStateToProps = ({ CollapsedReducer: { isCollapsed } }) => ({
//   isCollapsed
// })
// // 将state中的状态映射成一个属性，传给组件
// export default connect(mapStateToProps)(withRouter(SideMenu))
