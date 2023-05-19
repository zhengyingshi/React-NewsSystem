import React,{useEffect, useState,useRef} from 'react'
import { Button, Table, Modal, Switch,Form,Input,Select} from 'antd'
import axios from 'axios';
import {
        EditOutlined,
        DeleteOutlined,
        ExclamationCircleFilled
      } from '@ant-design/icons';
import UserForm from '../../../components/user-manage/UserForm';



export default function UserList() {
  
  const addForm = useRef(null);
  const updateForm = useRef(null);
  const {Option} = Select;
  
  // 表格内容（动态）
  const [dataSource,setdataSource] = useState([]);
  // 是否弹出增加用户表单 
  const [isAddVisible,setisAddVisible] = useState(false);
  // 是否弹出修改用户表单 
  const [isUpdateVisible,setisUpdateVisible] = useState(false);
  //表单弹出角色选项下拉框内容
  const [roleList,setroleList] = useState([]); 
  //表单弹出区域选项下拉框内容
  const [regionList,setregionList] = useState([]); 
  // 设置不同级别管理员禁用区域选择
  const [isUpdateDisabled,setisUpdateDisabled] = useState(false);
  // 标记更新哪一个用户的信息
  const [current,setcurrent] = useState(null);

  // 获取登陆用户的级别和区域
  const {roleId,region,username} = JSON.parse(localStorage.getItem("token"))

  useEffect(()=>{
      // 设置一个用户角色表
      const roleObj = {
        "1":"superadmin",
        "2":"admin",
        "3":"editor"
      }
    axios.get("http://localhost:5000/users?_expand=role").then(res=>{
      let  list = res.data;
      setdataSource(roleObj[roleId]==="superadmin"?list:[
          ...list.filter(item=>item.username===username),
          ...list.filter(item=>item.region===region&&roleObj[item.roleId]==="editor")
      ]);
    })
  },[roleId,region,username])

  useEffect(()=>{
    axios.get("http://localhost:5000/regions").then(res=>{
      let  list = res.data;
      setregionList(list);
    })
  },[])

  useEffect(()=>{
    axios.get("http://localhost:5000/roles").then(res=>{
      let  list = res.data;
      setroleList(list);
    })
  },[])

  // 表格标题（固定）
  // dataIndex表示将哪些内容放到该列中
  const columns = [
    {
      title: '区域',
      dataIndex: 'region',
      filters: [
        ...regionList.map(item=>({
          text:item.title,
          value:item.value
        })),
        {
          text:"全球",
          value:""
        }
      ],
      onFilter: (value, item) => item.region===value,
      render:(region)=>{
          return <b>{region===""?'全球':region}</b>
      }

    },
    {
      title: '角色名称',
      dataIndex: 'role',
      render:(role)=>{
        return role?.roleName
    }
    },
    {
      title: '用户名',
      dataIndex: 'username',
    },
    {
      title: '用户状态',
      dataIndex: 'roleState',
      render:(roleState,item)=>{
        return <Switch checked={roleState} disabled={item.default}
                  onChange={()=>handleChange(item)}
                >
                </Switch>
    }
    },
    {
      title: '操作',
      render:(item)=>{
        return <div>
              <Button type="primary" shape="circle" icon={<EditOutlined/>} disabled={item.default}
                      onClick={()=>handleUpdate(item)}
              />
              <a>  </a>
              <Button danger  shape="circle" icon={<DeleteOutlined /> }
                      onClick={()=>showConfirm(item)}
                      disabled={item.default}
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
        // console.log(item);
        // 当前页面同步状态
        setdataSource(dataSource.filter(data=>data.id!==item.id));
        // 后端同步
        axios.delete(`http://localhost:5000/users/${item.id}`);

  }

  // 点击确认后操作
  const addFormOk=()=>{
    console.log("add",addForm);
    addForm.current.validateFields().then(value=>{
      // 重置表格
      addForm.current.resetFields();
      // console.log(value);
      // 先post到后端再设置dataSource，方便后面删除和更新处理
      axios.post("http://localhost:5000/users",{
        ...value,
        "roleState": true,
        "default": false,
      }).then(res=>{
        // console.log(res.data,dataSource)
        setdataSource([...dataSource,
            {
              ...res.data,
              role:roleList.filter(item=>item.id===value.roleId)[0]
            }])
        // axios.get("http://localhost:5000/users?_expand=role").then(res=>{
        // setdataSource(res.data);
        // console.log(res.data)
        // })
      })
      console.log(dataSource)
      setisAddVisible(false);
    }).catch(err=>{
      console.log(err)
    })
  }

  // 用户状态开关
  const handleChange=(item)=>{
      console.log(item);
      item.roleState = !item.roleState;
      // 当前页面修改
      setdataSource([...dataSource]);
      // 后端同步
      axios.patch(`http://localhost:5000/users/${item.id}`,
          {
            roleState:item.roleState
          })

  }

  // 点击编辑更新用户信息
  const handleUpdate=(item)=>{
    // console.log(item);
    setTimeout(()=>{   
      // 超级管理员禁用区域选择 
      if(item.roleId===1){
          setisUpdateDisabled(true);
      }else{
         setisUpdateDisabled(false);
      }
      updateForm.current.setFieldsValue(item);
    },0)
    setisUpdateVisible(true);
    setcurrent(item);
  }

  // 确认更新用户信息
  const updateFormOk=()=>{
    setisUpdateVisible(false);
    updateForm.current.validateFields().then(value=>{
        console.log(value);
        setisUpdateVisible(false);
        // 本地页面更新
        setdataSource(dataSource.map(item=>{
          if(item.id===current.id){
            return {
              ...item,
              ...value,
              role:roleList.filter(data=>data.id===value.roleId)[0]
            }
          }
          return item
        }))
        setisUpdateDisabled(!isUpdateDisabled);
        // 后端同步
        axios.patch(`http://localhost:5000/users/${current.id}`,
                    value
                    )
    }).catch(err=>{
      console.log(err)
    })
  }


  return (

    <div>
        <Button type='primary' onClick={()=>{
          setisAddVisible(true)
        }}>
          添加用户
        </Button>
      {/* pagination分页器 */}
      <Table dataSource={dataSource} columns={columns} 
              pagination={{
                pageSize:5
              }}
              rowKey={item=>item.id}
              />
      {/* 弹出增加用户表单 */}
      <Modal
          open={isAddVisible}
          title="添加用户"
          okText="确定"
          cancelText="取消"
          onCancel={()=>{
              setisAddVisible(false);
          }}
          onOk={() => addFormOk()}
        >
          <UserForm regionList={regionList} roleList={roleList} ref={addForm}></UserForm>
      </Modal>
      {/* 弹出修改用户表单 */}
      <Modal
          open={isUpdateVisible}
          title="更新用户"
          okText="更新"
          cancelText="取消"
          onCancel={()=>{
              setisUpdateVisible(false);
              setisUpdateDisabled(!isUpdateDisabled);
          }}
          onOk={() => updateFormOk()}
        >
          <UserForm regionList={regionList} roleList={roleList} ref={updateForm} isUpdateDisabled={isUpdateDisabled} isUpdate={true}></UserForm>
      </Modal>
    </div>
  )
}
