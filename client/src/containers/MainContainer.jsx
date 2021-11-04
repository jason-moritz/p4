import { useState, useEffect } from 'react'
import { Route, Switch, useHistory } from 'react-router-dom'
import Home from '../screens/home/Home'
import Posts from '../screens/posts/Posts'
import PostCreate from '../screens/posts/PostCreate'
import PostDetail from '../screens/posts/PostDetail'
import PostUpdate from '../screens/posts/PostUpdate'
import CommentCreate from '../screens/comments/CommentCreate'
import CommentUpdate from '../screens/comments/CommentUpdate'
import {
    getAllPosts,
    getOnePost,
    createPost,
    putPost,
    deletePost
} from '../services/posts'
import {
    createComment,
    putComment
} from '../services/comments'


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
        setLatestPosts(posts?.slice(-3))
    },[posts])

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
        history.push(`/posts/${id}`)
    }

    const handlePostDelete = async (id) => {
        await deletePost(id)
        setPosts(prevState => prevState.filter(post => post.id !== Number(id)))
        history.push('/posts')
    }

    const handleCommentCreate = async (post_id, formData) => {
        const newComment = await CommentCreate(post_id, formData)
        const associatedPost = posts.find(post => post.id === post_id)
        associatedPost.comments.push(newComment.id)

        setPosts(prevState => prevState.map(post => {
            return post.id === post_id ? associatedPost : post
        }))
    }

    const handleCommentUpdate = async (post_id, comment_id, formData) => {

    }

    return (
        <div>
            <Switch>
                <Route path='/posts/:id/comments/create'>
                    <CommentCreate
                        handleCommentCreate={handleCommentCreate}
                    />
                </Route>
                <Route path='/posts/create'>
                    <PostCreate
                        handlePostCreate={handlePostCreate}
                    />
                </Route>
                <Route path='/posts/:id/update'>
                    <PostUpdate
                        posts={posts}
                        handlePostUpdate={handlePostUpdate}
                    />
                </Route>
                <Route path='/posts/:id'>
                    <PostDetail 
                        currentUser={currentUser}
                        posts={posts}
                        setPosts={setPosts}
                        handlePostDelete={handlePostDelete}
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
