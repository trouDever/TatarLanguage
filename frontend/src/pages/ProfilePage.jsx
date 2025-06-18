import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { updateUserMe } from '../services/api';
import './ProfilePage.css';


export default function ProfilePage() {
    const { user, access } = useAuth();
    const [form, setForm] = useState({
        first_name: '',
        last_name: '',
        phone: '',
        org_name: '',
        org_socials: '',
    });
    const [editing, setEditing] = useState(false);

    useEffect(() => {
        if (user) {
            setForm({
                first_name: user.first_name || '',
                last_name: user.last_name || '',
                phone: user.phone || '',
                org_name: user.org_name || '',
                org_socials: user.org_socials || '',
            });
        }
    }, [user]);

    if (!user) return null;

    const isOrg = user.role === 'organization';

    function handleChange(e) {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    async function save() {
        await updateUserMe(form, access);
        window.location.reload();
    }

    return (
        <main>
            {isOrg ? (
                <form className="org-form profile-form">
                    <label>Название организации</label>
                    <input
                        name="org_name"
                        value={form.org_name}
                        onChange={handleChange}
                        disabled={!editing}
                        className="form__input"
                    />
                    <label>Соц-сети организации</label>
                    <input
                        name="org_socials"
                        value={form.org_socials}
                        onChange={handleChange}
                        disabled={!editing}
                        className="form__input"
                    />
                </form>
            ) : (
                <form className="user-form profile-form">
                    <label>Имя</label>
                    <input
                        name="first_name"
                        value={form.first_name}
                        onChange={handleChange}
                        disabled={!editing}
                        className="form__input"
                    />
                    <label>Фамилия</label>
                    <input
                        name="last_name"
                        value={form.last_name}
                        onChange={handleChange}
                        disabled={!editing}
                        className="form__input"
                    />
                    <label>Номер телефона</label>
                    <input
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        disabled={!editing}
                        className="form__input"
                    />
                </form>
            )}
            {editing ? (
                <button onClick={save} className="form__button">Сохранить изменения</button>
            ) : (
                <button onClick={() => setEditing(true)} className="form__button">Редактировать</button>
            )}
        </main>
    );
}
