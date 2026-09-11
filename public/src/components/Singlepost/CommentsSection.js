import React, { useState, useEffect } from 'react';
import styles from './CommentsSection.module.css';

const apiUrl = process.env.REACT_APP_SERVER_URL || 'http://localhost:3030';

const CommentsSection = ({ postId }) => {
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [loading, setLoading] = useState(false);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await fetch(`${apiUrl}/post/${postId}/comments`, {
          method: 'GET',
          credentials: 'include'
        });
        const data = await res.json();
        if (!data.error && data.post) {
          setComments(data.post.comments || []);
        }
      } catch (err) {
        console.error('Erreur fetch commentaires :', err);
      }
    };
    fetchComments();
  }, [postId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(`${apiUrl}/post/${postId}/comment`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: commentText }),
      });
      const data = await res.json();
      if (!data.error) {
        setComments((prev) => [...prev, data.comment]);
        setCommentText('');
      }
    } catch (err) {
      console.error('Erreur ajout commentaire :', err);
    } finally {
      setLoading(false);
    }
  };

  const displayedComments = showAll ? comments : comments.slice(0, 3);

  return (
    <div className={styles["commentsWrapper"]}>
      <h3 className={styles["commentsTitle"]}>Commentaires ({comments.length})</h3>
      <ul className={styles["commentList"]}>
        {displayedComments.map((c, idx) => (
          <li key={idx} className={styles["commentItem"]}>
            <span className={styles["commentAuthor"]}>
              {c.author?.name || c.author?.email} :
            </span>
            <span className={styles["commentContent"]}>{c.content}</span>
          </li>
        ))}
      </ul>
      {comments.length > 3 && (
        <button
          onClick={() => setShowAll(!showAll)}
          className={styles["showMoreButton"]}
        >
          {showAll ? 'Voir moins' : 'Voir plus de commentaires'}
        </button>
      )}
      <form onSubmit={handleSubmit} className={styles["commentForm"]}>
        <textarea
          className={styles["commentTextarea"]}
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          placeholder="Écrire un commentaire..."
          rows={3}
        />
        <button
          className={styles["commentButton"]}
          type="submit"
          disabled={loading}
        >
          {loading ? 'Envoi…' : 'Publier'}
        </button>
      </form>
    </div>
  );
};

export default CommentsSection;