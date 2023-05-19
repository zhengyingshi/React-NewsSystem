import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Card, Col, Row,Typography,List } from 'antd';
import _ from 'lodash';


const { Title ,Text} = Typography;

export default function News() {

  const [list,setlist] =  useState([]);
    
  useEffect(()=>{
        axios.get("/news?publishState=2&_expand=category").then(
            res=>{
                // console.log(res.data);
                // console.log(Object.entries(_.groupBy(res.data,item=>item.category.title)));
                setlist(Object.entries(_.groupBy(res.data,item=>item.category.title)));
            }
        )
  },[])
  return (
    <div 
        style={{
            width:"95%",
            margin:'0 auto',
            height:"200px"
        }}
    >
        <Title level={2} style={{marginLeft:"30px"}}>全球新闻 <a></a><Text type="secondary">查看新闻</Text></Title>
        <Row gutter={[16,16]}>
            {
                list.map(item=>
                    <Col span={8} key={item[0]}>
                    <Card title={item[0]} 
                        bordered={false}
                        hoverable={true}
                        style={{
                            height:"300px"
                        }}
                    >
                        <List
                            size="small"
                            bordered
                            dataSource={item[1]}
                            pagination={{
                                pageSize:3
                            }}
                            renderItem={(data) => <List.Item><a href={`#/detail/${data.id}`}>{data.title}</a></List.Item>}
                        />
                    </Card>
                    </Col>
                )
            }

        </Row>
    </div>
  )
}
