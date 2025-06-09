import React from 'react';
import styles from './EventCard.module.css'
import {Link} from "react-router-dom";

export default function EventCard({title, place, price, image}) {

    return (
        <Link to='/events-detail' state={{ title, place, price, image }}
              style={{ textDecoration: 'none', color: 'black' }} >
            <article className={styles['ivent-card-container']}>
                <div className={styles['ivent-card-preview']}>
                    <img src={image} alt={title} className={styles['ivent-card-img']}/>
                </div>
                <div className={styles['ivent-card-info']}>
                    <div className={styles['ivent-card-info__top']}>
                        <h3 className={styles['ivent-card-info__top-title']}>{title}</h3>
                        <p className={styles['ivent-card-info__top-place']}>{place}</p>
                    </div>
                    <p className={styles['ivent-card-info__price']}>{price}</p>
                </div>
            </article>
        </Link>
    );
};