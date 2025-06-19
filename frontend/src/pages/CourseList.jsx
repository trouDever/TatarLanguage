import React, { useEffect, useState } from 'react';
import { getCourses } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import './Events.css';

export default function CourseList() {
    const levelMap = {
        '1': 'A1',
        '2': 'A2',
        '3': 'B1',
        '4': 'B2',
        '5': 'C1',
        '6': 'C2',
    };

    const { access } = useAuth();
    const [courses, setCourses] = useState([]);

    useEffect(() => {
        if (access) {
            getCourses(access)
                .then(res => setCourses(res.data))
                .catch(err => console.error(err));
        }
    }, [access]);

    return (
        <div className="content">
            <h1>Список курсов</h1>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '30px' }}>
                {courses.map(course => (
                    <Link
                        key={course.id}
                        to={`/courses/${course.id}`}
                        state={course}
                        style={{ textDecoration: 'none', color: 'black' }}
                    >
                        <article className="ivent-card-container">
                            <div className="ivent-card-preview">
                                <img src={`http://127.0.0.1:8000${course.photo}`} alt={course.name} className="ivent-card-img" />
                            </div>
                            <div className="ivent-card-info">
                                <div className="ivent-card-info__top">
                                    <h3 className="ivent-card-info__top-title">{course.name}</h3>
                                    <p className="ivent-card-info__top-place">Уровень: {levelMap[course.level] || 'Неизвестно'}</p>
                                </div>
                                <p className="ivent-card-info__price">{course.start_date}</p>
                            </div>
                        </article>
                    </Link>
                ))}
            </div>
        </div>
    );
}
