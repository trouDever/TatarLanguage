import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import ExamCard from '../components/ExamCard/ExamCard';

export default function Exams() {
    const { access, user } = useAuth();
    const [exams, setExams] = useState([]);
    const [results, setResults] = useState([]);
    const [examTitles, setExamTitles] = useState({});
    const [activeTab, setActiveTab] = useState('all'); // 'all' или 'completed'
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchExams();
    }, [access]);

    const fetchExams = async () => {
        try {
            setLoading(true);
            const response = await fetch('http://127.0.0.1:8000/api/v1/exam/', {
                headers: {
                    'Authorization': `Bearer ${access}`,
                },
            });
            if (!response.ok) throw new Error('Ошибка загрузки тестов');
            const data = await response.json();
            const examsData = Array.isArray(data) ? data : data.results || [];
            
            // Если пользователь - организация, показываем только их тесты
            // Бэкенд уже фильтрует тесты по организации
            setExams(examsData);
        } catch (err) {
            setExams([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // Загружаем результаты только для обычных пользователей
        if (user?.role !== 'organization') {
            fetchResults();
        }
    }, [access, user]);

    const fetchResults = async () => {
        try {
            const response = await fetch('http://127.0.0.1:8000/api/v1/result/', {
                headers: {
                    'Authorization': `Bearer ${access}`,
                },
            });
            if (!response.ok) throw new Error('Ошибка загрузки результатов');
            const data = await response.json();
            setResults(Array.isArray(data) ? data : data.results || []);
        } catch (err) {
            setResults([]);
        }
    };

    useEffect(() => {
        const fetchExamTitles = async () => {
            const titles = {};
            for (const result of results) {
                if (result.exam && !titles[result.exam]) {
                    try {
                        const response = await fetch(`http://127.0.0.1:8000/api/v1/exam/${result.exam}`, {
                            headers: {
                                'Authorization': `Bearer ${access}`,
                            },
                        });
                        if (response.ok) {
                            const examData = await response.json();
                            titles[result.exam] = examData.title;
                        }
                    } catch (err) {
                        titles[result.exam] = 'Тест';
                    }
                }
            }
            setExamTitles(titles);
        };
        if (results.length > 0) {
            fetchExamTitles();
        }
    }, [results, access]);

    const handleDeleteExam = async (examId) => {
        if (!window.confirm('Вы уверены, что хотите удалить этот тест?')) {
            return;
        }

        try {
            const response = await fetch(`http://127.0.0.1:8000/api/v1/exam/${examId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${access}`,
                },
            });

            if (response.ok) {
                // Удаляем тест из списка
                setExams(exams.filter(exam => exam.id !== examId));
            } else {
                alert('Ошибка при удалении теста');
            }
        } catch (error) {
            console.error('Ошибка удаления теста:', error);
            alert('Ошибка при удалении теста');
        }
    };

    if (loading) {
        return (
            <div className='ivents-page'>
                <div style={{ textAlign: 'center', padding: '50px' }}>
                    Загрузка тестов...
                </div>
            </div>
        );
    }

    return (
        <div className='ivents-page'>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <h1 className='ivents-title'>Тесты</h1>
                {user?.role === 'organization' && (
                    <Link 
                        to="/exams/create"
                        style={{
                            padding: '12px 24px',
                            backgroundColor: '#1e88e5',
                            color: 'white',
                            textDecoration: 'none',
                            borderRadius: 6,
                            fontSize: '16px',
                            fontWeight: 'bold'
                        }}
                    >
                        Создать тест
                    </Link>
                )}
            </div>
            
            {/* Показываем вкладки только для обычных пользователей */}
            {user?.role !== 'organization' && (
                <div style={{ marginBottom: 24 }}>
                    <button 
                        onClick={() => setActiveTab('all')}
                        style={{
                            padding: '8px 16px',
                            marginRight: 8,
                            border: 'none',
                            borderRadius: 4,
                            background: activeTab === 'all' ? '#1e88e5' : '#f5f5f5',
                            color: activeTab === 'all' ? 'white' : 'black',
                            cursor: 'pointer'
                        }}
                    >
                        Все тесты
                    </button>
                    <button 
                        onClick={() => setActiveTab('completed')}
                        style={{
                            padding: '8px 16px',
                            border: 'none',
                            borderRadius: 4,
                            background: activeTab === 'completed' ? '#1e88e5' : '#f5f5f5',
                            color: activeTab === 'completed' ? 'white' : 'black',
                            cursor: 'pointer'
                        }}
                    >
                        Пройденные тесты
                    </button>
                </div>
            )}
            
            <section className='ivent-section'>
                {activeTab === 'all' || user?.role === 'organization' ? (
                    <>
                        {exams.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '50px', color: '#666' }}>
                                {user?.role === 'organization' ? 'У вас пока нет тестов' : 'Нет доступных тестов.'}
                            </div>
                        ) : (
                            exams.map((exam) => (
                                <div key={exam.id} style={{ position: 'relative' }}>
                                    <ExamCard
                                        id={exam.id}
                                        title={exam.title}
                                        description={exam.description}
                                        level={exam.level}
                                    />
                                    {user?.role === 'organization' && (
                                        <div style={{
                                            position: 'absolute',
                                            bottom: 12,
                                            right: 12,
                                            display: 'flex',
                                            gap: 8,
                                            zIndex: 10
                                        }}>
                                            <Link
                                                to={`/exams/${exam.id}/edit`}
                                                state={{ exam }}
                                                style={{
                                                    padding: '6px 12px',
                                                    backgroundColor: '#4caf50',
                                                    color: 'white',
                                                    textDecoration: 'none',
                                                    borderRadius: 4,
                                                    fontSize: '12px',
                                                    fontWeight: 'bold',
                                                    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                                                    transition: 'all 0.2s ease'
                                                }}
                                                onMouseEnter={(e) => {
                                                    e.target.style.backgroundColor = '#45a049';
                                                    e.target.style.transform = 'translateY(-1px)';
                                                }}
                                                onMouseLeave={(e) => {
                                                    e.target.style.backgroundColor = '#4caf50';
                                                    e.target.style.transform = 'translateY(0)';
                                                }}
                                            >
                                                Изменить
                                            </Link>
                                            <button
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    handleDeleteExam(exam.id);
                                                }}
                                                style={{
                                                    padding: '6px 12px',
                                                    backgroundColor: '#f44336',
                                                    color: 'white',
                                                    border: 'none',
                                                    borderRadius: 4,
                                                    fontSize: '12px',
                                                    fontWeight: 'bold',
                                                    cursor: 'pointer',
                                                    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                                                    transition: 'all 0.2s ease'
                                                }}
                                                onMouseEnter={(e) => {
                                                    e.target.style.backgroundColor = '#da190b';
                                                    e.target.style.transform = 'translateY(-1px)';
                                                }}
                                                onMouseLeave={(e) => {
                                                    e.target.style.backgroundColor = '#f44336';
                                                    e.target.style.transform = 'translateY(0)';
                                                }}
                                            >
                                                Удалить
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ))
                        )}
                    </>
                ) : (
                    <>
                        {results.length === 0 && <p>Вы ещё не проходили тесты.</p>}
                        {results.map((result) => (
                            <div key={result.id} style={{ 
                                background: '#fff', 
                                borderRadius: 12, 
                                boxShadow: '0 2px 8px rgba(0,0,0,0.07)', 
                                margin: 12, 
                                padding: 16 
                            }}>
                                <h3>{examTitles[result.exam] || 'Загрузка...'}</h3>
                                <p>Результат: <b>{result.score}</b> баллов</p>
                                <p>Дата прохождения: {new Date(result.completed_at).toLocaleDateString()}</p>
                            </div>
                        ))}
                    </>
                )}
            </section>
        </div>
    );
} 