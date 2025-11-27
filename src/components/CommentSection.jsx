import { useState, useEffect } from 'react';
import { getCommentsByItemId, createCommentDoc } from '../assets/services/commentsService.js';

const CommentSection = ({ itemId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [userName, setUserName] = useState('');
  const [rating, setRating] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadComments();
  }, [itemId]);

  const loadComments = async () => {
    try {
      const commentsData = await getCommentsByItemId(itemId);
      setComments(commentsData);
    } catch (error) {
      console.error('Error loading comments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || !userName.trim()) return;

    setSubmitting(true);
    try {
      const commentData = {
        itemId,
        userName: userName.trim(),
        text: newComment.trim(),
        rating: rating ? parseInt(rating) : null
      };
      await createCommentDoc(commentData);
      setNewComment('');
      setUserName('');
      setRating('');
      await loadComments(); // Recargar comentarios
    } catch (error) {
      console.error('Error adding comment:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const renderStars = (rating) => {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
  };

  if (loading) {
    return <div className="comment-section">Cargando comentarios...</div>;
  }

  return (
    <div className="comment-section">
      <h3>Comentarios ({comments.length})</h3>

      <form onSubmit={handleSubmit} className="comment-form">
        <div className="form-group">
          <input
            type="text"
            placeholder="Tu nombre"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <textarea
            placeholder="Escribe tu comentario..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <select
            value={rating}
            onChange={(e) => setRating(e.target.value)}
          >
            <option value="">Sin calificación</option>
            <option value="1">1 estrella</option>
            <option value="2">2 estrellas</option>
            <option value="3">3 estrellas</option>
            <option value="4">4 estrellas</option>
            <option value="5">5 estrellas</option>
          </select>
        </div>
        <button type="submit" disabled={submitting}>
          {submitting ? 'Enviando...' : 'Agregar comentario'}
        </button>
      </form>

      <div className="comments-list">
        {comments.length === 0 ? (
          <p>No hay comentarios aún. ¡Sé el primero en comentar!</p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="comment">
              <div className="comment-header">
                <strong>{comment.userName}</strong>
                {comment.rating && (
                  <span className="rating">{renderStars(comment.rating)}</span>
                )}
                <span className="date">
                  {new Date(comment.createdAt.seconds * 1000).toLocaleDateString()}
                </span>
              </div>
              <p>{comment.text}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CommentSection;