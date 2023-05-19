import { notification } from 'antd';
import axios from 'axios';
import  { useEffect, useState } from 'react';

function usePublish(type){
    const [dataSource,setdataSource] = useState([]);
    const {username} = JSON.parse(localStorage.getItem("token"));
  
    useEffect(()=>{
      axios.get(`/news?author=${username}&publishState=${type}&_expand=category`).then(
        res=>{
          // console.log(res.data);
          setdataSource(res.data);
        }
      )
    },[username]);

    const handlePublish=(id)=>{
        console.log(id);
        setdataSource(dataSource.filter(item=>item.id!==id));
        axios.patch(`./news/${id}`,{
            "publishState": 2,
            "publishTime":Date.now()
          }).then(res=>{
                notification.info({
                  message: `通知`,
                  description:
                    `您已成功发布新闻！`,
                  placement:"bottomRight",
                })
              // };
          })
    };

    const handleSunset=(id)=>{
        console.log(id);
        setdataSource(dataSource.filter(item=>item.id!==id));
        axios.patch(`./news/${id}`,{
            "publishState": 3,
          }).then(res=>{
                notification.info({
                  message: `通知`,
                  description:
                    `您已成功下线新闻！`,
                  placement:"bottomRight",
                })
              // };
          })
    };

    const handleDelete=(id)=>{
        console.log(id);
        setdataSource(dataSource.filter(item=>item.id!==id));
        axios.delete(`./news/${id}`).then(res=>{
                notification.info({
                  message: `通知`,
                  description:
                    `您已成功删除新闻！`,
                  placement:"bottomRight",
                })
              // };
          })
    };

    return {
        dataSource,
        handleDelete,
        handlePublish,
        handleSunset
    }
}

export default  usePublish;