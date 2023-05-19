import React from 'react'
import { Typography,Descriptions} from 'antd';
import { useEffect } from 'react';
import axios from 'axios';
import { useState } from 'react';
import moment from 'moment';
import {
    LeftOutlined,
    HeartTwoTone
  } from '@ant-design/icons';
import creatHistory from 'history/createHashHistory';

const { Title,Text } = Typography;

export default function Detail(props) {

  const [newsInfo,setnewsInfo] = useState(null);

  const backNews = ()=>{
    //  props.history.push('/news-manage/draft');
    const history = creatHistory()
    history.goBack()
  }

  useEffect(()=>{
        // console.log(props.match.params.id)
        axios.get(`/news/${props.match.params.id}?_expand=category&_expand=role`).then(
            res=>{
                setnewsInfo({
                    ...res.data,
                    view:(res.data.view+1)
                });
                return res.data
            }
            ).then(res=>{
                    axios.patch(`/news/${props.match.params.id}`,{
                        view:res.view+1
                    })
            })

        // console.log(newsInfo);
  },[props.match.params.id]);

  

  const handleStar= ()=>{
    setnewsInfo({
        ...newsInfo,
        star:(newsInfo.star+1)
    });

    axios.patch(`/news/${props.match.params.id}`,{
        star:newsInfo.star+1
    })

  }
  return (
    <div>
      {
        newsInfo &&
        <div>
            <Title level={2}  >
                <LeftOutlined onClick={()=>backNews()}/>
                <span style={{padding:"10px"}} >{newsInfo?newsInfo.title:''}</span>
                <HeartTwoTone twoToneColor="#eb2f96" onClick={()=>handleStar()} />
            </Title>
            <Text type="secondary"style={{paddingLeft:"40px"}} >{newsInfo.category.title}</Text>
            <Descriptions size='small' column={3} style={{marginTop:"50px",marginLeft:"50px"}}>
                <Descriptions.Item label="创建者">{newsInfo.author}</Descriptions.Item>
                <Descriptions.Item label="发布时间">{newsInfo.publishTime?moment(newsInfo.publishTime).format("YYYY/MM/DD HH:mm:ss"):"-"}</Descriptions.Item>
                <Descriptions.Item label="区域">{newsInfo.region}</Descriptions.Item>
                <Descriptions.Item label="访问数量">{newsInfo.view}</Descriptions.Item>
                <Descriptions.Item label="点赞数量">{newsInfo.star}</Descriptions.Item>
                <Descriptions.Item label="评论数量">{newsInfo.star}</Descriptions.Item>
            </Descriptions>
            <div dangerouslySetInnerHTML={{
                __html:newsInfo.content
                 }}
                 style={{
                    border:'1px solid black',
                    padding:"20px 24px",
                    margin:"20px 24px"
                 }}
            >
            </div>
        </div>
      }
    </div>
  )
}
