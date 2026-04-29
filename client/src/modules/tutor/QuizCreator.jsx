import { useState, useEffect } from 'react';
import { Plus, Trash, CheckCircle } from 'lucide-react';
import api from '../../api/api';

const QuizCreator = ({ onQuizChange, initialData = [] }) => {
  const [questions, setQuestions] = useState([
    { question: '', options: ['', '', '', ''], correctAnswer: 0 }
  ]);

  // Load initial data if it exists (for Edit mode)
  useEffect(() => {
    if (initialData && initialData.length > 0) {
      setQuestions(initialData);
    }
  }, [initialData]);

  const updateQuestion = (index, field, value) => {
    const newQuestions = [...questions];
    newQuestions[index][field] = value;
    setQuestions(newQuestions);
    onQuizChange(newQuestions);
  };

  const updateOption = (qIndex, oIndex, value) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].options[oIndex] = value;
    setQuestions(newQuestions);
    onQuizChange(newQuestions);
  };

  const addQuestion = () => {
    setQuestions([...questions, { question: '', options: ['', '', '', ''], correctAnswer: 0 }]);
  };

  const removeQuestion = (index) => {
    if (questions.length === 1) return;
    const newQuestions = questions.filter((_, i) => i !== index);
    setQuestions(newQuestions);
    onQuizChange(newQuestions);
  };

  return (
    <div className="space-y-6 bg-slate-50/50 dark:bg-slate-800/30 p-6 rounded-2xl border border-slate-200 dark:border-slate-700/50 transition-colors">
      <div className="flex items-center justify-between">
        <h3 className="font-black text-slate-700 dark:text-slate-300 uppercase tracking-widest text-xs">Assessment Builder</h3>
        <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 bg-white dark:bg-slate-800 px-2 py-1 rounded-md border border-slate-200 dark:border-slate-700 shadow-sm">{questions.length} Questions</span>
      </div>
      
      {questions.map((q, qIndex) => (
        <div key={qIndex} className="bg-white dark:bg-slate-900 p-5 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 transition-colors">
          <div className="flex justify-between items-center mb-4">
            <span className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest bg-slate-50 dark:bg-slate-800 px-3 py-1 rounded-lg">Question {qIndex + 1}</span>
            <button type="button" onClick={() => removeQuestion(qIndex)} className="text-slate-400 hover:text-rose-500 dark:hover:text-rose-400 p-1.5 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-lg transition-colors">
              <Trash size={16} />
            </button>
          </div>

          {/* Question Text */}
          <input
            type="text"
            placeholder="Enter question text here..."
            className="w-full mb-5 p-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder-slate-400 dark:placeholder-slate-500"
            value={q.question}
            onChange={(e) => updateQuestion(qIndex, 'question', e.target.value)}
          />

          {/* Options */}
          <div className="space-y-3">
            {q.options.map((opt, oIndex) => (
              <div key={oIndex} className="flex items-center gap-3">
                <input
                  type="radio"
                  name={`correct-${qIndex}`}
                  checked={q.correctAnswer === oIndex}
                  onChange={() => updateQuestion(qIndex, 'correctAnswer', oIndex)}
                  className="w-4 h-4 text-indigo-600 dark:text-indigo-500 focus:ring-indigo-500 dark:focus:ring-indigo-400 cursor-pointer"
                />
                <input
                  type="text"
                  placeholder={`Option ${oIndex + 1}`}
                  className={`flex-1 p-3 border rounded-xl text-sm font-medium outline-none transition-all ${
                    q.correctAnswer === oIndex 
                      ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-900 dark:text-indigo-100 ring-1 ring-indigo-500' 
                      : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 focus:border-indigo-300 dark:focus:border-indigo-600 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                  }`}
                  value={opt}
                  onChange={(e) => updateOption(qIndex, oIndex, e.target.value)}
                />
              </div>
            ))}
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={addQuestion}
        className="w-full flex items-center justify-center gap-2 text-xs font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 bg-indigo-50 dark:bg-indigo-500/10 hover:bg-indigo-100 dark:hover:bg-indigo-500/20 py-4 rounded-xl transition-colors border border-indigo-100 dark:border-indigo-500/20 dashed"
      >
        <Plus size={16} /> Add Another Question
      </button>
    </div>
  );
};

export default QuizCreator;