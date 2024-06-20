import './App.css';
import { Routes, Route, BrowserRouter, /* Link */ } from "react-router-dom"
import Login from './pages/Login';
import Registration from './pages/Registration';
/* import Downer from "./pages/Downer"
 */import IndexPage from './pages/Index';
import CreatePost from './pages/CreatePost';
import UserProfile from './pages/UserProfile';
import ChangeLog from "./pages/ChangeLog.jsx"
import FullPost from './pages/FullPost.jsx';


function App() {

  return (
      
      <div className="App">
<BrowserRouter>
{/*                 <Downer />
 */}                <Routes>
                <Route exact path="/" element={<IndexPage />}></Route>
                <Route path={'login'} element={<Login />} />
                <Route path={'register'} element={<Registration />} />
                <Route path={'create'} element={<CreatePost />} />
                <Route path={'fullPost/:id'} element={<FullPost />} />
                <Route path={'changelog'} element={<ChangeLog />}/>
                <Route path={'userProfile/:userId'} element={<UserProfile />} />
                </Routes> 
</BrowserRouter>
    </div>
  );
}

export default App;
