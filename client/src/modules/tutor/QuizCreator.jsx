import { useState } from 'react';
import { Plus, Trash, CheckCircle } from 'lucide-react';

const QuizCreator = ({ onQuizChange }) => {
  const [questions, setQuestions] = useState([
    { question: '', options: ['', '', '', ''], correctAnswer: 0 }
  ]);

  // Update a specific field
  const updateQuestion = (index, field, value) => {
    const newQuestions = [...questions];
    newQuestions[index][field] = value;
    setQuestions(newQuestions);
    onQuizChange(newQuestions);
  };

  // Update a specific option
  const updateOption = (qIndex, oIndex, value) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].options[oIndex] = value;
    setQuestions(newQuestions);
    onQuizChange(newQuestions);
  };

  // Add new question
  const addQuestion = () => {
    setQuestions([...questions, { question: '', options: ['', '', '', ''], correctAnswer: 0 }]);
  };

  // Remove question
  const removeQuestion = (index) => {
    if (questions.length === 1) return;
    const newQuestions = questions.filter((_, i) => i !== index);
    setQuestions(newQuestions);
    onQuizChange(newQuestions);
  };

  return (
    <div className="space-y-6 bg-gray-50 p-6 rounded-xl border border-gray-200">
      <h3 className="font-bold text-gray-700">Quiz Questions</h3>
      
      {questions.map((q, qIndex) => (
        <div key={qIndex} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex justify-between mb-2">
            <span className="text-sm font-bold text-gray-500">Question {qIndex + 1}</span>
            <button type="button" onClick={() => removeQuestion(qIndex)} className="text-red-500 hover:text-red-700">
              <Trash size={16} />
            </button>
          </div>

          {/* Question Text */}
          <input
            type="text"
            placeholder="Enter question text here..."
            className="w-full mb-4 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500"
            value={q.question}
            onChange={(e) => updateQuestion(qIndex, 'question', e.target.value)}
          />

          {/* Options */}
          <div className="space-y-2">
            {q.options.map((opt, oIndex) => (
              <div key={oIndex} className="flex items-center gap-2">
                <input
                  type="radio"
                  name={`correct-${qIndex}`}
                  checked={q.correctAnswer === oIndex}
                  onChange={() => updateQuestion(qIndex, 'correctAnswer', oIndex)}
                  className="w-4 h-4 text-indigo-600 focus:ring-indigo-500"
                />
                <input
                  type="text"
                  placeholder={`Option ${oIndex + 1}`}
                  className={`flex-1 p-2 border rounded text-sm ${q.correctAnswer === oIndex ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300'}`}
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
        className="flex items-center gap-2 text-sm font-bold text-indigo-600 hover:text-indigo-800"
      >
        <Plus size={16} /> Add Another Question
      </button>
    </div>
  );
};

export default QuizCreator;