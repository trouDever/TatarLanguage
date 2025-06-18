import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import CourseCard from '../components/CourseCard/CourseCard';
import './Events.css'; // Переиспользуем стили событий для курсов
import { useAuth } from '../contexts/AuthContext';

const Courses = () => {
    const { access, user } = useAuth();
    const [courses, setCourses] = useState([]);
    const [enrollments, setEnrollments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('all'); // 'all' или 'enrolled'

    useEffect(() => {
        fetchCourses();
    }, [access]);

    useEffect(() => {
        // Загружаем записи только для обычных пользователей
        if (user?.role !== 'organization') {
            fetchEnrollments();
        }
    }, [access, user]);

    const fetchCourses = async () => {
        try {
            setLoading(true);
            const response = await fetch('http://127.0.0.1:8000/api/v1/course/', {
                headers: {
                    'Authorization': `Bearer ${access}`,
                },
            });
            if (!response.ok) {
                throw new Error(`Ошибка сети: ${response.status}`);
            }
            const data = await response.json();
            const coursesData = Array.isArray(data) ? data : data.results || [];
            
            // Если пользователь - организация, фильтруем только его курсы
            if (user?.role === 'organization') {
                // Для организаций показываем только их курсы
                // Бэкенд должен возвращать курсы только текущей организации
                setCourses(coursesData);
            } else {
                // Для обычных пользователей показываем все курсы
                setCourses(coursesData);
            }
        } catch (err) {
            console.error('Ошибка загрузки курсов:', err);
            setCourses([]);
        } finally {
            setLoading(false);
        }
    };

    const fetchEnrollments = async () => {
        try {
            const response = await fetch('http://127.0.0.1:8000/api/v1/enrollments/', {
                headers: {
                    'Authorization': `Bearer ${access}`,
                },
            });
            if (!response.ok) {
                throw new Error('Ошибка загрузки записей');
            }
            const data = await response.json();
            setEnrollments(Array.isArray(data) ? data : data.results || []);
        } catch (err) {
            console.error('Ошибка загрузки записей:', err);
            setEnrollments([]);
        }
    };

    const handleDeleteCourse = async (courseId) => {
        if (!window.confirm('Вы уверены, что хотите удалить этот курс?')) {
            return;
        }

        try {
            const response = await fetch(`http://127.0.0.1:8000/api/v1/course/${courseId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${access}`,
                },
            });

            if (response.ok) {
                // Удаляем курс из списка
                setCourses(courses.filter(course => course.id !== courseId));
            } else {
                alert('Ошибка при удалении курса');
            }
        } catch (error) {
            console.error('Ошибка удаления курса:', error);
            alert('Ошибка при удалении курса');
        }
    };

    if (loading) {
        return (
            <div className='ivents-page'>
                <div style={{ textAlign: 'center', padding: '50px' }}>
                    Загрузка курсов...
                </div>
            </div>
        );
    }

    return (
        <div className='ivents-page'>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <h1 className='ivents-title'>Курсы</h1>
                {user?.role === 'organization' && (
                    <Link 
                        to="/courses/create"
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
                        Создать курс
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
                        Все курсы
                    </button>
                    <button 
                        onClick={() => setActiveTab('enrolled')}
                        style={{
                            padding: '8px 16px',
                            border: 'none',
                            borderRadius: 4,
                            background: activeTab === 'enrolled' ? '#1e88e5' : '#f5f5f5',
                            color: activeTab === 'enrolled' ? 'white' : 'black',
                            cursor: 'pointer'
                        }}
                    >
                        Ваши записи на курсы
                    </button>
                </div>
            )}
            
            <section className='ivent-section'>
                {activeTab === 'all' || user?.role === 'organization' ? (
                    <>
                        {courses.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '50px', color: '#666' }}>
                                {user?.role === 'organization' ? 'У вас пока нет курсов' : 'Курсы не найдены'}
                            </div>
                        ) : (
                            courses.map((course) => (
                                <div key={course.id} style={{ position: 'relative' }}>
                                    <CourseCard
                                        id={course.id}
                                        name={course.name}
                                        description={course.description}
                                        level={course.level}
                                        photo={course.photo}
                                        start_date={course.start_date}
                                        end_date={course.end_date}
                                        organization_name={course.organization_name}
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
                                                to={`/courses/${course.id}/edit`}
                                                state={{ course }}
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
                                                    handleDeleteCourse(course.id);
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
                        {enrollments.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '50px', color: '#666' }}>
                                Вы ещё не записались ни на один курс
                            </div>
                        ) : (
                            enrollments.map((enrollment) => (
                                <div key={enrollment.id} style={{ 
                                    background: '#fff', 
                                    borderRadius: 12, 
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.07)', 
                                    margin: 12, 
                                    padding: 20,
                                    border: '2px solid #4caf50'
                                }}>
                                    <h3 style={{ color: '#4caf50', marginBottom: 8 }}>{enrollment.course_name}</h3>
                                    <p style={{ color: '#666', marginBottom: 8 }}>
                                        <strong>Дата записи:</strong> {new Date(enrollment.created_at).toLocaleDateString()}
                                    </p>
                                    <Link 
                                        to={`/courses/${enrollment.course}`}
                                        style={{
                                            padding: '8px 16px',
                                            backgroundColor: '#4caf50',
                                            color: 'white',
                                            textDecoration: 'none',
                                            borderRadius: 4,
                                            fontSize: '14px',
                                            fontWeight: 'bold',
                                            display: 'inline-block',
                                            marginTop: 8
                                        }}
                                    >
                                        Перейти к курсу
                                    </Link>
                                </div>
                            ))
                        )}
                    </>
                )}
            </section>
        </div>
    );
};

export default Courses; 