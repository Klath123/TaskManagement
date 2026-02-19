import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import toast from 'react-hot-toast';
import { taskAPI } from '../services/api';

const taskFormStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap');

  .tf-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.7);
    backdrop-filter: blur(6px);
    -webkit-backdrop-filter: blur(6px);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1rem;
    z-index: 50;
    animation: tfOverlayIn 0.2s ease both;
  }

  @keyframes tfOverlayIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }

  .tf-card {
    font-family: 'DM Sans', sans-serif;
    background: #13161f;
    border: 1px solid rgba(255,255,255,0.09);
    border-radius: 24px;
    padding: 2rem;
    width: 100%;
    max-width: 460px;
    max-height: 90vh;
    overflow-y: auto;
    box-shadow: 0 30px 80px rgba(0,0,0,0.6);
    animation: tfCardIn 0.3s cubic-bezier(0.34,1.2,0.64,1) both;
    scrollbar-width: none;
  }

  .tf-card::-webkit-scrollbar { display: none; }

  @keyframes tfCardIn {
    from { opacity: 0; transform: translateY(30px) scale(0.97); }
    to   { opacity: 1; transform: translateY(0) scale(1); }
  }

  /* Header */
  .tf-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 1.75rem;
  }

  .tf-title {
    font-family: 'Syne', sans-serif;
    font-size: 1.4rem;
    font-weight: 800;
    color: #fff;
    margin: 0;
  }

  .tf-close {
    width: 34px; height: 34px;
    border-radius: 10px;
    background: rgba(255,255,255,0.06);
    border: 1px solid rgba(255,255,255,0.08);
    display: flex; align-items: center; justify-content: center;
    cursor: pointer;
    color: #64748b;
    transition: background 0.2s, color 0.2s;
    flex-shrink: 0;
  }

  .tf-close:hover {
    background: rgba(239,68,68,0.12);
    color: #f87171;
    border-color: rgba(239,68,68,0.2);
  }

  .tf-close svg { width: 16px; height: 16px; }

  /* Form */
  .tf-form {
    display: flex;
    flex-direction: column;
    gap: 1.1rem;
  }

  .tf-field label {
    display: block;
    font-size: 0.72rem;
    font-weight: 600;
    color: #64748b;
    text-transform: uppercase;
    letter-spacing: 0.07em;
    margin-bottom: 0.45rem;
  }

  .tf-input,
  .tf-textarea,
  .tf-select {
    width: 100%;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.09);
    border-radius: 12px;
    padding: 11px 14px;
    color: #f1f5f9;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.9rem;
    outline: none;
    transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
    box-sizing: border-box;
  }

  .tf-input::placeholder,
  .tf-textarea::placeholder { color: #2d3748; }

  .tf-input:focus,
  .tf-textarea:focus,
  .tf-select:focus {
    border-color: rgba(200,241,53,0.45);
    box-shadow: 0 0 0 3px rgba(200,241,53,0.08);
    background: rgba(255,255,255,0.06);
  }

  .tf-input.error,
  .tf-textarea.error,
  .tf-select.error {
    border-color: rgba(239,68,68,0.45);
    box-shadow: 0 0 0 3px rgba(239,68,68,0.07);
  }

  .tf-textarea {
    resize: none;
    line-height: 1.6;
  }

  /* Date input calendar icon color fix */
  .tf-input[type="date"]::-webkit-calendar-picker-indicator {
    filter: invert(0.4);
    cursor: pointer;
  }

  /* Select arrow */
  .tf-select {
    appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 14px center;
    padding-right: 36px;
    cursor: pointer;
  }

  .tf-select option {
    background: #13161f;
    color: #f1f5f9;
  }

  /* Character count */
  .tf-char-count {
    text-align: right;
    font-size: 0.7rem;
    color: #334155;
    margin-top: 4px;
  }

  /* Error message */
  .tf-error {
    margin-top: 5px;
    font-size: 0.75rem;
    color: #f87171;
  }

  /* Status badges in select-like display */
  .tf-status-row {
    display: flex;
    gap: 8px;
  }

  .tf-status-opt {
    flex: 1;
    padding: 10px;
    border-radius: 11px;
    border: 1px solid rgba(255,255,255,0.08);
    background: rgba(255,255,255,0.03);
    color: #64748b;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.82rem;
    font-weight: 500;
    cursor: pointer;
    text-align: center;
    transition: all 0.18s;
  }

  .tf-status-opt:hover {
    background: rgba(255,255,255,0.07);
  }

  .tf-status-opt.selected-pending {
    background: rgba(251,191,36,0.1);
    border-color: rgba(251,191,36,0.35);
    color: #fbbf24;
  }

  .tf-status-opt.selected-completed {
    background: rgba(74,222,128,0.1);
    border-color: rgba(74,222,128,0.35);
    color: #4ade80;
  }

  /* Divider */
  .tf-divider {
    height: 1px;
    background: rgba(255,255,255,0.06);
    margin: 0.3rem 0;
  }

  /* Footer buttons */
  .tf-footer {
    display: flex;
    gap: 10px;
    margin-top: 0.5rem;
  }

  .tf-btn-cancel {
    flex: 1;
    padding: 12px;
    border-radius: 12px;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.09);
    color: #64748b;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.88rem;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.2s, color 0.2s;
  }

  .tf-btn-cancel:hover {
    background: rgba(255,255,255,0.08);
    color: #94a3b8;
  }

  .tf-btn-submit {
    flex: 1;
    padding: 12px;
    border-radius: 12px;
    background: #c8f135;
    color: #0f1117;
    font-family: 'Syne', sans-serif;
    font-size: 0.9rem;
    font-weight: 700;
    border: none;
    cursor: pointer;
    transition: transform 0.2s, box-shadow 0.2s, opacity 0.2s;
    box-shadow: 0 0 24px rgba(200,241,53,0.3);
  }

  .tf-btn-submit:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 0 44px rgba(200,241,53,0.5);
  }

  .tf-btn-submit:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }

  .tf-spinner {
    display: inline-block;
    width: 12px; height: 12px;
    border: 2px solid rgba(15,17,23,0.25);
    border-top-color: #0f1117;
    border-radius: 50%;
    animation: tfSpin 0.7s linear infinite;
    margin-right: 7px;
    vertical-align: middle;
  }

  @keyframes tfSpin { to { transform: rotate(360deg); } }
