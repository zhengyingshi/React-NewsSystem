import React from 'react'
import { Button, Table} from 'antd'

export default function NewsPublish(props) {
  
 

  // 表格标题（固定）
  // dataIndex表示将哪些内容放到该列中
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
        return <div>{category.title}</div>
    }
    },
    {
      title: '操作',
      render:(item)=>{
        return <div>
           {props.button(item.id)}
        </div>
    }
    },
  ];



 
  return (

    <div>
      {/* pagination分页器 */}
      <Table dataSource={props.dataSource} columns={columns} 
              pagination={{
                pageSize:5
              }}
              rowKey={item=>item.id}
              />
    </div>
  )
}
