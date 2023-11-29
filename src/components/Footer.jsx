import React from 'react';
import { AiOutlineArrowUp } from 'react-icons/ai';

function Footer({ scrollToTop }) {
  return (
    <footer className="container">
      <small>
        <a href="https://github.com/aflo7/blog">Source code</a>
      </small>

      <div>
        <AiOutlineArrowUp
          className="arrow-up"
          size={'2rem'}
          style={{ cursor: 'pointer' }}
          onClick={scrollToTop}
        />
      </div>
    </footer>
  );
}

export default Footer;
