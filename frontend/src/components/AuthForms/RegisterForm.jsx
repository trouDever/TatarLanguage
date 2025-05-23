import { useState } from 'react';
import { registerRequest, loginRequest } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import AuthForms from "./AuthForms";
import styles from "./AuthForms.module.css";

export default function RegisterForm() {
    const [email, setEmail] = useState('');
    const [pass, setPass] = useState('');
    const [confirm, setConfirm] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();
        if (pass !== confirm) {
            setError('Пароли не совпадают');
            return;
        }
        try {
            await registerRequest({ email, password: pass, role: 'default_user' });
            const { data } = await loginRequest({ email, password: pass });
            login({ access: data.access, refresh: data.refresh });
            navigate('/', { replace: true });
        } catch {
            setError('Ошибка регистрации');
        }
    }

    return (
        <AuthForms
            title="Регистрация"
            subtitle="Создайте свой аккаунт"
        >
            <form onSubmit={handleSubmit} className={styles['auth-form']}>
                <label htmlFor='email'>Почта</label>
                <input id={'password'} value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" />
                <label htmlFor='password'>Пароль</label>
                <input type="password" value={pass} onChange={e=>setPass(e.target.value)} placeholder="Пароль" />
                <input type="password" value={confirm} onChange={e=>setConfirm(e.target.value)} placeholder="Подтверждение пароля" />
                {error && <div>{error}</div>}
                <button type="submit">Зарегистрироваться</button>
            </form>
        </AuthForms>
    );
}