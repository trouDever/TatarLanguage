import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getCourse } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import styles from './CourseDetail.module.css';

const CourseDetail = () => {
    const { id } = useParams();
    const [course, setCourse] = useState(null);
    const { access } = useAuth();

    useEffect(() => {
        if (access) {
            getCourse(id, access).then(res => setCourse(res.data));
        }
    }, [id, access]);

    if (!course) return <div>Загрузка...</div>;

    return (
        <main className={styles.content}>
            <div className={styles['event-info']}>
                <div className={styles['event-preview']}>
                    <div className={styles['event-preview__container']}>
                        <img
                            className={styles['event-preview__container-img']}
                            src={`http://127.0.0.1:8000${course.photo}`}
                            alt="Фото курса"
                        />
                    </div>

                    <p className={styles['event-preview__description-info']}>
                        <p className={styles['event-preview__description-name']}>Описание курса</p>
                        {course.description || 'Описание не указано'}
                    </p>
                </div>

                <div className={styles['event-details']}>
                    <h1 className={styles['event-details__title']}>{course.name}</h1>
                    <div className={styles['event-details__program']}>
                        <p className={styles['event-details__place-name']}>Уровень</p>
                        <p className={styles['event-details__place-info']}>{course.level}</p>

                        <p className={styles['event-details__place-name']}>Дата начала</p>
                        <p className={styles['event-details__place-info']}>{course.start_date || '—'}</p>

                        <p className={styles['event-details__place-name']}>Дата окончания</p>
                        <p className={styles['event-details__place-info']}>{course.end_date || '—'}</p>
                    </div>
                    <button className={styles['event-details__button']}>Записаться</button>
                </div>
            </div>
        </main>
    );
};

export default CourseDetail;
