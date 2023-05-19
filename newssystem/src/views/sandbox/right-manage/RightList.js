import React,{useEffect, useState} from 'react'
import { Button, Table, Tag ,Modal,Popover, Switch} from 'antd'
import axios from 'axios';
import {
        EditOutlined,
        DeleteOutlined,
        ExclamationCircleFilled
      } from '@ant-design/icons';
export default function RightList() {
  
  // 表格内容（动态）
  const [dataSource,setdataSource] = useState([]);


  useEffect(()=>{
    axios.get("http://localhost:5000/rights?_embed=children").then(res=>{
      let  list = res.data;
      list.forEach(item=>{
        if(item.children.length===0){
          item.children="";
        }
      })
      setdataSource(list);
    })
  },[])

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
      title: '权限名称',
      dataIndex: 'title'
    },
    {
      title: '权限路径',
      dataIndex: 'key',
      render:(key)=>{
        return <Tag color="blue">{key}</Tag>
    }
    },
    {
      title: '操作',
      render:(item)=>{
        return <div>
          {/* poppver气泡对话框 */}
          <Popover  
            content={<div style={{textAlign:"center"}}>
                        <Switch checked={item.pagepermisson} onChange={()=>switchMethod(item)}></Switch>
                    </div>} 
            title="页面配置项" 
            trigger={item.pagepermisson===undefined?'':'click'}
            >
              <Button type="primary" shape="circle" icon={<EditOutlined/>} disabled={item.pagepermisson===undefined}/>
          </Popover>
          <a>  </a>
          <Button danger  shape="circle" icon={<DeleteOutlined />}
                  onClick={()=>showConfirm(item)}
                  />
        </div>
    }
    },
  ];


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
        console.log(item);
        if(item.grade===1){
            // 当前页面删除
            setdataSource(dataSource.filter(data=>data.id!==item.id))
            // 后端同步更新
            axios.delete(`http://localhost:5000/rights/${item.id}`)
        }else{
          // 当前页面删除
          let list = dataSource.filter(data=>data.id===item.rightId);
          // console.log(list);
          list[0].children = list[0].children.filter(data=>data.id!==item.id);
          // dataSource也会被改变（filter浅赋值）
          // console.log(dataSource);
          setdataSource([...dataSource]);
          // 后端同步更新
          axios.delete(`http://localhost:5000/children/${item.id}`)
        }

  }

  const switchMethod=(item)=>{
      item.pagepermisson = item.pagepermisson===1?0:1;
      // console.log(item);
      // 当前页面更新
      setdataSource([...dataSource]);
      // 后端同步更新
      if(item.grade===1){
        axios.patch(`http://localhost:5000/rights/${item.id}`,{pagepermisson:item.pagepermisson})
      }else{
        axios.patch(`http://localhost:5000/children/${item.id}`,{pagepermisson:item.pagepermisson})
      }
  }
  return (

    <div>
      {/* pagination分页器 */}
      <Table dataSource={dataSource} columns={columns} 
              pagination={{
                pageSize:5
              }}
              />
    </div>
  )
}
