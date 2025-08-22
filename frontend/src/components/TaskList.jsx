import React, { useState, useEffect } from 'react';
import { Plus, Calendar, CheckCircle, Circle, Trash2, Edit3, Filter } from 'lucide-react';
import { format, isToday, isPast } from 'date-fns';
import toast from 'react-hot-toast';
import { taskAPI } from '../services/api';
import TaskForm from './TaskForm';

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

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

  useEffect(() => {
    fetchTasks();
  }, []);

  useEffect(() => {
    let filtered = tasks;
    
    if (filter !== 'all') {
      filtered = tasks.filter(task => task.status === filter);
    }
    
    setFilteredTasks(filtered);
  }, [tasks, filter]);

  const handleToggleTask = async (taskId, currentStatus) => {
    try {
      const response = await taskAPI.toggleTask(taskId);
      setTasks(tasks.map(task => 
        task.id === taskId ? response.data : task
      ));
      toast.success(
        response.data.status === 'completed' 
          ? 'Task marked as completed!' 
          : 'Task marked as pending!'
      );
    } catch (error) {
      toast.error('Failed to update task');
      console.error('Error toggling task:', error);
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) {
      return;
    }

    try {
      await taskAPI.deleteTask(taskId);
      setTasks(tasks.filter(task => task.id !== taskId));
      toast.success('Task deleted successfully!');
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

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'overdue': return 'border-l-red-500 bg-red-50';
      case 'today': return 'border-l-yellow-500 bg-yellow-50';
      case 'completed': return 'border-l-green-500 bg-green-50';
      default: return 'border-l-blue-500 bg-blue-50';
    }
  };

  const formatDueDate = (dueDate) => {
    const date = new Date(dueDate);
    if (isToday(date)) return 'Today';
    return format(date, 'MMM dd, yyyy');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Tasks</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 flex items-center gap-2 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Task
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-6">
        {[
          { key: 'all', label: 'All Tasks', count: tasks.length },
          { key: 'pending', label: 'Pending', count: tasks.filter(t => t.status === 'pending').length },
          { key: 'completed', label: 'Completed', count: tasks.filter(t => t.status === 'completed').length }
        ].map(({ key, label, count }) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
              filter === key
                ? 'bg-indigo-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
            }`}
          >
            <Filter className="w-4 h-4" />
            {label}
            <span className={`px-2 py-1 rounded-full text-xs ${
              filter === key ? 'bg-indigo-500' : 'bg-gray-100 text-gray-600'
            }`}>
              {count}
            </span>
          </button>
        ))}
      </div>

      {/* Task List */}
      <div className="space-y-4">
        {filteredTasks.length === 0 ? (
          <div className="text-center py-12">
            <CheckCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {filter === 'all' ? 'No tasks yet' : `No ${filter} tasks`}
            </h3>
            <p className="text-gray-500 mb-6">
              {filter === 'all' 
                ? 'Create your first task to get started!' 
                : `No ${filter} tasks found.`}
            </p>
            {filter === 'all' && (
              <button
                onClick={() => setShowForm(true)}
                className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Create Task
              </button>
            )}
          </div>
        ) : (
          filteredTasks.map((task) => {
            const priority = getTaskPriority(task.dueDate, task.status);
            return (
              <div
                key={task.id}
                className={`bg-white rounded-lg shadow-sm border border-gray-200 border-l-4 p-6 hover:shadow-md transition-shadow ${getPriorityColor(priority)}`}
              >
                <div className="flex items-start gap-4">
                  <button
                    onClick={() => handleToggleTask(task.id, task.status)}
                    className="flex-shrink-0 mt-1"
                  >
                    {task.status === 'completed' ? (
                      <CheckCircle className="w-6 h-6 text-green-500" />
                    ) : (
                      <Circle className="w-6 h-6 text-gray-400 hover:text-green-500 transition-colors" />
                    )}
                  </button>

                  <div className="flex-grow">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className={`text-lg font-semibold ${
                          task.status === 'completed' 
                            ? 'text-gray-500 line-through' 
                            : 'text-gray-900'
                        }`}>
                          {task.title}
                        </h3>
                        {task.description && (
                          <p className={`mt-2 ${
                            task.status === 'completed' 
                              ? 'text-gray-400' 
                              : 'text-gray-600'
                          }`}>
                            {task.description}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center gap-2 ml-4">
                        <button
                          onClick={() => {
                            setEditingTask(task);
                            setShowForm(true);
                          }}
                          className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteTask(task.id)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 mt-4 text-sm">
                      <div className="flex items-center gap-1 text-gray-500">
                        <Calendar className="w-4 h-4" />
                        <span className={
                          priority === 'overdue' ? 'text-red-600 font-medium' :
                          priority === 'today' ? 'text-yellow-600 font-medium' :
                          'text-gray-500'
                        }>
                          Due: {formatDueDate(task.dueDate)}
                        </span>
                      </div>
                      
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        task.status === 'completed'
                          ? 'bg-green-100 text-green-800'
                          : priority === 'overdue'
                          ? 'bg-red-100 text-red-800'
                          : priority === 'today'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {task.status === 'completed' ? 'Completed' :
                         priority === 'overdue' ? 'Overdue' :
                         priority === 'today' ? 'Due Today' : 'Pending'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Task Form Modal */}
      {showForm && (
        <TaskForm
          task={editingTask}
          onSubmit={handleFormSubmit}
          onCancel={() => {
            setShowForm(false);
            setEditingTask(null);
          }}
        />
      )}
    </div>
  );
};

export default TaskList;