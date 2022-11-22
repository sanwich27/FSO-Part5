import { useState } from 'react'
const Blog = ({ blog, increaseLikes, deletePermission, deleteBlog }) => {
  const [detailed, setDetailed] = useState(false)

  const showSimple = { display: detailed ? 'none' : '' }
  const showDetailed = { display: detailed ? '' : 'none' }

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  }

  const deleteButtonStyle = { display: deletePermission ? '' : 'none' }

  const toggleDetailed = () => {
    setDetailed(!detailed)
  }

  const addLikes = async (blogObj) => {
    const newObj = {
      ...blogObj,
      user: blogObj.user.id,
      likes: blogObj.likes + 1
    }
    await increaseLikes(newObj)
  }

  return(
    <div>
      <div style={{ ...blogStyle, ...showSimple }} className='default'>
        {blog.title} {blog.author}
        <button id='view-button' onClick={toggleDetailed}>view</button>
      </div>
      <div style={{ ...blogStyle, ...showDetailed }} className='detailed'>
        {blog.title} <button onClick={toggleDetailed}>hide</button><br/>
        {blog.url} <br/>
        likes {blog.likes} <button id='like-button' onClick={() => addLikes(blog)}>like</button> <br/>
        {blog.author} <br/>
        <button id='delete-button' style={deleteButtonStyle} onClick={() => deleteBlog(blog)}>delete</button>
      </div>
    </div>
  )


}

export default Blog