import React, { useEffect, useRef, useState } from 'react'
import 'antd/dist/reset.css';
import { List,Card, Col, Row,Avatar ,Drawer} from 'antd';
import { EditOutlined, EllipsisOutlined, SettingOutlined } from '@ant-design/icons';
import axios from 'axios';
import * as ECharts from 'echarts';
import _ from 'lodash';
const { Meta } = Card;

export default function Home() {
  
  const {username,region,role:{roleName}} = JSON.parse(localStorage.getItem("token"));
  const [viewList,setviewList] = useState([]);
  const [allList,setallList] = useState([]);
  const [starList,setstarList] = useState([]);
  const [visiable,setvisiable] = useState(false);
  const [pieChart,setpieChart] = useState(null);

  const barRef = useRef();
  const pieRef = useRef();
  useEffect(()=>{
    axios.get("/news?publishState=2&_expand=category&_sort=view&_order=desc&_limit=6").then(res=>{
      // console.log(res.data)
      setviewList(res.data);
      
    })
  },[]);

  useEffect(()=>{
    axios.get("/news?publishState=2&_expand=category&_sort=star&_order=desc&_limit=6").then(res=>{
      // console.log(res.data)
      setstarList(res.data);
    })
  },[]);
  
  // 图标数据
  useEffect(()=>{
    axios.get("/news?publishState=2&_expand=category").then(res=>{
                  // console.log(res.data);
                  // console.log(_.groupBy(res.data,item=>item.category.title));
                  renderBarView(_.groupBy(res.data,item=>item.category.title));
                  setallList(res.data);
            })

    return ()=>{
      window.onresize= null;
    }
  },[])

  const renderBarView =(obj)=>{
                  // 基于准备好的dom，初始化echarts实例
                  var myChart = ECharts.init(barRef.current);

                  // 指定图表的配置项和数据
                  var option = {
                    title: {
                      text: '新闻分类图示'
                    },
                    tooltip: {},
                    legend: {
                      data: ['数量']
                    },
                    xAxis: {
                      data: Object.keys(obj),
                      axisLabel:{
                        rotate:"15",
                        interval:0
                      }
                    },
                    yAxis: {
                      minInterval:1,
                    },
                    series: [
                      {
                        name: '数量',
                        type: 'bar',
                        data: Object.values(obj).map(item=>item.length)
                      }
                    ]
                  };
            
                  // 使用刚指定的配置项和数据显示图表。
                  myChart.setOption(option);

                  window.onresize =()=>{
                    // console.log("resize")
                    myChart.resize();
                  }
  }

  const renderPieView = (obj)=>{ 
        // 数据处理工作
        var currentList = allList.filter(item=>item.author===username);
        // console.log(currentList);
        var groupObj = _.groupBy(currentList,item=>item.category.title);
        // console.log(groupObj);

        var list = [];
        for(var i in groupObj){
          list.push({
              name:i,
              value:groupObj[i].length
          })
        };
        console.log(list);

        var myChart ;
        if(!pieChart) {
           myChart = ECharts.init(pieRef.current);
           setpieChart(myChart);
        }
        else{
          myChart=pieChart;
        }
        var option;
        
        option = {
          title: {
            text: '当前用户新闻分类图示',
            // subtext: 'Fake Data',
            left: 'center'
          },
          tooltip: {
            trigger: 'item'
          },
          legend: {
            orient: 'vertical',
            left: 'left'
          },
          series: [
            {
              name: '发布数量',
              type: 'pie',
              radius: '50%',
              data: list,
              emphasis: {
                itemStyle: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
              }
            }
          ]
        };
        
        option && myChart.setOption(option);
  }
  return (
    <div>
          <Row gutter={16}>
            <Col span={8}>
              <Card title="用户最常浏览" bordered={false}>
                    <List
                      size="small"
                      dataSource={viewList}
                      renderItem={(item) => <List.Item>
                                              <a href={`#/news-manage/preview/${item.id}`}>  {item.title} </a>
                                              </List.Item>}
                    />
              </Card>
            </Col>
            <Col span={8}>
              <Card title="用户点赞最多" bordered={false}>
                    <List
                      size="small"
                      dataSource={starList}
                      renderItem={(item) => <List.Item>
                                                  <a href={`#/news-manage/preview/${item.id}`}>  {item.title} </a>
                                            </List.Item>}
                    />
              </Card>
            </Col>
            <Col span={8}>
                  <Card 
                      cover={
                        <img
                          alt="example"
                          src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
                        />
                      }
                      actions={[
                        <SettingOutlined key="setting" 
                                         onClick={()=>{
                                           setvisiable(true);
                                            setTimeout(()=>{
                                              renderPieView();
                                            },0);
                                         }}
                        />,
                        <EditOutlined key="edit" />,
                        <EllipsisOutlined key="ellipsis" />,
                      ]}
                  >
                    <Meta
                        avatar={<Avatar src="https://joesch.moe/api/v1/random" />}
                        title={username}
                        description={
                           <div>
                              <b>{region?region:"全球"}</b>
                              <span style={{paddingLeft:"30px"}}>{roleName} </span>
                           </div>
                        }
                    />
                  </Card>
            </Col>
          </Row>
          {/* 个人抽屉组件 */}
          <Drawer
              width="500px"
              title="个人新闻分类" 
              placement="right" 
              closable={true}
              onClose={()=>{
                 setvisiable(false);
              }} 
              open={visiable}
          >
                  {/* 个人新闻图表 */}
                  <div ref={pieRef} 
                       style={{ 
                            width:"100%",
                            height:"400px",
                            marginTop:"30px"
                               }}>
                  </div>
          </Drawer>
          {/* 首页新闻图表 */}
          <div ref={barRef} style={{ 
            width:"100%",
            height:"400px",
            marginTop:"30px"
          }}></div>
    </div>
  )
}

//export default Home;