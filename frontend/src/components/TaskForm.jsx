import React, { useState } from 'react';
import { X } from 'lucide-react';
import toast from 'react-hot-toast';
import { taskAPI } from '../services/api';

const TaskForm = ({ task, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    title: task?.title || '',
    description: task?.description || '',
    dueDate: task?.dueDate || '',
    status: task?.status || 'pending'
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.dueDate) {
      newErrors.dueDate = 'Due date is required';
    } else {
      const dueDate = new Date(formData.dueDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (dueDate < today) {
        newErrors.dueDate = 'Due date cannot be in the past';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

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
   if (errors[field]) {
     setErrors(prev => ({ ...prev, [field]: '' }));
   }
 };

 return (
   <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
     <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
       <div className="flex items-center justify-between mb-6">
         <h2 className="text-2xl font-bold text-gray-900">
           {task ? 'Edit Task' : 'Add New Task'}
         </h2>
         <button
           onClick={onCancel}
           className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
         >
           <X className="w-5 h-5 text-gray-400" />
         </button>
       </div>

       <form onSubmit={handleSubmit} className="space-y-6">
         <div>
           <label className="block text-sm font-medium text-gray-700 mb-2">
             Title *
           </label>
           <input
             type="text"
             value={formData.title}
             onChange={(e) => handleChange('title', e.target.value)}
             className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors ${
               errors.title ? 'border-red-300' : 'border-gray-300'
             }`}
             placeholder="Enter task title"
             maxLength="200"
           />
           {errors.title && (
             <p className="mt-1 text-sm text-red-600">{errors.title}</p>
           )}
         </div>

         <div>
           <label className="block text-sm font-medium text-gray-700 mb-2">
             Description
           </label>
           <textarea
             value={formData.description}
             onChange={(e) => handleChange('description', e.target.value)}
             rows="3"
             className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors resize-none"
             placeholder="Enter task description (optional)"
             maxLength="1000"
           />
           <div className="mt-1 text-xs text-gray-500 text-right">
             {formData.description.length}/1000
           </div>
         </div>

         <div>
           <label className="block text-sm font-medium text-gray-700 mb-2">
             Due Date *
           </label>
           <input
             type="date"
             value={formData.dueDate}
             onChange={(e) => handleChange('dueDate', e.target.value)}
             min={new Date().toISOString().split('T')[0]}
             className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors ${
               errors.dueDate ? 'border-red-300' : 'border-gray-300'
             }`}
           />
           {errors.dueDate && (
             <p className="mt-1 text-sm text-red-600">{errors.dueDate}</p>
           )}
         </div>

         {task && (
           <div>
             <label className="block text-sm font-medium text-gray-700 mb-2">
               Status
             </label>
             <select
               value={formData.status}
               onChange={(e) => handleChange('status', e.target.value)}
               className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
             >
               <option value="pending">Pending</option>
               <option value="completed">Completed</option>
             </select>
           </div>
         )}

         <div className="flex gap-4 pt-4">
           <button
             type="button"
             onClick={onCancel}
             className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
           >
             Cancel
           </button>
           <button
             type="submit"
             disabled={loading}
             className="flex-1 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium transition-colors disabled:opacity-50"
           >
             {loading ? 'Saving...' : (task ? 'Update Task' : 'Create Task')}
           </button>
         </div>
       </form>
     </div>
   </div>
 );
};

export default TaskForm;