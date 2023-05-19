import { Button, notification, Table } from 'antd';
import axios from 'axios'
import React, { useEffect, useState } from 'react'

export default function Audit() {

  // 表格内容（动态）
  const [dataSource,setdataSource] = useState([]);
  // 获取登陆用户的级别和区域
  const {roleId,region,username} = JSON.parse(localStorage.getItem("token"))

  useEffect(()=>{
    // 设置一个用户角色表
    const roleObj = {
      "1":"superadmin",
      "2":"admin",
      "3":"editor"
    };
    axios.get(`/news?auditState=1&_expand=category`).then(res=>{
      let  list = res.data;
      setdataSource(roleObj[roleId]==="superadmin"?list:[
          ...list.filter(item=>item.author===username),
          ...list.filter(item=>item.region===region&&roleObj[item.roleId]==="editor")
      ]);
    })
  },[roleId,region,username])

  const columns = [
      {
        title: '新闻标题',
        dataIndex: 'title',
        render:(title,item)=>{
            return <a href={`#/news-manage/preview/${item.id}`}>{title}</a>
        }
      },
      {
        title: '作者',
        dataIndex: 'author'
      },
      {
        title: '新闻分类',
        dataIndex: 'category',
        render:(category)=>{
          return <div >{category.title}</div>
        }
      },
      {
        title: '操作',
        render:(item)=>{
          return <div>
                     <Button type="primary" onClick={()=>handleAudit(item,2,1)} >通过</Button>
                     <a> </a>
                     <Button danger onClick={()=>handleAudit(item,3,0)} >驳回</Button>
                  </div>
      }
      },
    ];

    // 通过按钮函数
    const handleAudit=(item,auditState,publishState)=>{
        setdataSource(dataSource.filter(data=>{ return data.id!==item.id}));
        axios.patch(`/news/${item.id}`,{
              auditState,
              publishState,
        }).then(res=>{
          notification.info({
            message: `通知`,
            description:
              `审核成功！`,
            placement:"bottomRight",
          })
        })
    };

  return (
    <div>
        <Table dataSource={dataSource} columns={columns} 
              pagination={{
                pageSize:5
              }}
              rowKey={item=>item.id}
        />      
    </div>
  )
}
