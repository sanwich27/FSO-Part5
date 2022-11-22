import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState(null)


  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const notify = (message, type='info') => {
    setNotification({ message, type })
    setTimeout(() => {
      setNotification(null)
    }, 3000)
  }

  const addBlog = async (blogObj) => {
    try {
      blogFormRef.current.toggleVisibility()
      const response = await blogService.create(blogObj)
      notify(`"${response.title}" by ${response.author} is added to blog list`)
      setBlogs([...blogs, response])
    } catch (exception) {
      notify('Failed to add a new blog!','alert')
    }
  }

  const blogFormRef = useRef()
  const blogForm = () => (
    <Togglable buttonLabel="create new blog" ref={blogFormRef}>
      <BlogForm
        createBlog={addBlog}
      />
    </Togglable>
  )

  const handleLogout = async () => {
    window.localStorage.removeItem('loggedUser')
    setUser(null)
  }

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username, password,
      })

      window.localStorage.setItem(
        'loggedUser', JSON.stringify(user)
      )
      notify('Login successfully')
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      notify('Wrong username or password!','alert')
    }
  }

  const loginForm = () => (
    <LoginForm
      username={username}
      password={password}
      handleUsernameChange={({ target }) => setUsername(target.value)}
      handlePasswordChange={({ target }) => setPassword(target.value)}
      handleSubmit={handleLogin}
    />
  )
  const increaseLikes = async (blogObj) => {
    try {
      const response = await blogService.update(blogObj.id, blogObj)
      notify(`"${response.title}" by ${response.author} is liked!`)
      setBlogs([...blogs.filter((blog) => blog.id !== response.id), response])
    } catch (exception) {
      notify('Failed to increase likes!','alert')
    }
  }
  const deleteBlog = async (blogObj) => {
    try {
      const approval = window.confirm(`Delete ${blogObj.title} by ${blogObj.author}?`)
      if (approval) {
        await blogService.remove(blogObj.id)
        notify(`"${blogObj.title}" by ${blogObj.author} is deleted successfully!`)
        setBlogs([...blogs.filter((blog) => blog.id !== blogObj.id)])
      }
    } catch (exception) {
      notify('Failed to delete this blog!','alert')
    }
  }
  const allBlogs = () => (
    <div>
      <h2>blogs</h2>
      {blogs.sort((a, b) => b.likes - a.likes).map(blog =>
        <Blog
          key={blog.id}
          blog={blog}
          increaseLikes={increaseLikes}
          deletePermission={user.username === blog.user.username}
          deleteBlog={deleteBlog} />
      )}
    </div>
  )
  return (
    <div>
      <Notification notification={notification}/>
      {user === null
        ? loginForm()
        : <div>
          <p>{user.name} logged-in</p>
          <button
            id='logout-button'
            onClick={handleLogout}
          >logout</button>
          <h2>create a new blog</h2>
          {blogForm()}
          {allBlogs()}
        </div>
      }
    </div>
  )
}

export default App
