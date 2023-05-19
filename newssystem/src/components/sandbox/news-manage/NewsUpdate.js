import style from './News.module.css'
import React, { useEffect, useState,useRef } from 'react';
import { Typography,Steps, Button,Form,Input, Select, message ,notification} from 'antd';
import axios from 'axios';
import NewsEditor from '../../news-manage/NewsEditor';
import {
    LeftOutlined
  } from '@ant-design/icons';
const { Title } = Typography;
const {Option} = Select;

export default function NewsUpdate(props) {

  const [currentStep,setCurrentStep] = useState(0);
  const [categoryList,setcategoryList] = useState([]);
  const [formInfo,setformInfo] = useState({});
  const [content,setcontent] = useState("");

  // 获取登陆用户的级别和区域
  const User = JSON.parse(localStorage.getItem("token"));

  const handleNext = ()=>{
     if(currentStep===0){
          NewsForm.current.validateFields().then(res=>{
              console.log(res);
              setformInfo(res);
              setCurrentStep(currentStep+1);
          }).catch(error=>{
              console.log(error);
          })
     }else{
          if(content===""||content.trim()==="<p></p>"){
            message.error("新闻内容不能为空！")
          }else{
            console.log(formInfo,content);
            setCurrentStep(currentStep+1);
          }
     }
  };
  const handlePrevious = ()=>{
    setCurrentStep(currentStep-1);
  };

  const handleSave = (auditState)=>{
    axios.patch(`./news/${props.match.params.id}`,{
      ...formInfo,
      "content": content,
      "auditState": auditState,
    }).then(res=>{
        props.history.push(auditState===0?'/news-manage/draft':'/audit-manage/list');
         // 右下角提醒框
        // const [api, contextHolder] = notification.useNotification();
        // const openNotification = (placement) => {
          notification.info({
            message: `通知`,
            description:
              `您可以到${auditState===0?'草稿箱':'审核列表'}中查看你的新闻`,
            placement:"bottomRight",
          })
        // };
    })
  };
  const layout = {
    // 占24份里的4份
    labelCol: {
      span: 4,
    },
    // 占24份里的20份
    wrapperCol: {
      span: 20,
    },
  };

  const NewsForm = useRef(null);

  useEffect(()=>{
    axios.get("/categories").then(res=>{
      // console.log(res.data)
      setcategoryList(res.data);
    })
  },[]);

  useEffect(()=>{
        // console.log(props.match.params.id)
        axios.get(`/news/${props.match.params.id}?_expand=category&_expand=role`).then(
            res=>{
                // setnewsInfo(res.data);
                let {title,categoryId,content} = res.data;
                NewsForm.current.setFieldsValue({
                    title:title,
                    categoryId:categoryId,
                })

                setcontent(content);
            }
        )
    },[props.match.params.id]);

  const backDraft = ()=>{
    props.history.push('/news-manage/draft');
  }

  return (
    <div>
      <Title level={3} style={{marginBottom:"50px"}}><LeftOutlined onClick={()=>backDraft()}/> 更新新闻</Title>
      {/* 步骤条 */}
        <Steps
          current={currentStep}
          items={[
            {
              title: '基本信息',
              description:'新闻标题，新闻分类',
            },
            {
              title: '新闻内容',
              description:'新闻主题内容',
              // subTitle: 'Left 00:00:08',
            },
            {
              title: '新闻提交',
              description:'保存草稿或提交审核',
            },
          ]}
        />
        {/* 基本信息 */}
        <div style={{marginTop:"50px"}}>
          <div className={currentStep===0?'':style.active}>
              <Form
                {...layout}
                name="basic"
                ref={NewsForm}
              >
                <Form.Item
                  name="title"
                  label="新闻标题"
                  rules={[
                    {
                      required: true,
                      message:'请输入内容！'
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  name="categoryId"
                  label="新闻分类"
                  rules={[
                    {
                      required: true,
                      message:'请输入内容！'
                    },
                  ]}
                >
                  <Select>
                    {
                      categoryList.map(item=>{
                           return <Option value={item.id} key={item.id}>{item.title}</Option>
                      })
                    }
                  </Select>
                </Form.Item>

              </Form>
          </div>
          <div className={currentStep===1?'':style.active}>
                  <NewsEditor 
                    getContent={(value)=>{
                        // console.log(value);
                        setcontent(value);
                  }}
                   content={content}
                  > 
                  </NewsEditor>
          </div>
          <div className={currentStep===2?'':style.active}>
          </div>
        </div>

      <div style={{marginTop:"50px"}}>
        {
          currentStep===2 &&
          <span>
              <Button type="primary" onClick={()=>handleSave(1)}>提交审核</Button>
             <Button onClick={()=>handleSave(0)} >保存草稿箱</Button>
          </span>
        }
        {
           currentStep<2 &&
           <Button type="primary" onClick={()=>handleNext()}>下一步</Button>
        }
        {
          currentStep>0  && 
          <Button onClick={()=>handlePrevious()} >上一步</Button>
        }
        
      </div>
    </div>
  )
}
