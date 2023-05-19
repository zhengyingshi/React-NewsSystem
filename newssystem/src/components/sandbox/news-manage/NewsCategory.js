import React,{ useContext, useEffect, useRef, useState} from 'react'
import { Button, Table,Modal,Form,Input} from 'antd'
import axios from 'axios';
import {
        DeleteOutlined,
        ExclamationCircleFilled
      } from '@ant-design/icons';
export default function NewsCategory() {
  
  // 表格内容（动态）
  const [dataSource,setdataSource] = useState([]);


  useEffect(()=>{
    axios.get(`/categories`).then(res=>{
      setdataSource(res.data);
    })
  },[])


  // 可编辑单元格保存函数
  const handleSave=(record)=>{
        console.log(record);
        setdataSource(dataSource.map(item=>{
          if(item.id===record.id){
              return {
                  id:item.id,
                  title:record.title,
                  value:record.title
              }
          };
          return item;
        }));

        axios.patch(`/categories/${record.id}`,{
          title:record.title,
          value:record.title,
        })

  };

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
      title: '栏目名称',
      dataIndex: 'title',
      onCell: (record) => ({
        record,
        editable: true,
        dataIndex: 'title',
        title: '栏目名称',
        handleSave:handleSave,
      }),
    },
    {
      title: '操作',
      render:(item)=>{
        return <div>
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
            // 当前页面删除
            setdataSource(dataSource.filter(data=>data.id!==item.id))
            // 后端同步更新
            axios.delete(`/categories/${item.id}`)


  }

  const EditableContext = React.createContext(null);
  // 可编辑列
  const EditableRow = ({ index, ...props }) => {
      const [form] = Form.useForm();
      return (
        <Form form={form} component={false}>
          <EditableContext.Provider value={form}>
            <tr {...props} />
          </EditableContext.Provider>
        </Form>
      );
    };

    // 可编辑行
    const EditableCell = ({
      title,
      editable,
      children,
      dataIndex,
      record,
      handleSave,
      ...restProps
    }) => {
      const [editing, setEditing] = useState(false);
      const inputRef = useRef(null);
      const form = useContext(EditableContext);
      useEffect(() => {
        if (editing) {
          inputRef.current.focus();
        }
      }, [editing]);
      const toggleEdit = () => {
        setEditing(!editing);
        form.setFieldsValue({
          [dataIndex]: record[dataIndex],
        });
      };
      const save = async () => {
        try {
          const values = await form.validateFields();
          toggleEdit();
          handleSave({
            ...record,
            ...values,
          });
        } catch (errInfo) {
          console.log('Save failed:', errInfo);
        }
      };
      let childNode = children;
      if (editable) {
        childNode = editing ? (
          <Form.Item
            style={{
              margin: 0,
            }}
            name={dataIndex}
            rules={[
              {
                required: true,
                message: `${title} is required.`,
              },
            ]}
          >
            <Input ref={inputRef} onPressEnter={save} onBlur={save} />
          </Form.Item>
        ) : (
          <div
            className="editable-cell-value-wrap"
            style={{
              paddingRight: 24,
            }}
            onClick={toggleEdit}
          >
            {children}
          </div>
        );
      }
      return <td {...restProps}>{childNode}</td>;
    };

  return (

    <div>
      {/* pagination分页器 */}
      <Table dataSource={dataSource} columns={columns} 
              pagination={{
                pageSize:5
              }}
              rowKey={item=>item.id}
              components = {{
                body: {
                  row: EditableRow,
                  cell: EditableCell,
                },
              }}
              />
    </div>
  )
}
