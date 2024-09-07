import { Route, Routes} from 'react-router-dom';
import Home from './Home';
import About from './About';
import NewPost from './NewPost';
import PostPage from './PostPage';
import Missing from './Missing';
import Header from './Header';
import Nav from './Nav';
import Footer from './Footer';
import EditPost from './EditPost';
import  { DataProvider } from './context/DataContext';

function App() {

  return (
    <div className="App">
      <DataProvider>
        <Header title="Smedia" />
        <Nav 
        />
        <Routes>
          <Route path='/' element={<Home 
          />}></Route>
          <Route path='/post' >
            <Route index element={<NewPost 
            />}></Route>
            <Route path=':id' element={<PostPage
            />} />
          </Route>
          <Route path='/edit/:id' element={
              <EditPost 
              />
            }></Route>
          <Route path='/about' element={<About />}></Route>
          <Route path='*' element={<Missing />}></Route>
        </Routes>
        <Footer />
      </DataProvider>
    </div>
  );
}

export default App;
