import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';
import { X, Plus, Trash2, Book, Zap, Heart, Brain, Target, Dumbbell } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface Task {
  id: number;
  text: string;
  xpValue: number;
}

interface NewHabit {
  name: string;
  icon: string;
  color: string;
  tasks: Task[];
}

interface AddHabitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (habit: NewHabit) => void;
  availableSlots: number;
  usedSlots: number;
}

const HABIT_ICONS = [
  { icon: Book, name: 'book', color: 'purple' },
  { icon: Zap, name: 'zap', color: 'green' },
  { icon: Heart, name: 'heart', color: 'red' },
  { icon: Brain, name: 'brain', color: 'blue' },
  { icon: Target, name: 'target', color: 'orange' },
  { icon: Dumbbell, name: 'dumbbell', color: 'cyan' }
];

const HABIT_COLORS = [
  { name: 'Purple', value: 'purple', bg: 'bg-purple-600/20', text: 'text-purple-400', border: 'border-purple-500/30' },
  { name: 'Green', value: 'green', bg: 'bg-green-600/20', text: 'text-green-400', border: 'border-green-500/30' },
  { name: 'Blue', value: 'blue', bg: 'bg-blue-600/20', text: 'text-blue-400', border: 'border-blue-500/30' },
  { name: 'Orange', value: 'orange', bg: 'bg-orange-600/20', text: 'text-orange-400', border: 'border-orange-500/30' },
  { name: 'Red', value: 'red', bg: 'bg-red-600/20', text: 'text-red-400', border: 'border-red-500/30' },
  { name: 'Cyan', value: 'cyan', bg: 'bg-cyan-600/20', text: 'text-cyan-400', border: 'border-cyan-500/30' }
];

