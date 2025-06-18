import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function ExamDetail() {
    const { id } = useParams();
    const { access } = useAuth();
    const [exam, setExam] = useState(null);
    const [answers, setAnswers] = useState({});
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const fetchExam = async () => {
            try {
                const response = await fetch(`http://127.0.0.1:8000/api/v1/exam/${id}`, {
                    headers: { 'Authorization': `Bearer ${access}` },
                });
                if (!response.ok) throw new Error('Ошибка загрузки теста');
                const data = await response.json();
                setExam(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchExam();
    }, [id, access]);

    const handleChange = (questionNumber, value) => {
        setAnswers(a => ({ ...a, [questionNumber]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError(null);
        try {
            const payload = {
                exam_id: Number(id),
                answers: Object.entries(answers).map(([question_number, text]) => ({
                    question_number: Number(question_number),
                    text,
                })),
            };
            const response = await fetch('http://127.0.0.1:8000/api/v1/exam/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${access}`,
                },
                body: JSON.stringify(payload),
            });
            if (!response.ok) {
                const err = await response.json();
                console.error('Ошибка отправки теста:', err);
                throw new Error(err.detail || JSON.stringify(err) || 'Ошибка отправки теста');
            }
            const data = await response.json();
            setResult(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <main style={{ padding: 32 }}>Загрузка...</main>;
    if (error) return <main style={{ padding: 32, color: 'red' }}>{error}</main>;
    if (!exam) return null;

    if (result) {
        return (
            <main style={{ padding: 32, maxWidth: 700, margin: '0 auto' }}>
                <h1>Результат теста</h1>
                <p>Ваш результат: <b>{result.score}</b> баллов</p>
                {result.passed !== undefined && (
                    <p>{result.passed ? 'Тест пройден!' : 'Тест не пройден.'}</p>
                )}
            </main>
        );
    }

    return (
        <main style={{ padding: 32, maxWidth: 700, margin: '0 auto' }}>
            <h1>{exam.title}</h1>
            <p>{exam.description}</p>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                {exam.questions && exam.questions.map((q, idx) => (
                    <div key={q.id || q.text} style={{ background: '#f9f9f9', borderRadius: 8, padding: 16 }}>
                        <div style={{ fontWeight: 600, marginBottom: 8 }}>{idx + 1}. {q.text}</div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                            {q.choices && q.choices.map(choice => (
                                <label key={choice.id || choice.text} style={{ cursor: 'pointer' }}>
                                    <input
                                        type="radio"
                                        name={`question_${q.number}`}
                                        value={choice.text}
                                        checked={answers[q.number] === choice.text}
                                        onChange={() => handleChange(q.number, choice.text)}
                                        required
                                    />{' '}
                                    {choice.text}
                                </label>
                            ))}
                        </div>
                    </div>
                ))}
                <button type="submit" className="form__button" disabled={submitting} style={{ fontSize: 18, padding: '10px 32px' }}>
                    {submitting ? 'Отправка...' : 'Завершить тест'}
                </button>
            </form>
        </main>
    );
} 