`;

const TaskForm = ({ task, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    title: task?.title || '',
    description: task?.description || '',
    dueDate: task?.dueDate || '',
    status: task?.status || 'pending',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (document.getElementById('task-form-styles')) return;
    const s = document.createElement('style');
    s.id = 'task-form-styles';
    s.textContent = taskFormStyles;
    document.head.appendChild(s);
  }, []);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.dueDate) {
      newErrors.dueDate = 'Due date is required';
    } else {
      const dueDate = new Date(formData.dueDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (dueDate < today) newErrors.dueDate = 'Due date cannot be in the past';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    try {
      if (task) {
        await taskAPI.updateTask(task.id, formData);
        toast.success('Task updated successfully!');
      } else {
        await taskAPI.createTask(formData);
        toast.success('Task created successfully!');
      }
      onSubmit();
    } catch (error) {
      toast.error(task ? 'Failed to update task' : 'Failed to create task');
      console.error('Form submission error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  };

  return (
    <div className="tf-overlay">
      <div className="tf-card">
        {/* Header */}
        <div className="tf-header">
          <h2 className="tf-title">{task ? '✏️ Edit Task' : '✦ New Task'}</h2>
          <button className="tf-close" onClick={onCancel} type="button">
            <X />
          </button>
        </div>

        <form className="tf-form" onSubmit={handleSubmit}>
          {/* Title */}
          <div className="tf-field">
            <label>Title *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              className={`tf-input${errors.title ? ' error' : ''}`}
              placeholder="What needs to be done?"
              maxLength="200"
            />
            {errors.title && <p className="tf-error">⚠ {errors.title}</p>}
          </div>

          {/* Description */}
          <div className="tf-field">
            <label>Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              rows="3"
              className="tf-textarea"
              placeholder="Add some details… (optional)"
              maxLength="1000"
            />
            <div className="tf-char-count">{formData.description.length} / 1000</div>
          </div>

          {/* Due Date */}
          <div className="tf-field">
            <label>Due Date *</label>
            <input
              type="date"
              value={formData.dueDate}
              onChange={(e) => handleChange('dueDate', e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className={`tf-input${errors.dueDate ? ' error' : ''}`}
            />
            {errors.dueDate && <p className="tf-error">⚠ {errors.dueDate}</p>}
          </div>

          {/* Status (edit mode only) */}
          {task && (
            <div className="tf-field">
              <label>Status</label>
              <div className="tf-status-row">
                {['pending', 'completed'].map((s) => (
                  <button
                    key={s}
                    type="button"
                    className={`tf-status-opt${formData.status === s ? ` selected-${s}` : ''}`}
                    onClick={() => handleChange('status', s)}
                  >
                    {s === 'pending' ? '🕐 Pending' : '✅ Completed'}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="tf-divider" />

          {/* Footer */}
          <div className="tf-footer">
            <button type="button" className="tf-btn-cancel" onClick={onCancel}>
              Cancel
            </button>
            <button type="submit" className="tf-btn-submit" disabled={loading}>
              {loading && <span className="tf-spinner" />}
              {loading ? 'Saving…' : task ? 'Update Task' : 'Create Task →'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskForm;