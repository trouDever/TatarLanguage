import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './ExamResult.css';

export default function ExamResult() {
  const location = useLocation();
  const navigate = useNavigate();
  
  const { 
    score, 
    exam, 
    totalQuestions, 
    answeredQuestions, 
    answers, 
    questions 
  } = location.state || {};

  if (!location.state) {
    navigate('/exams');
    return null;
  }

  const getScoreColor = () => {
    if (score >= 80) return '#10b981';
    if (score >= 60) return '#f59e0b';
    return '#ef4444';
  };

  const getScoreText = () => {
    if (score >= 80) return 'Отлично!';
    if (score >= 60) return 'Хорошо!';
    if (score >= 40) return 'Удовлетворительно';
    return 'Нужно улучшить результат';
  };

  const getRecommendation = () => {
    if (score >= 80) {
      return 'Превосходный результат! Вы отлично знаете татарский язык на этом уровне.';
    }
    if (score >= 60) {
      return 'Хороший результат! Рекомендуем повторить некоторые темы для закрепления.';
    }
    if (score >= 40) {
      return 'Удовлетворительный результат. Стоит уделить больше времени изучению материала.';
    }
    return 'Рекомендуем начать с более простого уровня или дополнительно изучить основы.';
  };

  const correctAnswers = questions?.reduce((count, question) => {
    const userAnswers = answers[question.id] || [];
    const correctAnswers = question.correct;
    return JSON.stringify(userAnswers.sort()) === JSON.stringify(correctAnswers.sort()) 
      ? count + 1 
      : count;
  }, 0) || 0;

  return (
    <div className="modern-exam-result">
      <div className="result-container">
        <div className="result-header">
          <div className="result-score-circle" style={{ '--score-color': getScoreColor() }}>
            <div className="score-number">{score}%</div>
            <div className="score-text">{getScoreText()}</div>
          </div>
          
          <h1 className="result-title">Результаты теста "{exam.title}"</h1>
          <p className="result-recommendation">{getRecommendation()}</p>
        </div>

        <div className="result-stats">
          <div className="stat-card">
            <div className="stat-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 6L9 17l-5-5"/>
              </svg>
            </div>
            <div className="stat-content">
              <div className="stat-number">{correctAnswers}</div>
              <div className="stat-label">Правильных ответов</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <path d="M12 6v6l4 2"/>
              </svg>
            </div>
            <div className="stat-content">
              <div className="stat-number">{answeredQuestions}</div>
              <div className="stat-label">Вопросов отвечено</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14,2 14,8 20,8"/>
                <line x1="16" y1="13" x2="8" y2="13"/>
                <line x1="16" y1="17" x2="8" y2="17"/>
                <polyline points="10,9 9,9 8,9"/>
              </svg>
            </div>
            <div className="stat-content">
              <div className="stat-number">{totalQuestions}</div>
              <div className="stat-label">Всего вопросов</div>
            </div>
          </div>
        </div>

        <div className="result-progress">
          <h3>Детализация результата</h3>
          <div className="progress-bar-container">
            <div className="progress-bar" style={{ '--progress': `${score}%`, '--progress-color': getScoreColor() }}>
              <div className="progress-fill"></div>
            </div>
            <div className="progress-labels">
              <span>0%</span>
              <span>25%</span>
              <span>50%</span>
              <span>75%</span>
              <span>100%</span>
            </div>
          </div>
        </div>

        {questions && (
          <div className="result-details">
            <h3>Разбор ответов</h3>
            <div className="questions-review">
              {questions.map((question, index) => {
                const userAnswers = answers[question.id] || [];
                const isCorrect = JSON.stringify(userAnswers.sort()) === JSON.stringify(question.correct.sort());
                
                return (
                  <div key={question.id} className={`question-review ${isCorrect ? 'correct' : 'incorrect'}`}>
                    <div className="question-review-header">
                      <span className="question-review-number">Вопрос {index + 1}</span>
                      <span className={`question-review-status ${isCorrect ? 'correct' : 'incorrect'}`}>
                        {isCorrect ? 'Правильно' : 'Неправильно'}
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          {isCorrect ? (
                            <path d="M20 6L9 17l-5-5"/>
                          ) : (
                            <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>
                          )}
                        </svg>
                      </span>
                    </div>
                    
                    <div className="question-review-content">
                      <p className="question-review-text">{question.question}</p>
                      
                      {question.image && (
                        <div className="question-review-image">
                          <img src={question.image} alt="Вопрос" />
                        </div>
                      )}
                      
                      <div className="answer-comparison">
                        <div className="user-answers">
                          <h5>Ваш ответ:</h5>
                          {userAnswers.length > 0 ? (
                            <ul>
                              {userAnswers.map(index => (
                                <li key={index}>{question.options[index]}</li>
                              ))}
                            </ul>
                          ) : (
                            <p className="no-answer">Не отвечено</p>
                          )}
                        </div>
                        
                        <div className="correct-answers">
                          <h5>Правильный ответ:</h5>
                          <ul>
                            {question.correct.map(index => (
                              <li key={index}>{question.options[index]}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="result-actions">
          <button 
            className="modern-btn modern-btn--secondary"
            onClick={() => navigate('/exams')}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            Вернуться к тестам
          </button>
          
          <button 
            className="modern-btn modern-btn--primary"
            onClick={() => navigate(`/exam/${exam.id}`)}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
            </svg>
            Пройти заново
          </button>
        </div>
      </div>
    </div>
  );
}
