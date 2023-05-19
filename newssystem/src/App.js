import './App.css'
import IndexRouter from "./router/IndexRouter"
import { Provider } from 'react-redux';
import store from './redux/store';
// const App = () => (
  function App(){
  
  // return <Provider store={store}> 
  //         <div className="App">
  //           <IndexRouter> </IndexRouter>
  //         </div>
  // </Provider>
   return <div className="App">
                   <IndexRouter> </IndexRouter>
          </div>
             

// );
}


export default App

