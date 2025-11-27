import { useState, useEffect } from 'react';
import { getCommentsByItemId, createCommentDoc } from '../assets/services/commentsService.js';

const CommentSection = ({ itemId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [userName, setUserName] = useState('');
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
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
    if (!newComment.trim() || !userName.trim() || rating === 0) {
      alert('Por favor completa todos los campos y selecciona una puntuación');
      return;
    }

    setSubmitting(true);
    try {
      const commentData = {
        itemId,
        userName: userName.trim(),
        text: newComment.trim(),
        rating: rating
      };
      await createCommentDoc(commentData);
      setNewComment('');
      setUserName('');
      setRating(0);
      await loadComments();
    } catch (error) {
      console.error('Error adding comment:', error);
      alert('Error al agregar comentario');
    } finally {
      setSubmitting(false);
    }
  };

  const renderStars = (rating) => {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
  };

  // Calcular puntuación media
  const calculateAverageRating = () => {
    if (comments.length === 0) return 0;
    const sum = comments.reduce((acc, comment) => acc + (comment.rating || 0), 0);
    return (sum / comments.length).toFixed(1);
  };

  if (loading) {
    return <div className="comment-section loading">Cargando comentarios...</div>;
  }

  const avgRating = calculateAverageRating();

  return (
    <div className="comment-section">
      <div className="comment-section-header">
        <h3>Valoraciones y Comentarios</h3>
        {comments.length > 0 && (
          <div className="average-rating">
            <span className="avg-number">{avgRating}</span>
            <span className="avg-stars">{renderStars(Math.round(avgRating))}</span>
            <span className="avg-count">({comments.length} {comments.length === 1 ? 'valoración' : 'valoraciones'})</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="comment-form">
        <div className="form-group">
          <label>Tu nombre *</label>
          <input
            type="text"
            placeholder="Introduce tu nombre"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            maxLength={30}
            required
          />
        </div>

        <div className="form-group">
          <label>Tu puntuación *</label>
          <div className="star-rating">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                className={`star ${star <= (hoverRating || rating) ? 'active' : ''}`}
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
              >
                ★
              </button>
            ))}
            <span className="rating-text">
              {rating > 0 ? `${rating} estrella${rating !== 1 ? 's' : ''}` : 'Selecciona tu puntuación'}
            </span>
          </div>
        </div>

        <div className="form-group">
          <label>Tu comentario *</label>
          <textarea
            placeholder="Escribe tu opinión sobre este contenido..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            maxLength={500}
            rows={4}
            required
          />
          <span className="char-count">{newComment.length}/500</span>
        </div>

        <button type="submit" disabled={submitting} className="submit-comment-btn">
          {submitting ? 'Enviando...' : '📝 Publicar comentario'}
        </button>
      </form>

      <div className="comments-list">
        <h4 className="comments-title">
          {comments.length === 0 ? 'Sin comentarios' : `Todos los comentarios (${comments.length})`}
        </h4>
        
        {comments.length === 0 ? (
          <div className="no-comments">
            <p>🎮 ¡Sé el primero en dejar tu opinión!</p>
          </div>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="comment">
              <div className="comment-header">
                <div className="comment-user">
                  <span className="user-icon">👤</span>
                  <strong>{comment.userName}</strong>
                </div>
                <div className="comment-meta">
                  {comment.rating && (
                    <span className="comment-rating">{renderStars(comment.rating)}</span>
                  )}
                  <span className="comment-date">
                    {new Date(comment.createdAt.seconds * 1000).toLocaleDateString('es-ES', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </span>
                </div>
              </div>
              <p className="comment-text">{comment.text}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CommentSection;