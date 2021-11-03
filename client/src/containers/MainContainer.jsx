import { useState, useEffect } from 'react'
import { Route, Switch, useHistory } from 'react-router-dom'
import Home from '../screens/home/Home'
import Posts from '../screens/posts/Posts'
import PostCreate from '../screens/posts/PostCreate'
import PostDetail from '../screens/posts/PostDetail'
import {
    getAllPosts,
    getOnePost,
    createPost,
    putPost,
    deletePost
} from '../services/posts'


export default function MainContainer({ currentUser }) {
    const [posts, setPosts] = useState([])
    const [latestPosts, setLatestPosts] = useState([])
    const history = useHistory()

    useEffect(() => {
        const fetchPosts = async () => {
            const postsList = await getAllPosts()
            setPosts(postsList)
            setLatestPosts(postsList.slice(-3))
        }
        fetchPosts()
    },[])

    useEffect(() => {
        setLatestPosts(posts.slice(-3))
    },[posts.length])

    const handlePostCreate = async (formData) => {
        const newPost = await createPost(formData)
        setPosts(prevState => [...prevState, newPost])
        history.push('/posts')
    }

    const handlePostUpdate = async (id, formData) => {
        const updatedPost = await putPost(id, formData)
        setPosts(prevState => 
            prevState.map(post => (
                post.id === Number(id) ? updatedPost : post
            )))
        history.push('/posts')
    }

    const handlePostDelete = async (id) => {
        await deletePost(id)
        setPosts(prevState => prevState.filter(post => post.id !== Number(id)))
    }

    return (
        <div>
            <Switch>
                <Route path='/posts/:id'>
                    <PostDetail 
                        currentUser={currentUser}
                        handlePostDelete={handlePostDelete}
                    />
                </Route>
                <Route path='/posts/create'>
                    <PostCreate
                        handlePostCreate={handlePostCreate}
                    />
                </Route>
                <Route path='/posts'>
                    <Posts
                        currentUser={currentUser}
                        posts={posts}
                        handlePostDelete={handlePostDelete}
                    />
                </Route>
                <Route path='/'>
                    <Home
                        currentUser={currentUser}
                        latestPosts={latestPosts}
                    />
                </Route>
            </Switch>
        </div>
    )
}
