import React from 'react';
import EventCard from "../components/EventCard/EventCard";
import preview1 from '../assets/images/EventPreview/event-preview-1.jpg';
import preview2 from '../assets/images/EventPreview/event-preview-2.jpg';
import './Events.css';

const Events = () => {
    const eventsData = [
        {
            id: 1,
            title: 'Концерт Pharaoh',
            place: 'ул. Баумана 32',
            price: '1500р',
            image: preview1
        },
        {
            id: 2,
            title: 'Концерт GONE.Fludd',
            place: 'ул. Пушкина 15',
            price: '2000р',
            image: preview2
        },

    ];

    return (
        <div className='ivents-page'>
            <h1 className='ivents-title'>Мероприятия</h1>
            <section className='ivent-section'>
                {eventsData.map((event) => (
                    <EventCard
                        key={event.id}
                        title={event.title}
                        place={event.place}
                        price={event.price}
                        image={event.image}
                    />
                ))}

            </section>
        </div>
    );
};

export default Events;