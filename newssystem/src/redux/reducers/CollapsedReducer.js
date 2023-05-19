
export const CollapsedReducer = (
    prevState={
        isCollapsed:false
    },
    action) =>{

        return prevState
}

// // 本质是一个函数，接受数据之前的状态，action,返回加工后的状态,reducer这个函数是纯函数
// // reducer被第一次调用时，是store自动触发的
// export const CollapsedReducer = (prevState = {
//     isCollapsed: false
// }, action) => {
//     // console.log(action)
//     let { type } = action
//     switch (type) {
//         case "change_collapsed":
//             let newstate = { ...prevState }
//             newstate.isCollapsed = !newstate.isCollapsed
//             return newstate
//         default:
//             return prevState
//     }
// }