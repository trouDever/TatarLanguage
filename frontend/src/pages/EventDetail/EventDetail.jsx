import React from 'react';
import styles from './EventDetail.module.css';
import {useLocation} from 'react-router-dom';


const EventDetail = () => {
    const location = useLocation();
    const { title, place, price, image } = location.state;

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
                        Концерт Фараона — это уникальное погружение в
                        мир мрачного звучания и откровенных текстов, которые бьют прямо в сердце. На сцене оживают
                        тяжелые биты и атмосферные мелодии, создавая магическую ауру настоящего хип-хопа. Не упусти
                        возможность стать частью этого музыкального откровения.
                    </p>
                </div>
                <div className={styles['event-details']}>
                    <h1 className={styles['event-details__title']}>{title}</h1>
                    <div className={styles['event-details__program']}>
                        <p className={styles['event-details__place-name']}>Где встречаемся?
                            <p className={styles['event-details__place-info']}>
                                {place}
                            </p>
                        </p>

                    </div>
                    <button className={`${styles['event-details__button']}`}>Записаться
                    </button>
                </div>
            </div>
        </main>
    );
};

export default EventDetail;