export function AddHabitModal({ isOpen, onClose, onSave, availableSlots, usedSlots }: AddHabitModalProps) {
  const [habitName, setHabitName] = useState('');
  const [selectedIcon, setSelectedIcon] = useState('book');
  const [selectedColor, setSelectedColor] = useState('purple');
  const [tasks, setTasks] = useState<Task[]>([
    { id: 1, text: '', xpValue: 10 }
  ]);

  const canAddSlot = usedSlots < availableSlots;

  const resetForm = () => {
    setHabitName('');
    setSelectedIcon('book');
    setSelectedColor('purple');
    setTasks([{ id: 1, text: '', xpValue: 10 }]);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const addTask = () => {
    if (tasks.length < 5) {
      const newId = Math.max(...tasks.map(t => t.id)) + 1;
      setTasks(prev => [...prev, { id: newId, text: '', xpValue: 10 }]);
    }
  };

  const removeTask = (taskId: number) => {
    if (tasks.length > 1) {
      setTasks(prev => prev.filter(t => t.id !== taskId));
    }
  };

  const updateTask = (taskId: number, field: 'text' | 'xpValue', value: string | number) => {
    setTasks(prev => prev.map(t => 
      t.id === taskId ? { ...t, [field]: value } : t
    ));
  };

  const handleSave = () => {
    if (!habitName.trim()) {
      toast.error('Please enter a habit name');
      return;
    }

    const validTasks = tasks.filter(t => t.text.trim());
    if (validTasks.length === 0) {
      toast.error('Please add at least one task');
      return;
    }

    if (!canAddSlot) {
      toast.error('No available habit slots. Complete streaks to unlock more!');
      return;
    }

    const newHabit: NewHabit = {
      name: habitName.trim(),
      icon: selectedIcon,
      color: selectedColor,
      tasks: validTasks
    };

    onSave(newHabit);
    handleClose();
    toast.success('New habit created successfully!');
  };

  const selectedIconComponent = HABIT_ICONS.find(h => h.name === selectedIcon)?.icon || Book;
  const selectedColorData = HABIT_COLORS.find(c => c.value === selectedColor) || HABIT_COLORS[0];

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={handleClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          onClick={(e) => e.stopPropagation()}
          className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-md max-h-[85vh] overflow-hidden"
          style={{
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8)'
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-700">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 ${selectedColorData.bg} rounded-full flex items-center justify-center`}>
                {renderIcon(selectedIconComponent, `w-5 h-5 ${selectedColorData.text}`)}
              </div>
              <div>
                <h2 className="text-white font-bold text-lg">Add New Habit</h2>
                <p className="text-gray-400 text-sm">
                  Slot {usedSlots + 1}/{availableSlots} {!canAddSlot && '(No slots available)'}
                </p>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleClose}
              className="p-2 rounded-lg hover:bg-gray-800 transition-colors"
            >
              <X className="w-5 h-5 text-gray-400" />
            </motion.button>
          </div>

          <div className="max-h-[calc(85vh-80px)] overflow-y-auto">
            <div className="p-6 space-y-6">
              {/* Habit Name */}
              <div>
                <label className="block text-white font-medium mb-3">Habit Name</label>
                <input
                  type="text"
                  value={habitName}
                  onChange={(e) => setHabitName(e.target.value)}
                  placeholder="e.g., Morning Exercise, Reading, Meditation..."
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors"
                  maxLength={50}
                />
              </div>

              {/* Icon Selection */}
              <div>
                <label className="block text-white font-medium mb-3">Choose Icon</label>
                <div className="grid grid-cols-3 gap-3">
                  {HABIT_ICONS.map((iconData) => {
                    const IconComponent = iconData.icon;
                    const isSelected = selectedIcon === iconData.name;
                    return (
                      <motion.button
                        key={iconData.name}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSelectedIcon(iconData.name)}
                        className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                          isSelected 
                            ? `${selectedColorData.bg} ${selectedColorData.border} bg-opacity-30` 
                            : 'bg-gray-800 border-gray-700 hover:border-gray-600'
                        }`}
                      >
                        <IconComponent className={`w-6 h-6 mx-auto ${
                          isSelected ? selectedColorData.text : 'text-gray-400'
                        }`} />
                      </motion.button>
                    );
                  })}
                </div>
              </div>

              {/* Color Selection */}
              <div>
                <label className="block text-white font-medium mb-3">Choose Color</label>
                <div className="grid grid-cols-3 gap-3">
                  {HABIT_COLORS.map((color) => (
                    <motion.button
                      key={color.value}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedColor(color.value)}
                      className={`p-3 rounded-xl border-2 transition-all duration-200 ${
                        selectedColor === color.value 
                          ? `${color.bg} ${color.border} bg-opacity-50` 
                          : 'bg-gray-800 border-gray-700 hover:border-gray-600'
                      }`}
                    >
                      <div className={`w-6 h-6 rounded-full mx-auto ${color.bg} ${color.border} border`} />
                      <span className={`block mt-2 text-xs ${
                        selectedColor === color.value ? color.text : 'text-gray-400'
                      }`}>
                        {color.name}
                      </span>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Tasks */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-white font-medium">Daily Tasks</label>
                  <span className="text-gray-400 text-sm">{tasks.length}/5</span>
                </div>
                
                <div className="space-y-3">
                  {tasks.map((task, index) => (
                    <motion.div
                      key={task.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-3"
                    >
                      <span className="text-gray-500 text-sm font-medium w-6">
                        {index + 1}.
                      </span>
                      <input
                        type="text"
                        value={task.text}
                        onChange={(e) => updateTask(task.id, 'text', e.target.value)}
                        placeholder="e.g., Read for 20 minutes"
                        className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 text-sm"
                        maxLength={60}
                      />
                      <div className="flex items-center gap-1">
                        <input
                          type="number"
                          value={task.xpValue}
                          onChange={(e) => updateTask(task.id, 'xpValue', parseInt(e.target.value) || 10)}
                          min="10"
                          max="100"
                          step="5"
                          className="w-16 bg-gray-800 border border-gray-700 rounded-lg px-2 py-2 text-white text-sm font-tabular focus:outline-none focus:border-purple-500"
                        />
                        <span className="text-gray-500 text-xs">XP</span>
                      </div>
                      {tasks.length > 1 && (
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => removeTask(task.id)}
                          className="p-1 rounded-md hover:bg-gray-800 text-gray-500 hover:text-red-400 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </motion.button>
                      )}
                    </motion.div>
                  ))}
                </div>

                {tasks.length < 5 && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={addTask}
                    className="w-full mt-3 py-2 border-2 border-dashed border-gray-600 rounded-lg text-gray-400 hover:border-gray-500 hover:text-gray-300 transition-colors flex items-center justify-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Add Task
                  </motion.button>
                )}
              </div>

              {/* Slot Warning */}
              {!canAddSlot && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-red-900/20 border border-red-500/30 rounded-xl p-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-red-500/20 rounded-full flex items-center justify-center">
                      <X className="w-4 h-4 text-red-400" />
                    </div>
                    <div>
                      <h4 className="text-red-300 font-medium text-sm">No Available Slots</h4>
                      <p className="text-red-400/80 text-xs mt-1">
                        Complete 3-day or 7-day streaks to unlock more habit slots!
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-gray-700 bg-gray-900/50">
              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleClose}
                  className="flex-1 py-3 px-4 rounded-xl bg-gray-800 text-gray-300 font-medium hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: canAddSlot ? 1.02 : 1 }}
                  whileTap={{ scale: canAddSlot ? 0.98 : 1 }}
                  onClick={handleSave}
                  disabled={!canAddSlot}
                  className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all duration-200 ${
                    canAddSlot
                      ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white hover:shadow-lg hover:shadow-purple-500/25'
                      : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  Create Habit
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// Helper function to render icons
const renderIcon = (IconComponent: any, className: string) => {
  return <IconComponent className={className} />;
};