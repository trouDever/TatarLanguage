import React from 'react';
import styles from './EventCard.module.css'
import {Link} from "react-router-dom";

export default function EventCard({title, event_type, date, image, url}) {

    return (
        <Link to='/events-detail' state={{ title, event_type, date, image, url}}
              style={{ textDecoration: 'none', color: 'black' }} >
            <article className={styles['ivent-card-container']}>
                <div className={styles['ivent-card-preview']}>
                    <img src={image} alt={title} className={styles['ivent-card-img']}/>
                </div>
                <div className={styles['ivent-card-info']}>
                    <div className={styles['ivent-card-info__top']}>
                        <h3 className={styles['ivent-card-info__top-title']}>{title}</h3>
                        <p className={styles['ivent-card-info__top-place']}>{date}</p>
                    </div>
                    <p className={styles['ivent-card-info__price']}>{event_type}</p>
                </div>
            </article>
        </Link>
    );
};