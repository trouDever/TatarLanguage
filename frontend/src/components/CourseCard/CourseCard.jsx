import React from 'react';
import styles from './CourseCard.module.css';
import { Link } from 'react-router-dom';

function getLevelLabel(level) {
    const levels = {
        1: 'A1',
        2: 'A2',
        3: 'B1',
        4: 'B2',
        5: 'C1',
        6: 'C2'
    };
    return levels[level] || level;
}

export default function CourseCard({ id, name, description, level, photo, start_date, end_date, organization_name }) {
    return (
        <Link to={`/courses/${id}`} state={{ id, name, description, level, photo, start_date, end_date, organization_name }}
              style={{ textDecoration: 'none', color: 'black' }}>
            <article className={styles['course-card-container']}>
                <div className={styles['course-card-preview']}>
                    {photo && <img src={photo} alt={name} className={styles['course-card-img']} />}
                </div>
                <div className={styles['course-card-info']}>
                    <div className={styles['course-card-info__top']}>
                        <h3 className={styles['course-card-info__top-title']}>{name}</h3>
                        <p className={styles['course-card-info__top-level']}>Уровень: {getLevelLabel(level)}</p>
                    </div>
                    {organization_name && (
                        <p className={styles['course-card-info__org']}>Организация: {organization_name}</p>
                    )}
                    <p className={styles['course-card-info__desc']}>{description}</p>
                    <p className={styles['course-card-info__dates']}>
                        {start_date && `Начало: ${start_date}`} {end_date && `— Конец: ${end_date}`}
                    </p>
                </div>
            </article>
        </Link>
    );
} 