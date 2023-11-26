import { useState, useEffect } from "react"
import axios from "axios"
import Footer from "./components/Footer"
import Header from "./components/Header"
import PopularPosts from "./components/PopularPosts"

function App() {
    const [posts, setPosts] = useState([])
    const [sortedPopularPosts, setSortedPopularPosts] = useState([])
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

    function scrollToTop() {
        window.scrollTo(0, 0)
    }

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
        if (posts.length == 0) return

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
            setSortedPopularPosts(shortenedSortedArr)
        } else {
            setSortedPopularPosts(sortedArr)
        }
    }

    // http://3.131.100.53:3001/api/posts/

    const getAllPosts = () => {
        axios
            .get(`https://theapi.webapp0000.us/api/posts/`)
            .then((res) => {
                setPosts(res.data)
            })
            .catch((err) => {
                setPosts([])
            })
    }

    const createNewComment = (cpid) => {
        axios
            .post(
                `https://theapi.webapp0000.us/api/comment`,
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
                    content: commentContent,
                    author: commentAuth,
                    cpid
                }
                let modifiedPost = { ...singlePost }
                modifiedPost.comments.push(addedComment)
                setSinglePost(modifiedPost)
                setCommentAuth("")
                setCommentContent("")
            })
            .catch(function (error) {
                alert("An error occurred")
            })
    }

    useEffect(() => {
        getAllPosts()
    }, [])

    useEffect(() => {
        popularPosts()
    }, [posts])

    return (
        <div>
            <Header />

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
                                        ? singlePost.comments.map(
                                              (comment, i) => {
                                                  return (
                                                      <div
                                                          key={i}
                                                          className="single_comment"
                                                      >
                                                          <h4>
                                                              {comment.content}
                                                          </h4>
                                                          <div>
                                                              - {comment.author}
                                                          </div>
                                                      </div>
                                                  )
                                              }
                                          )
                                        : null}
                                </div>
                                <h2 className="add_comment_title">
                                    Add a comment
                                </h2>
                                <form
                                    id="new_comment_form"
                                    onSubmit={(e) => {
                                        e.preventDefault()
                                        createNewComment(singlePost._id)
                                    }}
                                >
                                    <input
                                        type="text"
                                        id="content"
                                        placeholder="content..."
                                        value={commentContent}
                                        onChange={(e) =>
                                            setCommentContent(e.target.value)
                                        }
                                        required
                                    ></input>

                                    <input
                                        type="text"
                                        id="author"
                                        placeholder="author..."
                                        value={commentAuth}
                                        onChange={(e) =>
                                            setCommentAuth(e.target.value)
                                        }
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
                                              onClick={() => {
                                                  togglePosts(post)
                                                  window.scrollTo(0, 0)
                                              }}
                                          >
                                              <h3>{post.title}</h3>
                                              <p>
                                                  {post.content.substring(
                                                      0,
                                                      150
                                                  )}
                                                  ...
                                              </p>
                                              <p>{post.poster}</p>
                                              <figure>
                                                  <img
                                                      src={`${getRandImg()}`}
                                                      alt=""
                                                  />
                                              </figure>
                                              <p
                                                  style={{
                                                      color: "grey",
                                                      fontSize: "12pt"
                                                  }}
                                              >
                                                  {`Comments: ${post.comments.length}`}
                                              </p>
                                          </div>
                                      )
                                  })
                                : null
                            : null}
                    </section>
                    <PopularPosts
                        sortedPopularPosts={sortedPopularPosts}
                        togglePosts={togglePosts}
                        scrollToTop={scrollToTop}
                    />
                </div>
            </main>

            <Footer scrollToTop={scrollToTop} />
        </div>
    )
}

export default App
