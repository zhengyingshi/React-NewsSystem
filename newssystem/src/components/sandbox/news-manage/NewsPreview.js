import React from 'react'
import { Typography,Descriptions} from 'antd';
import { useEffect } from 'react';
import axios from 'axios';
import { useState } from 'react';
import moment from 'moment';
import {
    LeftOutlined
  } from '@ant-design/icons';
import creatHistory from 'history/createHashHistory';

const { Title,Text } = Typography;

export default function NewsPreview(props) {

  const [newsInfo,setnewsInfo] = useState(null);

  useEffect(()=>{
        // console.log(props.match.params.id)
        axios.get(`/news/${props.match.params.id}?_expand=category&_expand=role`).then(
            res=>{
                setnewsInfo(res.data);
            }
        )
  },[props.match.params.id]);

  const auditList  = ["未审核","审核中","已通过","未通过"];
  const publishList = ["未发布","待发布","已上线","已下线"];
  const colorList = ["black","orange","red"];

  const backDraft = ()=>{
    //  props.history.push('/news-manage/draft');
    const history = creatHistory()
    history.goBack()
  }

  return (
    <div>
      {
        newsInfo &&
        <div>
            <Title level={2}  >
                <LeftOutlined onClick={()=>backDraft()}/>
                <span style={{paddingLeft:"10px"}} >{newsInfo?newsInfo.title:''}</span>
                <Text type="secondary"style={{paddingLeft:"30px"}} >{newsInfo.category.title}</Text>
            </Title>
            
            <Descriptions size='small' column={3} style={{marginTop:"50px",marginLeft:"30px"}}>
                <Descriptions.Item label="创建者">{newsInfo.author}</Descriptions.Item>
                <Descriptions.Item label="创建时间">{moment(newsInfo.createTime).format("YYYY/MM/DD HH:mm:ss")}</Descriptions.Item>
                <Descriptions.Item label="发布时间">{newsInfo.publishTime?moment(newsInfo.publishTime).format("YYYY/MM/DD HH:mm:ss"):"-"}</Descriptions.Item>
                <Descriptions.Item label="区域">{newsInfo.region}</Descriptions.Item>
                <Descriptions.Item label="审核状态" >
                    <span style={{color:colorList[newsInfo.auditState]}} >
                        {auditList[newsInfo.auditState]}
                    </span>
                </Descriptions.Item>
                <Descriptions.Item label="发布状态" >
                    <span style={{color:colorList[newsInfo.publishState]}} >
                        {publishList[newsInfo.publishState]}
                    </span>
                </Descriptions.Item>
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
