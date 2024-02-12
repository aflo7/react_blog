import { useState, useEffect } from 'react';
import axios from 'axios';
import Footer from './components/Footer';
import Header from './components/Header';
import PopularPosts from './components/PopularPosts';
import CircularProgress from '@mui/material/CircularProgress';

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function App() {
  const [posts, setPosts] = useState([]);
  const [sortedPopularPosts, setSortedPopularPosts] = useState([]);
  const [showPosts, setShowPosts] = useState(true);
  const [singlePost, setSinglePost] = useState({});
  const [commentContent, setCommentContent] = useState('');
  const [commentAuth, setCommentAuth] = useState('');
  const imgBank = [
    'planet.jpeg',
    'road.jpeg',
    'leaf.jpeg',
    'ashim-d-silva-3Ijt7UkSBYE-unsplash-1500x750.jpg'
  ];
  const [loading, setLoading] = useState(true);

  function scrollToTop() {
    window.scrollTo(0, 0);
  }

  function togglePosts(post) {
    if (post) {
      setSinglePost(post);
    }
    setShowPosts((old) => !old);
  }

  function getRandImg() {
    return imgBank[Math.floor(Math.random() * imgBank.length)];
  }

  function popularPosts() {
    if (posts.length == 0) return;

    let sortedArr = [...posts].sort(
      (a, b) => b.comments.length - a.comments.length
    );

    // only keep the top 3 posts
    if (sortedArr.length > 3) {
      let shortenedSortedArr = [];
      for (let i = 0; i < 3; i++) {
        if (sortedArr[i]) {
          shortenedSortedArr.push(sortedArr[i]);
        }
      }
      setSortedPopularPosts(shortenedSortedArr);
    } else {
      setSortedPopularPosts(sortedArr);
    }
    setLoading(false);
  }

  function createNewComment(cpid) {
    axios
      .post(
        `https://blogbackend-production-7692.up.railway.app/api/comment`,
        {
          author: commentAuth,
          content: commentContent,
          cpid
        },
        {
          headers: {
            'content-type': 'application/json'
          }
        }
      )
      .then(function (response) {
        const addedComment = {
          content: commentContent,
          author: commentAuth,
          cpid
        };
        let modifiedPost = { ...singlePost };
        modifiedPost.comments.push(addedComment);
        setSinglePost(modifiedPost);
        setCommentAuth('');
        setCommentContent('');
      })
      .catch(function (error) {
        alert('An error occurred');
      });
  }

  function getAllPosts() {
    axios
      .get(`https://blogbackend-production-7692.up.railway.app/api/posts/`)
      .then((res) => {
        setPosts(res.data);
      })
      .catch((err) => {
        setPosts([]);
      });
  }

  useEffect(() => {
    async function onMount() {
      await sleep(1000);
      getAllPosts();
    }
    onMount();
  }, []);

  useEffect(() => {
    popularPosts();
  }, [posts]);

  return loading ? (
    <div className="circular-progress">
      <CircularProgress />
    </div>
  ) : (
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
                    ? singlePost.comments.map((comment, i) => {
                        return (
                          <div key={i} className="single_comment">
                            <h4>{comment.content}</h4>
                            <div>- {comment.author}</div>
                          </div>
                        );
                      })
                    : null}
                </div>
                <h2 className="add_comment_title">Add a comment</h2>
                <form
                  id="new_comment_form"
                  onSubmit={(e) => {
                    e.preventDefault();
                    createNewComment(singlePost._id);
                  }}
                >
                  <input
                    type="text"
                    id="content"
                    placeholder="Content"
                    value={commentContent}
                    onChange={(e) => setCommentContent(e.target.value)}
                    required
                  ></input>

                  <input
                    type="text"
                    id="author"
                    placeholder="Author"
                    value={commentAuth}
                    onChange={(e) => setCommentAuth(e.target.value)}
                    required
                  ></input>

                  <input type="submit"></input>
                </form>
              </div>
            ) : null}
            <div
              style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}
            >
              {showPosts
                ? posts.map((post, i) => {
                    return (
                      <div
                        className="post_wrapper"
                        key={i}
                        onClick={() => {
                          togglePosts(post);
                          window.scrollTo(0, 0);
                        }}
                      >
                        <h3>{post.title}</h3>
                        <p>
                          {post.content.substring(0, 150)}
                          ...
                        </p>
                        <p>{post.poster}</p>
                        <figure>
                          <img src={`${getRandImg()}`} alt="" />
                        </figure>
                        <p
                          style={{
                            color: 'grey',
                            fontSize: '12pt'
                          }}
                        >
                          {`Comments: ${post.comments.length}`}
                        </p>
                      </div>
                    );
                  })
                : null}
            </div>
          </section>
          {posts.length > 0 && (
            <PopularPosts
              sortedPopularPosts={sortedPopularPosts}
              togglePosts={togglePosts}
              scrollToTop={scrollToTop}
            />
          )}
        </div>
      </main>
      {posts.length > 0 && <Footer scrollToTop={scrollToTop} />}
    </div>
  );
}

export default App;
