import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import EventCard from '../components/EventCard/EventCard';
import ExamCard from '../components/ExamCard/ExamCard';
import { useAuth } from '../contexts/AuthContext';

function getRandomItems(arr, n) {
    if (!arr || arr.length === 0) return [];
    const shuffled = arr.slice().sort(() => 0.5 - Math.random());
    return shuffled.slice(0, n);
}

export default function HomePage() {
    const [events, setEvents] = useState([]);
    const [exams, setExams] = useState([]);
    const { access } = useAuth();

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await fetch('http://127.0.0.1:8000/api/v1/events/', {
                    headers: access ? { 'Authorization': `Bearer ${access}` } : {},
                });
                if (!response.ok) throw new Error('Ошибка загрузки мероприятий');
                const data = await response.json();
                let list = Array.isArray(data) ? data : data.results || [];
                list = list.sort((a, b) => new Date(a.date) - new Date(b.date)).slice(0, 6);
                setEvents(list);
            } catch (err) {
                setEvents([]);
            }
        };
        fetchEvents();
    }, [access]);

    useEffect(() => {
        const fetchExams = async () => {
            try {
                const response = await fetch('http://127.0.0.1:8000/api/v1/exam/', {
                    headers: access ? { 'Authorization': `Bearer ${access}` } : {},
                });
                if (!response.ok) throw new Error('Ошибка загрузки тестов');
                const data = await response.json();
                setExams(Array.isArray(data) ? data : data.results || []);
            } catch (err) {
                setExams([]);
            }
        };
        fetchExams();
    }, [access]);

    const randomExams = getRandomItems(exams, 3);

    return (
        <main style={{ maxWidth: 900, margin: '0 auto', padding: 32 }}>
            <section style={{ marginBottom: 40 }}>
                <h1 style={{ fontSize: '2.2rem', marginBottom: 12 }}>Татар Теле — проект для изучения татарского языка</h1>
                <p style={{ fontSize: '1.2rem', color: '#444', marginBottom: 16 }}>
                    Татар Теле — это современная образовательная платформа для всех, кто хочет изучать татарский язык с нуля или совершенствовать свои знания. Участвуйте в онлайн-курсах, проходите тесты, посещайте мероприятия и становитесь частью сообщества!
                </p>
                <Link to="/courses">
                    <button style={{ padding: '10px 32px', fontSize: 18, borderRadius: 8, background: '#1e88e5', color: '#fff', border: 'none', cursor: 'pointer' }}>
                        Перейти к курсам
                    </button>
                </Link>
            </section>
            <section style={{ marginBottom: 40 }}>
                <h2 style={{ fontSize: '1.5rem', marginBottom: 16 }}>Случайные тесты</h2>
                <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
                    {randomExams.length === 0 && <p>Нет тестов для отображения.</p>}
                    {randomExams.map(exam => (
                        <div key={exam.id} style={{ minWidth: 320, flex: '0 0 auto' }}>
                            <ExamCard
                                id={exam.id}
                                title={exam.title}
                                description={exam.description}
                                level={exam.level}
                            />
                        </div>
                    ))}
                </div>
                <div style={{ marginTop: 24 }}>
                    <Link to="/exams">
                        <button style={{ padding: '8px 24px', fontSize: 16, borderRadius: 8, background: '#ff9800', color: '#fff', border: 'none', cursor: 'pointer' }}>
                            Все тесты
                        </button>
                    </Link>
                </div>
            </section>
            <section>
                <h2 style={{ fontSize: '1.5rem', marginBottom: 16 }}>Ближайшие мероприятия</h2>
                <div style={{
                    display: 'flex',
                    overflowX: 'auto',
                    gap: 24,
                    paddingBottom: 8,
                    scrollbarWidth: 'thin',
                    scrollbarColor: '#bdbdbd #f5f5f5',
                    WebkitOverflowScrolling: 'touch',
                }}>
                    {events.length === 0 && <p>Нет ближайших мероприятий.</p>}
                    {events.map(event => (
                        <div key={event.id} style={{ minWidth: 320, flex: '0 0 auto' }}>
                            <EventCard
                                title={event.title}
                                place={event.venue}
                                event_type={event.event_type}
                                date={event.date.split('T')[0]}
                                time={event.date.split('T')[1]?.slice(0, 5) || ''}
                                image={event['image_url']}
                                url={event['source_url']}
                            />
                        </div>
                    ))}
                </div>
                <div style={{ marginTop: 24 }}>
                    <Link to="/events">
                        <button style={{ padding: '8px 24px', fontSize: 16, borderRadius: 8, background: '#43a047', color: '#fff', border: 'none', cursor: 'pointer' }}>
                            Все мероприятия
                        </button>
                    </Link>
                </div>
            </section>
        </main>
    );
}