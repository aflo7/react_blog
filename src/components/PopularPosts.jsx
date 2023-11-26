import React from 'react';

function PopularPosts({ sortedPopularPosts, togglePosts, scrollToTop }) {
  return (
    <aside>
      <h1>Popular Posts</h1>
      <div className="popular-posts-wrapper">
        {sortedPopularPosts
          ? sortedPopularPosts.map((post, i) => {
              return (
                <div
                  key={i}
                  className="popular_post_wrapper"
                  onClick={() => {
                    togglePosts(post);
                    scrollToTop();
                  }}
                >
                  <img
                    src="maarten-deckers-T5nXYXCf50I-unsplash-1500x750.jpg"
                    alt="Architecture"
                  />
                  <div>
                    <div style={{ color: 'rgb(11,115,180)' }}>{post.title}</div>
                    <br />
                    <small style={{ color: 'lightgray' }}>
                      {post.content.length > 45
                        ? post.content.substring(0, 45) + '...'
                        : post.content}
                    </small>
                    <p
                      style={{
                        color: 'grey',
                        fontSize: '10pt'
                      }}
                    >
                      {`Comments: ${post.comments.length}`}
                    </p>
                  </div>
                </div>
              );
            })
          : null}
      </div>
    </aside>
  );
}

export default PopularPosts;
