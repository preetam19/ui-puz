'use client';

import { useState, useEffect } from 'react';
import QuestionComponent from '@/components/QuestionComponent';

export default function Home() {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchQuestions() {
      try {
        const response = await fetch('/api/questions');
        if (!response.ok) {
          throw new Error('Failed to fetch questions');
        }
        const data = await response.json();
        setQuestions(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }

    fetchQuestions();
  }, []);

  const handleNextQuestion = () => {
    setCurrentQuestionIndex((prevIndex) => 
      prevIndex < questions.length - 1 ? prevIndex + 1 : prevIndex
    );
  };

  const handlePreviousQuestion = () => {
    setCurrentQuestionIndex((prevIndex) => 
      prevIndex > 0 ? prevIndex - 1 : prevIndex
    );
  };

  if (isLoading) return <div>Loading questions...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Survey Questions</h1>
      {questions.length > 0 ? (
        <>
          <QuestionComponent question={questions[currentQuestionIndex]} />
          <div className="mt-4 flex justify-between">
            <button 
              onClick={handlePreviousQuestion}
              disabled={currentQuestionIndex === 0}
              className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
            >
              Previous
            </button>
            <button 
              onClick={handleNextQuestion}
              disabled={currentQuestionIndex === questions.length - 1}
              className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
            >
              Next
            </button>
          </div>
        </>
      ) : (
        <p>No questions available.</p>
      )}
    </main>
  );
}