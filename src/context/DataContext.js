import { createContext, useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import {format} from "date-fns";
import api from "../api/posts"
import useWindowSize from '../hooks/useWindowSize';
const DataContext = createContext();

export const DataProvider = ({children}) => {
    const navigate = useNavigate();
    const [posts, setPosts] = useState([]);
    const [postTitle, setPostTitle] = useState('');
    const [postBody, setPostBody] = useState('');
    const [search, setSearch] = useState('');
    const [searchResult, setSearchResult] = useState([]);
    const {width} = useWindowSize();
  
    useEffect(() => {
      const filteredResults = posts.filter((post) => (
        (post.body).toLowerCase()).includes(search.toLowerCase())
      ||((post.title).toLowerCase()).includes(search.toLowerCase()));
      setSearchResult(filteredResults.reverse());
    },
    [posts,search]
    )
  
    useEffect(() => {
      const fetchPosts = async () => {
        try{
          const response = await api.get('/posts');
          setPosts(response.data);
        }catch(err){
          if(err.response){
            console.log(err.response.data);
            console.log(err.response.status);
            console.log(err.response.Header);
          }else{
            console.log(`Error: ${err.message}`);
          }
        }
      }
      fetchPosts();
    })
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      const id = posts.length ? posts[posts.length-1].id+1 : 1;
      const datetime = format(new Date(), 'MMM dd, yyyy pp');
      const newPost = {id, title:postTitle, datetime, body:postBody};
      try{
        const response = await api.post('/posts',newPost);
        const allPost = [...posts, response.data];
        setPosts(allPost);
        setPostTitle('');
        setPostBody('');
        navigate('/');
      }catch(err){
        if(err.response){
          console.log(err.response.data);
          console.log(err.response.status);
          console.log(err.response.Header);
        }else{
          console.log(`Error: ${err.message}`);
        }
      }
    } 
  
    const handleDelete = async (id) => {
      try {
        await api.delete(`/posts/${id}`);
        const postsList =  posts.filter(post => post.id !== id);
        setPosts(postsList);
        navigate('/');
      }catch(err){
        if(err.response){
          console.log(err.response.data);
          console.log(err.response.status);
          console.log(err.response.Header);
        }else{
          console.log(`Error: ${err.message}`);
        }
      }
    }
  
    const [editTitle, setEditTitle] = useState('');
    const [editBody, setEditBody] = useState('');
  
    const handleEdit = async (id) => {
      const datetime = format(new Date(), 'MMM dd, yyyy pp');
      const updatePost = {id, title:editTitle, datetime, body:editBody};
      try{
        const response = await api.put(`/posts/${id}`,updatePost);
        setPosts(posts.map(post => post.id===id ? 
          {...response.data}:post
        ));
        setEditTitle('');
        setEditBody('');
        navigate('/');
      }catch(err){
        console.log(err.message);
      }
  
    }
  
    return (
        <DataContext.Provider value={
            {
                width,
                search,
                searchResult,
                setEditBody,
                setEditTitle,
                setPostBody,
                setPostTitle,
                setPosts,
                setSearch,
                setSearchResult,
                editBody,
                editTitle,
                handleDelete,
                handleEdit,
                handleSubmit,
                postBody,
                postTitle,
                posts,
                navigate
            }
        }>
            {children}
        </DataContext.Provider>
    )
}

export default DataContext;