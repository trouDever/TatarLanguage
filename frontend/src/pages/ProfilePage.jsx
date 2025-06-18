import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { updateUserMe, updateOrgMe } from '../services/api';
import './ProfilePage.css';


export default function ProfilePage() {
    const { user, access } = useAuth();
    const [form, setForm] = useState({
        first_name: '',
        last_name: '',
        phone: '',
    });
    const [formOrg, setFormOrg] = useState({
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
            });
            setFormOrg({
                org_name: user.org_name || '',
                org_socials: user.org_socials || '',
            })
        }
    }, [user]);

    if (!user) return null;

    const isOrg = user.role === 'organization';

    function handleChangeUser(e) {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    function handleChangeOrg(e) {
        setFormOrg({ ...formOrg, [e.target.name]: e.target.value });
    }

    async function save() {
        await updateUserMe(form, access);
        await updateOrgMe(formOrg, access);
        window.location.reload();
    }

    return (
        <main>
            {isOrg ? (
                <form className="org-form profile-form">
                    <label>Название организации</label>
                    <input
                        name="org_name"
                        value={formOrg.org_name}
                        onChange={handleChangeOrg}
                        disabled={!editing}
                        className="form__input"
                    />
                    <label>Соц-сети организации</label>
                    <input
                        name="org_socials"
                        value={formOrg.org_socials}
                        onChange={handleChangeOrg}
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
                        onChange={handleChangeUser}
                        disabled={!editing}
                        className="form__input"
                    />
                    <label>Фамилия</label>
                    <input
                        name="last_name"
                        value={form.last_name}
                        onChange={handleChangeUser}
                        disabled={!editing}
                        className="form__input"
                    />
                    <label>Номер телефона</label>
                    <input
                        name="phone"
                        value={form.phone}
                        onChange={handleChangeUser}
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