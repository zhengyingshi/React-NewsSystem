import { Table,Button,Modal,Tree } from 'antd'
import axios from 'axios';
import React ,{useEffect, useState} from 'react'
import {
  EditOutlined,
  DeleteOutlined,
  ExclamationCircleFilled
} from '@ant-design/icons';

export default function RoleList() {

  // 弹窗显示
  const [isModalVisible,setisModalVisible] = useState(false);
  // 弹窗内容
  const [rightList,setRightList] = useState([]);
  // 当前权限
  const [currentRights,setcurrentRights] = useState([]);
  // 当前选择编辑哪一个
  const [currentId,setcurrentId] = useState(0);
  // 表格内容（动态）
  const [dataSource,setdataSource] = useState([]);
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
      title: '角色名称',
      dataIndex: 'roleName',
    },
    {
      title: '操作',
      render:(item)=>{
        return <div>
          <Button type="primary" shape="circle" icon={<EditOutlined/>}  
            onClick={()=>{
              setisModalVisible(true);
              setcurrentRights(item.rights);
              setcurrentId(item.id)
                    }}
              />
          <a>  </a>
          <Button danger  shape="circle" icon={<DeleteOutlined />} 
            onClick={()=>{showConfirm(item)}}/>
        </div>
    }
    },
  ];

  useEffect(()=>{
        axios.get("http://localhost:5000/roles").then(res=>{
          console.log(res.data);
          setdataSource(res.data);
        })
        
     },[])

  useEffect(()=>{
      axios.get("http://localhost:5000/rights?_embed=children").then(res=>{
        setRightList(res.data)
      })
      
   },[])

    // 点击删除弹出确认弹窗
    const { confirm } = Modal;
    const showConfirm = (item)=>{
      confirm({
        title: '你确定要删除吗?',
        icon: <ExclamationCircleFilled />,
        // content: 'Some descriptions',
        onOk() {
          console.log('OK');
          deleteRole(item);
        },
        onCancel() {
          console.log('Cancel');
        },
      });
    };

    // 点击确认后执行删除
    const deleteRole = (item)=>{
          // 当前页面删除
          setdataSource(dataSource.filter(data=>data.id!==item.id))
          // 后端同步更新
          axios.delete(`http://localhost:5000/roles/${item.id}`)

}
  const handleOk=()=>{
    console.log(currentRights);
    // 同步dataSource
    setdataSource(dataSource.map(item=>{
      if(item.id===currentId){
        return{ 
          ...item,
          rights:currentRights
        }
      }
      return item;
    }))
    // 后端同步更新
    axios.patch(`http://localhost:5000/roles/${currentId}`,{rights:currentRights});
    setisModalVisible(false);
  }

  const handleCancel=()=>{
    setisModalVisible(false);
  }
  const onCheck = (checkedKeys) => {
    // console.log('onCheck', checkedKeys);
    setcurrentRights(checkedKeys.checked);
  };
  return (
    <div>
      {/* rowkey将id当成table的key值 */}
      <Table dataSource={dataSource} columns={columns} rowKey={(item)=>item.id}>

      </Table>
      <Modal title="权限分配" open={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
          <Tree
          checkable
          checkedKeys={currentRights}
          onCheck={onCheck}
          checkStrictly={true}
          treeData={rightList}
        />
      </Modal>
    </div>
  )
}
