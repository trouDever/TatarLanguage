import React from 'react';
import styles from './EventDetail.module.css';
import {useLocation} from 'react-router-dom';


const EventDetail = () => {
    const location = useLocation();
    const { title, event_type, date, image, url} = location.state;

    return (
        <main className={styles.content}>
            <div className={styles['event-info']}>
                <div className={styles['event-preview']}>
                    <div className={styles['event-preview__container']}>
                        <img className={styles['event-preview__container-img']} src={image}
                             alt="фото события"/>
                    </div>

                    <p className={styles['event-preview__description-info']}>
                        <p className={styles['event-preview__description-name']}>О событии</p>
                        {date}
                    </p>
                </div>
                <div className={styles['event-details']}>
                    <h1 className={styles['event-details__title']}>{title}</h1>
                    <div className={styles['event-details__program']}>
                        <p className={styles['event-details__place-name']}>Что нас ждет?
                            <p className={styles['event-details__place-info']}>
                                {event_type}
                            </p>
                        </p>

                    </div>
                    <a href={url} className={`${styles['event-details__link']}`}>Записаться
                    </a>
                </div>
            </div>
        </main>
    );
};

export default EventDetail;