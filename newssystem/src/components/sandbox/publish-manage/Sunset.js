import React from 'react'
import NewsPublish from '../../publish-manage/NewsPublish';
import usePublish from '../../publish-manage/usePublish';
import { Button} from 'antd';

export default function Sunset() {

  // 3表示已下线的
 const {dataSource,handleDelete} = usePublish(3);
 
  return (
    <div>
      <NewsPublish dataSource={dataSource} 
                    button={(id)=>
                      <Button danger onClick={()=>handleDelete(id)}>删除</Button>
                     }
      >
      </NewsPublish>
    </div>
  )
}
