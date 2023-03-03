import { useState, useEffect } from "react"
import axios from "axios"

function App() {
  // const [count, setCount] = useState(0)
  // const prefix = 'http://localhost:5000/'
  const [posts, setPosts] = useState([])
  const [sortedPosts, setSortedPosts] = useState([])
  const [showPosts, setShowPosts] = useState(true)
  const [singlePost, setSinglePost] = useState({})
  const [commentContent, setCommentContent] = useState("")
  const [commentAuth, setCommentAuth] = useState("")
  const imgBank = [
    "planet.jpeg",
    "road.jpeg",
    "leaf.jpeg",
    "ashim-d-silva-3Ijt7UkSBYE-unsplash-1500x750.jpg"
  ]

  const togglePosts = (post) => {
    if (post) {
      setSinglePost(post)
    }
    setShowPosts((old) => !old)
  }

  const getRandImg = () => {
    return imgBank[Math.floor(Math.random() * imgBank.length)]
  }

  const popularPosts = () => {
    if (!posts || posts.length == 0) return
    // ilike node: 3 comments
    // programming is cool: 3 c
    // order most popular posts by comment #
    let sortedArr = [...posts].sort(
      (a, b) => b.comments.length - a.comments.length
    )

    // only keep the top 3 posts
    if (sortedArr.length > 3) {
      let shortenedSortedArr = []
      for (let i = 0; i < 3; i++) {
        if (sortedArr[i]) {
          shortenedSortedArr.push(sortedArr[i])
        }
      }
      setSortedPosts(shortenedSortedArr)
    } else {
      setSortedPosts(sortedArr)
    }
  }

  const getAllPosts = () => {
    axios
      .get(`https://app2.memberssonly.xyz/api/posts`)
      .then((res) => {
        // successfully retrieved posts
        // console.log(res.data)
        setPosts(res.data)
      })
      .catch((err) => {
        console.log(err)
      })
  }

  const newComment = (cpid) => {
    if (!commentAuth || !commentContent || !cpid) return

    axios
      .post(
        `https://app2.memberssonly.xyz/api/comment`,
        {
          author: commentAuth,
          content: commentContent,
          cpid
        },
        {
          headers: {
            "content-type": "application/json"
          }
        }
      )
      .then(function (response) {
        const addedComment = {
          content:commentContent,
          author:commentAuth,
          cpid
        }
        let modifiedPost = {...singlePost}
        modifiedPost.comments.push(addedComment)
        setSinglePost(modifiedPost)
        setCommentAuth("")
        setCommentContent("")
      })
      .catch(function (error) {
        console.log(error)
      })
  }

  useEffect(() => {
    getAllPosts()
  }, [])

  useEffect(() => {
    popularPosts()
  }, [posts])

  return (
    <div className="App">
      <>
        <div className="hero" data-theme="dark">
          <header className="container">
            <hgroup>
              <h1>Blog</h1>
              <h2>A place where people can express their opinions</h2>
              <p>
                Technologies used: React, HTML, CSS, Javascript, MongoDB,
                Node.js
              </p>
            </hgroup>
          </header>
        </div>
        {/* ./ Hero */}
        {/* Main */}
        <main className="container">
          <div className="grid">
            <section>
              {!showPosts && singlePost ? (
                <div>
                  <button onClick={togglePosts}>Back</button>
                  <h1>{singlePost.title}</h1>
                  <div>{singlePost.content}</div>
                  <div className="comment_wrapper">
                    {singlePost.comments
                      ? singlePost.comments.map((comment, i) => {
                          return (
                            <div key={i} className="single_comment">
                              <h4>{comment.content}</h4>
                              <div>- {comment.author}</div>
                            </div>
                          )
                        })
                      : null}
                  </div>
                  <h2 className="add_comment_title">Add a comment</h2>
                  <form
                    id="new_comment_form"
                    onSubmit={(e) => {
                      e.preventDefault()
                      newComment(singlePost._id)
                    }}
                  >
                    <input
                      type="text"
                      id="content"
                      placeholder="content..."
                      value={commentContent}
                      onChange={(e) => setCommentContent(e.target.value)}
                      required
                    ></input>

                    <input
                      type="text"
                      id="author"
                      placeholder="author..."
                      value={commentAuth}
                      onChange={(e) => setCommentAuth(e.target.value)}
                      required
                    ></input>

                    <input type="submit"></input>
                  </form>
                </div>
              ) : null}
              {showPosts
                ? posts
                  ? posts.map((post, i) => {
                      return (
                        <div
                          className="post_wrapper"
                          key={i}
                          onClick={() => togglePosts(post)}
                        >
                          <h3>{post.title}</h3>
                          <p>{post.content.substring(0, 150)}...</p>
                          <p>{post.poster}</p>
                          <figure>
                            <img src={`${getRandImg()}`} alt="" />
                          </figure>
                          <p>Comments: {post.comments.length}</p>
                        </div>
                      )
                    })
                  : null
                : null}
            </section>
            <aside>
              <h1>Popular Posts</h1>

              {sortedPosts
                ? sortedPosts.map((post, i) => {
                    return (
                      <div key={i} className="popular_post_wrapper">
                        <img
                          src="maarten-deckers-T5nXYXCf50I-unsplash-1500x750.jpg"
                          alt="Architecture"
                        />
                        <div>
                          <a href="#">{post.title}</a>
                          <br />
                          <small>{post.content.substring(0, 25)}</small>
                          <p>Comments: {post.comments.length}</p>
                        </div>
                      </div>
                    )
                  })
                : null}
            </aside>
          </div>
        </main>

        <footer className="container">
          <small>
            <a href="https://github.com/aflo7/blog">Source code</a>
          </small>
        </footer>
      </>
    </div>
  )
}

export default App
