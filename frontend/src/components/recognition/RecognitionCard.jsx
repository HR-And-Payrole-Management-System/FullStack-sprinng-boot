import { useState } from 'react';
import { Heart } from 'lucide-react';
import { recognitionApi } from '../../api/recognition.api';
import { useAuth } from '../../context/AuthContext';

export default function RecognitionCard({ recognition, onUpdated }) {
  const { user } = useAuth();
  const [liking, setLiking] = useState(false);

  const handleLike = async () => {
    setLiking(true);
    try {
      await recognitionApi.toggleLike(recognition.id, user.employeeId);
      onUpdated();
    } finally {
      setLiking(false);
    }
  };

  return (
    <div className="ent-card p-3 mb-3">
      <div className="d-flex justify-content-between align-items-start">
        <div>
          <span className="fw-semibold">{recognition.giverName}</span>
          <span className="text-muted"> recognized </span>
          <span className="fw-semibold">{recognition.receiverName}</span>
          {recognition.coreValueName && (
            <span className="badge bg-light text-dark border ms-2">{recognition.coreValueIcon} {recognition.coreValueName}</span>
          )}
        </div>
        <span className="badge bg-primary">+{recognition.points} pts</span>
      </div>
      <div className="mt-2">{recognition.message}</div>
      <div className="d-flex align-items-center gap-2 mt-2">
        <button className="btn btn-sm btn-light d-flex align-items-center gap-1" onClick={handleLike} disabled={liking}>
          <Heart size={14} /> {recognition.likeCount}
        </button>
        <span className="text-muted small">{new Date(recognition.createdAt).toLocaleDateString()}</span>
      </div>
    </div>
  );
}