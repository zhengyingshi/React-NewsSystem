import React from 'react'
import Home from '../../views/sandbox/home/Home'
import NoPermission from '../../views/sandbox/nopermission/NoPermission'
import RightList from '../../views/sandbox/right-manage/RightList'
import RoleList from '../../views/sandbox/right-manage/RoleList'
import UserList from '../../views/sandbox/user-manage/UserList'
import NewsAdd from './news-manage/NewsAdd'
import { Redirect, Route, Switch } from 'react-router-dom'
import NewsDraft from './news-manage/NewsDraft'
import NewsCategory from './news-manage/NewsCategory'
import Audit from './audit-manage/Audit'
import AuditList from './audit-manage/AuditList'
import Unpublished from './publish-manage/Unpublished'
import Published from './publish-manage/Published'
import Sunset from './publish-manage/Sunset'
import { useEffect } from 'react'
import axios from 'axios'
import { useState } from 'react'
import NewsPreview from './news-manage/NewsPreview'
import NewsUpdate from './news-manage/NewsUpdate'

const LocalRouterMap = {
    "/home":Home,
    "/user-manage/list":UserList,
    "/right-manage/role/list":RoleList,
    "/right-manage/right/list":RightList,
    "/news-manage/add":NewsAdd,
    "/news-manage/draft":NewsDraft,
    "/news-manage/category":NewsCategory,
    "/news-manage/preview/:id":NewsPreview,
    "/news-manage/update/:id":NewsUpdate,
    "/audit-manage/audit":Audit,
    "/audit-manage/list":AuditList,
    "/publish-manage/unpublished":Unpublished,
    "/publish-manage/published":Published,
    "/publish-manage/sunset":Sunset,
}
export default function NewsRouter() {

  const [BackRouteList,setBackRouteList] = useState([])
  useEffect(()=>{
    Promise.all([
        axios.get("http://localhost:5000/rights"),
        axios.get("http://localhost:5000/children")
      ]).then(res=>{
          // console.log(res)
          setBackRouteList([...res[0].data,...res[1].data]);
          // console.log([...res[0].data,...res[1].data]);
      })
  },[])

  // 获取登陆用户的级别和区域
  const {role:{rights}} = JSON.parse(localStorage.getItem("token"))

  // 检查该用户是否有该功能权限
  const checkRoute=(item)=>{
      return LocalRouterMap[item.key] && (item.pagepermisson||item.routepermisson) ;
  }

  const checkUserPermission = (item)=>{
      return rights.includes(item.key);
  }
  return (
    <div >
            <Switch>
              {
                BackRouteList.map(item=>{
                    if(checkRoute(item) && checkUserPermission(item)){
                      return <Route path={item.key}  key={item.key} component={LocalRouterMap[item.key]} exact />
                    }else{
                      return null;
                    }

                   }
                  )
              }

              <Redirect exact from="/" to="/home" />
              {
                BackRouteList.length>0 && <Route path="*" component={NoPermission}/>
              }
            </Switch> 
    </div>
  )
}
