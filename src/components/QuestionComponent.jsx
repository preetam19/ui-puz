import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button"

const colorMap = {
  '0': { bg: 'bg-white', name: 'White' },
  '1': { bg: 'bg-purple-500', name: 'Purple' },
  '2': { bg: 'bg-blue-500', name: 'Blue' },
  '3': { bg: 'bg-green-500', name: 'Green' },
  '4': { bg: 'bg-red-500', name: 'Red' },
  '5': { bg: 'bg-yellow-500', name: 'Yellow' },
  '6': { bg: 'bg-cyan-500', name: 'Cyan' },
  '7': { bg: 'bg-orange-500', name: 'Orange' },
  '8': { bg: 'bg-gray-500', name: 'Gray' },
  '9': { bg: 'bg-pink-500', name: 'Pink' }
};

const QuestionComponent = ({ question }) => {
  const [userAnswer, setUserAnswer] = useState('');
  const [isExplanationCorrect, setIsExplanationCorrect] = useState(null);
  const [userExplanation, setUserExplanation] = useState('');
  const [isLLMAnswerCorrect, setIsLLMAnswerCorrect] = useState(null);
  const [userLLMAnswer, setUserLLMAnswer] = useState('');
  const [matrixData, setMatrixData] = useState(null);

  const [rows, setRows] = useState(3);
  const [cols, setCols] = useState(3);
  const [outputMatrix, setOutputMatrix] = useState([]);
  const [selectedColor, setSelectedColor] = useState('1'); // Default to purple

  useEffect(() => {
    if (question && question.Matrix) {
      try {
        const parsedMatrix = JSON.parse(question.Matrix);
        setMatrixData(parsedMatrix);
        setRows(parsedMatrix.length);
        setCols(parsedMatrix[0].length);
        setOutputMatrix(Array(parsedMatrix.length).fill().map(() => Array(parsedMatrix[0].length).fill('0')));
      } catch (error) {
        console.error("Error parsing matrix:", error);
      }
    }
  }, [question]);

  useEffect(() => {
    setOutputMatrix(Array(rows).fill().map(() => Array(cols).fill('0')));
  }, [rows, cols]);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('User answer:', userAnswer);
    console.log('Is explanation correct:', isExplanationCorrect);
    console.log('User explanation:', userExplanation);
    console.log('Is LLM answer correct:', isLLMAnswerCorrect);
    console.log('User LLM answer:', userLLMAnswer);
    console.log('Output matrix:', outputMatrix);
  };

  const renderMatrix = (matrix) => {
    if (!matrix || !Array.isArray(matrix) || matrix.length === 0) {
      return <p>Error: Invalid matrix data</p>;
    }

    return (
      <div className="inline-grid gap-[1px] p-4 bg-gray-200 rounded" 
           style={{ gridTemplateColumns: `repeat(${matrix[0].length}, minmax(0, 1fr))` }}>
        {matrix.flat().map((cell, index) => (
          <div 
            key={index} 
            className={`w-8 h-8 ${colorMap[cell.toString()].bg} border border-gray-300`}
          />
        ))}
      </div>
    );
  };

  const handleRowsChange = (e) => {
    const newRows = parseInt(e.target.value);
    if (newRows > 0 && newRows <= 30) {
      setRows(newRows);
    }
  };

  const handleColsChange = (e) => {
    const newCols = parseInt(e.target.value);
    if (newCols > 0 && newCols <= 30) {
      setCols(newCols);
    }
  };

  const handleCellClick = (row, col) => {
    const newMatrix = [...outputMatrix];
    newMatrix[row][col] = selectedColor;
    setOutputMatrix(newMatrix);
  };

  const handleCopyFromInput = () => {
    if (matrixData) {
      setRows(matrixData.length);
      setCols(matrixData[0].length);
      setOutputMatrix([...matrixData]);
    }
  };

  const renderColorPalette = () => {
    return (
      <div className="flex flex-col space-y-2">
        {Object.entries(colorMap).map(([key, { bg, name }]) => (
          <button
            key={key}
            className={`w-full p-2 ${bg} text-white text-left ${selectedColor === key ? 'ring-2 ring-offset-2 ring-blue-500' : ''}`}
            onClick={() => setSelectedColor(key)}
          >
            {name}
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-4 p-4 bg-white text-gray-900 rounded-lg shadow">
      <h2 className="text-xl font-bold">{question.Question}</h2>
      <div>
        <h3 className="text-lg font-semibold mb-2">Input Matrix</h3>
        {matrixData ? renderMatrix(matrixData) : <p>Loading matrix...</p>}
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="userAnswer" className="block text-sm font-medium">Your Answer:</label>
          <input
            type="text"
            id="userAnswer"
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>
        <div>
          <p className="font-medium">Explanation:</p>
          <p className="text-sm text-gray-600">{question.Explanation}</p>
          <div className="mt-2">
            <label className="inline-flex items-center">
              <input
                type="radio"
                className="form-radio text-indigo-600"
                name="explanationCorrect"
                value="yes"
                onChange={() => setIsExplanationCorrect(true)}
              />
              <span className="ml-2">Correct</span>
            </label>
            <label className="inline-flex items-center ml-6">
              <input
                type="radio"
                className="form-radio text-indigo-600"
                name="explanationCorrect"
                value="no"
                onChange={() => setIsExplanationCorrect(false)}
              />
              <span className="ml-2">Incorrect</span>
            </label>
          </div>
          {isExplanationCorrect === false && (
            <textarea
              value={userExplanation}
              onChange={(e) => setUserExplanation(e.target.value)}
              className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              rows="3"
              placeholder="Enter the correct explanation"
            />
          )}
        </div>
        <div>
          <p className="font-medium">LLM Answer:</p>
          <p className="text-sm text-gray-600">{question.LLM_Answer}</p>
          <div className="mt-2">
            <label className="inline-flex items-center">
              <input
                type="radio"
                className="form-radio text-indigo-600"
                name="llmAnswerCorrect"
                value="yes"
                onChange={() => setIsLLMAnswerCorrect(true)}
              />
              <span className="ml-2">Correct</span>
            </label>
            <label className="inline-flex items-center ml-6">
              <input
                type="radio"
                className="form-radio text-indigo-600"
                name="llmAnswerCorrect"
                value="no"
                onChange={() => setIsLLMAnswerCorrect(false)}
              />
              <span className="ml-2">Incorrect</span>
            </label>
          </div>
          {isLLMAnswerCorrect === false && (
            <textarea
              value={userLLMAnswer}
              onChange={(e) => setUserLLMAnswer(e.target.value)}
              className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              rows="3"
              placeholder="Enter the correct LLM answer"
            />
          )}
        </div>
        
        {/* Output matrix creation section */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold">Create Output Matrix</h3>
          <div className="flex space-x-4">
            <div className="flex-1">
              <div className="mb-4 flex space-x-2">
                <div>
                  <label htmlFor="rows" className="block text-sm font-medium">Rows:</label>
                  <input
                    type="number"
                    id="rows"
                    value={rows}
                    onChange={handleRowsChange}
                    min="3"
                    max="30"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  />
                </div>
                <div>
                  <label htmlFor="cols" className="block text-sm font-medium">Columns:</label>
                  <input
                    type="number"
                    id="cols"
                    value={cols}
                    onChange={handleColsChange}
                    min="3"
                    max="30"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  />
                </div>
              </div>
              <Button 
                type="button" 
                onClick={handleCopyFromInput}
                className="mb-4"
              >
                Copy from Input
              </Button>
              <div className="inline-grid gap-[1px] p-4 bg-gray-200 rounded" 
                   style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}>
                {outputMatrix.flat().map((cell, index) => (
                  <div 
                    key={index} 
                    className={`w-8 h-8 ${colorMap[cell].bg} border border-gray-300 cursor-pointer`}
                    onClick={() => handleCellClick(Math.floor(index / cols), index % cols)}
                  />
                ))}
              </div>
            </div>
            <div className="w-48">
              <h4 className="text-md font-medium mb-2">Color Palette</h4>
              {renderColorPalette()}
            </div>
          </div>
        </div>
        
        <Button type="submit">Submit</Button>
      </form>
    </div>
  );
};

export default QuestionComponent;