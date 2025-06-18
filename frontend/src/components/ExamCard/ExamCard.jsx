import React from 'react';
import styles from './ExamCard.module.css';
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

export default function ExamCard({ id, title, description, level }) {
    return (
        <Link to={`/exams/${id}`} state={{ id, title, description, level }}
              style={{ textDecoration: 'none', color: 'black' }}>
            <article className={styles['exam-card-container']}>
                <div className={styles['exam-card-info']}>
                    <div className={styles['exam-card-info__top']}>
                        <h3 className={styles['exam-card-info__top-title']}>{title}</h3>
                        <p className={styles['exam-card-info__top-level']}>Уровень: {getLevelLabel(level)}</p>
                    </div>
                    <p className={styles['exam-card-info__desc']}>{description}</p>
                </div>
            </article>
        </Link>
    );
} 