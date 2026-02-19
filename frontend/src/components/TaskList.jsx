import React, { useState, useEffect } from 'react';
import { Plus, Calendar, CheckCircle, Circle, Trash2, Edit3 } from 'lucide-react';
import { format, isToday, isPast } from 'date-fns';
import toast from 'react-hot-toast';
import { taskAPI } from '../services/api';
import TaskForm from './TaskForm';

const taskListStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap');

  .tl-root {
    font-family: 'DM Sans', sans-serif;
    margin: 0 auto;
    padding: 2.5rem 1.5rem;
     background: #000000;
     height: 100vh;
  }

  /* ── Header ── */
  .tl-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 2rem;
    animation: tlFadeUp 0.4s ease both;
  }

  .tl-heading {
    font-family: 'Syne', sans-serif;
    font-size: 2rem;
    font-weight: 800;
    color: #fff;
    margin: 0;
  }

  .tl-heading span {
    background: linear-gradient(90deg, #c8f135, #38bdf8);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .tl-add-btn {
    display: flex;
    align-items: center;
    gap: 7px;
    padding: 11px 20px;
    border-radius: 13px;
    background: #c8f135;
    color: #080a0f;
    font-family: 'Syne', sans-serif;
    font-size: 0.88rem;
    font-weight: 700;
    border: none;
    cursor: pointer;
    transition: transform 0.2s, box-shadow 0.2s;
    box-shadow: 0 0 26px rgba(200,241,53,0.3);
    white-space: nowrap;
  }

  .tl-add-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 0 44px rgba(200,241,53,0.5);
  }

  .tl-add-btn svg { width: 16px; height: 16px; }

  /* ── Filter tabs ── */
  .tl-filters {
    display: flex;
    gap: 8px;
    margin-bottom: 1.75rem;
    animation: tlFadeUp 0.4s 0.05s ease both;
    flex-wrap: wrap;
  }

  .tl-filter-btn {
    display: flex;
    align-items: center;
    gap: 7px;
    padding: 8px 16px;
    border-radius: 11px;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.82rem;
    font-weight: 600;
    border: 1px solid rgba(255,255,255,0.08);
    background: rgba(255,255,255,0.04);
    color: #64748b;
    cursor: pointer;
    transition: all 0.18s;
  }

  .tl-filter-btn:hover {
    background: rgba(255,255,255,0.08);
    color: #94a3b8;
  }

  .tl-filter-btn.active {
    background: rgba(200,241,53,0.1);
    border-color: rgba(200,241,53,0.3);
    color: #c8f135;
  }

  .tl-filter-count {
    font-size: 0.7rem;
    font-weight: 700;
    padding: 2px 7px;
    border-radius: 999px;
    background: rgba(255,255,255,0.07);
    color: #475569;
  }

  .tl-filter-btn.active .tl-filter-count {
    background: rgba(200,241,53,0.15);
    color: #c8f135;
  }

  /* ── Loading ── */
  .tl-loading {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 200px;
  }

  .tl-spin {
    width: 40px; height: 40px;
    border: 3px solid rgba(200,241,53,0.15);
    border-top-color: #c8f135;
    border-radius: 50%;
    animation: tlSpin 0.7s linear infinite;
  }

  @keyframes tlSpin { to { transform: rotate(360deg); } }

  /* ── Empty state ── */
  .tl-empty {
    text-align: center;
    padding: 4rem 1rem;
    animation: tlFadeUp 0.4s ease both;
  }

  .tl-empty-icon {
    font-size: 3rem;
    margin-bottom: 1rem;
    opacity: 0.4;
  }

  .tl-empty h3 {
    font-family: 'Syne', sans-serif;
    font-size: 1.2rem;
    font-weight: 700;
    color: #f1f5f9;
    margin: 0 0 0.4rem;
  }

  .tl-empty p {
    color: #475569;
    font-size: 0.88rem;
    margin: 0 0 1.5rem;
  }

  .tl-empty-btn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 11px 22px;
    border-radius: 12px;
    background: rgba(200,241,53,0.1);
    border: 1px solid rgba(200,241,53,0.28);
    color: #c8f135;
    font-family: 'Syne', sans-serif;
    font-size: 0.88rem;
    font-weight: 700;
    cursor: pointer;
    transition: background 0.2s, transform 0.2s;
  }

  .tl-empty-btn:hover {
    background: rgba(200,241,53,0.18);
    transform: translateY(-2px);
  }

  /* ── Task cards ── */
  .tl-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .tl-card {
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.08);
    border-left: 3px solid transparent;
    border-radius: 16px;
    padding: 1.1rem 1.25rem;
    display: flex;
    align-items: flex-start;
    gap: 14px;
    transition: transform 0.2s, box-shadow 0.2s, background 0.2s;
    animation: tlFadeUp 0.35s ease both;
    backdrop-filter: blur(8px);
  }

  .tl-card:hover {
    background: rgba(255,255,255,0.06);
    transform: translateX(3px);
  }

  /* Priority border colors */
  .tl-card.overdue   { border-left-color: #ef4444; box-shadow: -2px 0 12px rgba(239,68,68,0.1); }
  .tl-card.today     { border-left-color: #fbbf24; box-shadow: -2px 0 12px rgba(251,191,36,0.1); }
  .tl-card.completed { border-left-color: #4ade80; box-shadow: -2px 0 12px rgba(74,222,128,0.08); opacity: 0.7; }
  .tl-card.upcoming  { border-left-color: #38bdf8; box-shadow: -2px 0 12px rgba(56,189,248,0.08); }

  /* Toggle button */
  .tl-toggle {
    flex-shrink: 0;
    background: none;
    border: none;
    cursor: pointer;
    padding: 2px;
    color: #334155;
    transition: color 0.2s, transform 0.2s;
    margin-top: 2px;
  }

  .tl-toggle:hover { transform: scale(1.15); }
  .tl-toggle.done  { color: #4ade80; }
  .tl-toggle.pending:hover { color: #4ade80; }
  .tl-toggle svg { width: 22px; height: 22px; }

  /* Card body */
  .tl-body { flex: 1; min-width: 0; }

  .tl-top {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 10px;
  }

  .tl-task-title {
    font-family: 'Syne', sans-serif;
    font-size: 0.98rem;
    font-weight: 700;
    color: #f1f5f9;
    margin: 0 0 0.25rem;
    line-height: 1.3;
  }

  .tl-task-title.done {
    color: #334155;
    text-decoration: line-through;
  }

  .tl-task-desc {
    font-size: 0.82rem;
    color: #475569;
    line-height: 1.5;
    margin: 0;
  }

  /* Actions */
  .tl-actions {
    display: flex;
    gap: 4px;
    flex-shrink: 0;
  }

  .tl-icon-btn {
    width: 32px; height: 32px;
    border-radius: 9px;
    background: none;
    border: 1px solid transparent;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer;
    color: #475569;
    transition: all 0.18s;
  }

  .tl-icon-btn svg { width: 14px; height: 14px; }

  .tl-icon-btn.edit:hover {
    background: rgba(56,189,248,0.1);
    border-color: rgba(56,189,248,0.25);
    color: #38bdf8;
  }

  .tl-icon-btn.del:hover {
    background: rgba(239,68,68,0.1);
    border-color: rgba(239,68,68,0.25);
    color: #ef4444;
  }

  /* Meta row */
  .tl-meta {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-top: 0.65rem;
    flex-wrap: wrap;
  }

  .tl-date {
    display: flex;
    align-items: center;
    gap: 5px;
    font-size: 0.75rem;
    color: #475569;
  }

  .tl-date svg { width: 12px; height: 12px; }
  .tl-date.overdue  { color: #ef4444; font-weight: 600; }
  .tl-date.today    { color: #fbbf24; font-weight: 600; }

  .tl-badge {
    font-size: 0.65rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    padding: 3px 9px;
    border-radius: 999px;
  }

  .tl-badge.overdue   { background: rgba(239,68,68,0.12); color: #f87171; border: 1px solid rgba(239,68,68,0.2); }
  .tl-badge.today     { background: rgba(251,191,36,0.12); color: #fbbf24; border: 1px solid rgba(251,191,36,0.2); }
  .tl-badge.completed { background: rgba(74,222,128,0.12); color: #4ade80; border: 1px solid rgba(74,222,128,0.2); }
  .tl-badge.upcoming  { background: rgba(56,189,248,0.12); color: #38bdf8; border: 1px solid rgba(56,189,248,0.2); }

  @keyframes tlFadeUp {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0); }
  }
`;

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  useEffect(() => {
    if (document.getElementById('task-list-styles')) return;
    const s = document.createElement('style');
    s.id = 'task-list-styles';
    s.textContent = taskListStyles;
    document.head.appendChild(s);
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await taskAPI.getTasks({ sortBy: 'dueDate', order: 'asc' });
      setTasks(response.data);
    } catch (error) {
      toast.error('Failed to fetch tasks');
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTasks(); }, []);

  useEffect(() => {
    setFilteredTasks(filter === 'all' ? tasks : tasks.filter(t => t.status === filter));
  }, [tasks, filter]);

  const handleToggleTask = async (taskId) => {
    try {
      const response = await taskAPI.toggleTask(taskId);
      setTasks(tasks.map(t => t.id === taskId ? response.data : t));
      toast.success(response.data.status === 'completed' ? 'Task completed! 🎉' : 'Task marked pending');
    } catch (error) {
      toast.error('Failed to update task');
      console.error('Error toggling task:', error);
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    try {
      await taskAPI.deleteTask(taskId);
      setTasks(tasks.filter(t => t.id !== taskId));
      toast.success('Task deleted');
    } catch (error) {
      toast.error('Failed to delete task');
      console.error('Error deleting task:', error);
    }
  };

  const handleFormSubmit = () => {
    setShowForm(false);
    setEditingTask(null);
    fetchTasks();
  };

  const getTaskPriority = (dueDate, status) => {
    if (status === 'completed') return 'completed';
    const due = new Date(dueDate);
    if (isPast(due) && !isToday(due)) return 'overdue';
    if (isToday(due)) return 'today';
    return 'upcoming';
  };

  const formatDueDate = (dueDate) => {
    const date = new Date(dueDate);
    if (isToday(date)) return 'Today';
    return format(date, 'MMM dd, yyyy');
  };

  const BADGE_LABELS = {
    overdue: 'Overdue',
    today: 'Due Today',
    completed: 'Completed',
    upcoming: 'Pending',
  };

  const filters = [
    { key: 'all',       label: 'All',       count: tasks.length },
    { key: 'pending',   label: 'Pending',   count: tasks.filter(t => t.status === 'pending').length },
    { key: 'completed', label: 'Completed', count: tasks.filter(t => t.status === 'completed').length },
  ];

  if (loading) {
    return (
      <div className="tl-loading">
        <div className="tl-spin" />
      </div>
    );
  }

  return (
    <div className="tl-root">
      {/* Header */}
      <div className="tl-header">
        <h1 className="tl-heading">My <span>Tasks</span></h1>
        <button className="tl-add-btn" onClick={() => setShowForm(true)}>
          <Plus /> Add Task
        </button>
      </div>

      {/* Filters */}
      <div className="tl-filters">
        {filters.map(({ key, label, count }) => (
          <button
            key={key}
            className={`tl-filter-btn${filter === key ? ' active' : ''}`}
            onClick={() => setFilter(key)}
          >
            {label}
            <span className="tl-filter-count">{count}</span>
          </button>
        ))}
      </div>

      {/* List */}
      {filteredTasks.length === 0 ? (
        <div className="tl-empty">
          <div className="tl-empty-icon">✦</div>
          <h3>{filter === 'all' ? 'No tasks yet' : `No ${filter} tasks`}</h3>
          <p>
            {filter === 'all'
              ? 'Create your first task to get started!'
              : `No ${filter} tasks found.`}
          </p>
          {filter === 'all' && (
            <button className="tl-empty-btn" onClick={() => setShowForm(true)}>
              <Plus size={14} /> Create Task
            </button>
          )}
        </div>
      ) : (
        <div className="tl-list">
          {filteredTasks.map((task, i) => {
            const priority = getTaskPriority(task.dueDate, task.status);
            return (
              <div
                key={task.id}
                className={`tl-card ${priority}`}
                style={{ animationDelay: `${i * 0.04}s` }}
              >
                {/* Toggle */}
                <button
                  className={`tl-toggle ${task.status === 'completed' ? 'done' : 'pending'}`}
                  onClick={() => handleToggleTask(task.id)}
                >
                  {task.status === 'completed'
                    ? <CheckCircle />
                    : <Circle />}
                </button>

                {/* Body */}
                <div className="tl-body">
                  <div className="tl-top">
                    <div>
                      <p className={`tl-task-title${task.status === 'completed' ? ' done' : ''}`}>
                        {task.title}
                      </p>
                      {task.description && (
                        <p className="tl-task-desc">{task.description}</p>
                      )}
                    </div>

                    {/* Action buttons */}
                    <div className="tl-actions">
                      <button
                        className="tl-icon-btn edit"
                        onClick={() => { setEditingTask(task); setShowForm(true); }}
                      >
                        <Edit3 />
                      </button>
                      <button
                        className="tl-icon-btn del"
                        onClick={() => handleDeleteTask(task.id)}
                      >
                        <Trash2 />
                      </button>
                    </div>
                  </div>

                  {/* Meta */}
                  <div className="tl-meta">
                    <span className={`tl-date ${priority === 'overdue' || priority === 'today' ? priority : ''}`}>
                      <Calendar />
                      {formatDueDate(task.dueDate)}
                    </span>
                    <span className={`tl-badge ${priority}`}>
                      {BADGE_LABELS[priority]}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Task Form Modal */}
      {showForm && (
        <TaskForm
          task={editingTask}
          onSubmit={handleFormSubmit}
          onCancel={() => { setShowForm(false); setEditingTask(null); }}
        />
      )}
    </div>
  );
};

export default TaskList;