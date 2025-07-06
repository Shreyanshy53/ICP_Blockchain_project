import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';
import { X, Plus, Minus } from 'lucide-react';

interface CreateCourseModalProps {
  onClose: () => void;
}

const CreateCourseModal: React.FC<CreateCourseModalProps> = ({ onClose }) => {
  const { addCourse } = useData();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    duration: '',
    level: 'Beginner' as 'Beginner' | 'Intermediate' | 'Advanced',
    image: '',
    tags: [''],
  });
  const [lessons, setLessons] = useState([
    { title: '', content: '', duration: '' }
  ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const course = {
      ...formData,
      educator: user?.name || '',
      lessons: lessons.map((lesson, index) => ({
        id: (index + 1).toString(),
        ...lesson
      })),
      tags: formData.tags.filter(tag => tag.trim() !== ''),
    };

    addCourse(course);
    onClose();
  };

  const addLesson = () => {
    setLessons([...lessons, { title: '', content: '', duration: '' }]);
  };

  const removeLesson = (index: number) => {
    if (lessons.length > 1) {
      setLessons(lessons.filter((_, i) => i !== index));
    }
  };

  const updateLesson = (index: number, field: string, value: string) => {
    const newLessons = [...lessons];
    newLessons[index] = { ...newLessons[index], [field]: value };
    setLessons(newLessons);
  };

  const addTag = () => {
    setFormData({ ...formData, tags: [...formData.tags, ''] });
  };

  const removeTag = (index: number) => {
    if (formData.tags.length > 1) {
      setFormData({
        ...formData,
        tags: formData.tags.filter((_, i) => i !== index)
      });
    }
  };

  const updateTag = (index: number, value: string) => {
    const newTags = [...formData.tags];
    newTags[index] = value;
    setFormData({ ...formData, tags: newTags });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Create New Course</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Basic Information</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Course Title
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Duration
                </label>
                <input
                  type="text"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  placeholder="e.g., 3 hours"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Level
                </label>
                <select
                  value={formData.level}
                  onChange={(e) => setFormData({ ...formData, level: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Course Image URL
              </label>
              <input
                type="url"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                placeholder="https://example.com/image.jpg"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
              />
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tags
              </label>
              <div className="space-y-2">
                {formData.tags.map((tag, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={tag}
                      onChange={(e) => updateTag(index, e.target.value)}
                      placeholder="Enter tag"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                    <button
                      type="button"
                      onClick={() => removeTag(index)}
                      className="text-red-500 hover:text-red-700"
                      disabled={formData.tags.length === 1}
                    >
                      <Minus className="h-5 w-5" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addTag}
                  className="flex items-center space-x-1 text-purple-600 hover:text-purple-700"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Tag</span>
                </button>
              </div>
            </div>
          </div>

          {/* Lessons */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Lessons</h3>
            
            {lessons.map((lesson, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-gray-900">Lesson {index + 1}</h4>
                  <button
                    type="button"
                    onClick={() => removeLesson(index)}
                    className="text-red-500 hover:text-red-700"
                    disabled={lessons.length === 1}
                  >
                    <Minus className="h-5 w-5" />
                  </button>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    value={lesson.title}
                    onChange={(e) => updateLesson(index, 'title', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Content
                  </label>
                  <textarea
                    value={lesson.content}
                    onChange={(e) => updateLesson(index, 'content', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Duration
                  </label>
                  <input
                    type="text"
                    value={lesson.duration}
                    onChange={(e) => updateLesson(index, 'duration', e.target.value)}
                    placeholder="e.g., 15 min"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>
            ))}
            
            <button
              type="button"
              onClick={addLesson}
              className="flex items-center space-x-1 text-purple-600 hover:text-purple-700"
            >
              <Plus className="h-4 w-4" />
              <span>Add Lesson</span>
            </button>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Create Course
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateCourseModal;