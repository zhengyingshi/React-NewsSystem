import React,{useEffect, useState} from 'react'
import { Button, Table, Modal,notification} from 'antd'
import axios from 'axios';
import {
        EditOutlined,
        DeleteOutlined,
        ExclamationCircleFilled,
        UploadOutlined
      } from '@ant-design/icons';

export default function NewsDraft(props) {
  
  // 表格内容（动态）
  const [dataSource,setdataSource] = useState([]);
  
  // 获取登陆用户的级别和区域
  const {username} = JSON.parse(localStorage.getItem("token"))

  useEffect(()=>{
      axios.get(`/news?author=${username}&auditState=0&_expand=category`).then(res=>{
        setdataSource(res.data)
      })
      
   },[username]);

   // 表格标题（固定）
  // dataIndex表示将哪些内容放到该列中
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      render:(id)=>{
          return <b>{id}</b>
      }
    },
    {
      title: '新闻标题',
      dataIndex: 'title',
      render:(title,item)=>{
          return <a href={`#/news-manage/preview/${item.id}`}>{title}</a>
      }
    },
    {
      title: '作者',
      dataIndex: 'author',
    },
    {
      title: '分类信息',
      dataIndex: 'category',
      render:(category)=>{
          return category.title;
      }
    },
    {
      title: '操作',
      render:(item)=>{
        return <div>
                  <Button danger  shape="circle" icon={<DeleteOutlined />}
                          onClick={()=>showConfirm(item)}
                  />
                   <a>  </a>
                  <Button  shape="circle" icon={<EditOutlined/>} 
                            onClick={()=>{
                              props.history.push(`/news-manage/update/${item.id}`);
                            }}
                  />
                   <a>  </a>
                   <Button type="primary" shape="circle" icon={<UploadOutlined />}
                            onClick={()=>handleCheck(item.id)}
                   />
        </div>
    }
    },
  ];

  // 点击审核新闻
  const handleCheck = (id)=>{
     axios.patch(`/news/${id}`,{
        "auditState":1
     }).then(res=>{
          props.history.push('/audit-manage/list');
          // 右下角提醒框
            notification.info({
              message: `通知`,
              description:
                `您可以到审核列表中查看你的新闻`,
              placement:"bottomRight",
            })
          // };
      })
  }
  // 点击删除弹出确认弹窗
  const { confirm } = Modal;
  const showConfirm = (item)=>{
    confirm({
      title: '你确定要删除吗?',
      icon: <ExclamationCircleFilled />,
      // content: 'Some descriptions',
      onOk() {
        console.log('OK');
        deleteRight(item);
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  };

  // 点击确认后执行删除
  const deleteRight = (item)=>{
        // // 当前页面删除
        setdataSource(dataSource.filter(data=>data.id!==item.id))
        // 后端同步更新
        axios.delete(`/news/${item.id}`)
  }


  return (

    <div>
      {/* pagination分页器 */}
      <Table dataSource={dataSource} columns={columns} 
              pagination={{
                pageSize:5
              }}
              rowKey={item=>item.id}
              />
    </div>
  )
}
