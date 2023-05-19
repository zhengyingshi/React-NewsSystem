import React, { forwardRef ,useEffect,useState} from 'react'
import {Form,Input,Select} from 'antd'

const {Option} = Select;

 const  UserForm= forwardRef((props,ref)=> {

    // 选择角色后禁用部分区域选择
    const [isDisabled,setisDisabled] = useState(false);

    // 获取登陆用户的级别和区域
    const {roleId,region} = JSON.parse(localStorage.getItem("token"))
    // 设置一个用户角色表
    const roleObj = {
        "1":"superadmin",
        "2":"admin",
        "3":"editor"
      }
    
    // 根据登录用户级别限制表单选择区域功能
    const checkRegionDisabled = (item)=>{
        if(props.isUpdate){
                if(roleObj[roleId]==="superadmin"){
                    return false;
                }else{
                    return true;
                }
        }else{
            if(roleObj[roleId]==="superadmin"){
                return false;
            }else{
                return item.value!==region;
            }
        }
    }
    // 根据登录用户级别限制表单选择角色功能
    const checkRoleDisabled = (item)=>{
        if(props.isUpdate){
                if(roleObj[roleId]==="superadmin"){
                    return false;
                }else{
                    return true;
                }
        }else{
            if(roleObj[roleId]==="superadmin"){
                return false;
            }else{
                return roleObj[item.id]!=="editor";
            }
        }
    }

    useEffect(()=>{
        setisDisabled(props.isUpdateDisabled)
    },[props.isUpdateDisabled])


  return (
        // layout="vertical" 垂直布局 
        <Form 
             layout="vertical"
            ref={ref}     
        >
            <Form.Item
                name="username"
                label="用户名"
                rules={[{ required: true, message: 'Please input the title of collection!' }]}
            >
                 <Input />
             </Form.Item>
            <Form.Item
                name="password"
                label="密码"
                rules={[{ required: true, message: 'Please input the title of collection!' }]}
            >
                <Input />
            </Form.Item>
            <Form.Item
                name="region"
                label="区域"
                rules={isDisabled?[]:[{ required: true, message: 'Please input the title of collection!' }]}
            >
                <Select disabled={isDisabled}>
                    {
                        props.regionList.map(item=><Option value={item.value} key={item.id} disabled={checkRegionDisabled(item)}>{item.value}</Option>)
                    }
                </Select>
            </Form.Item>
            <Form.Item
                name="roleId"
                label="角色"
                rules={[{ required: true, message: 'Please input the title of collection!' }]}
            >
                <Select 
                    onChange={(value)=>{
                        // console.log(value);
                        if(value===1){
                            setisDisabled(true)
                            ref.current.setFieldsValue({
                                region:""
                            })
                        }else{
                            setisDisabled(false)
                        }
                    }}
                >
                    {
                        props.roleList.map(item=><Option value={item.id} key={item.id} disabled={checkRoleDisabled(item)}>{item.roleName}</Option>)
                    }
                </Select>
            </Form.Item>
    </Form>
  )
})
export default UserForm;
