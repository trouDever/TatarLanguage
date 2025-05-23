import { Link, useLocation } from 'react-router-dom';
import styles from './Header.module.css';
import logo from '../../assets/images/logo.svg';
import { useAuth } from '../../contexts/AuthContext';

export default function Header() {
    const { user, logout } = useAuth();
    const { pathname } = useLocation();
    if (pathname === '/login' || pathname === '/register') return null;
    return (
        <header className={styles.header}>
            <nav className={styles.nav}>
                <div className={styles.nav__sections}>
                    <img className={styles.logo} src={logo} alt="logo" />
                    <Link to="/" className={styles.nav__sections_active}>Главная</Link>
                    <Link to="/">Курсы</Link>
                    <Link to="/">Мероприятия</Link>
                    <Link to="/">Контакты</Link>
                </div>
                <div className={styles.nav__auth}>
                    {user ? (
                        <button onClick={logout}>Выйти</button>
                    ) : (
                        <>
                            <Link to="/login">Вход</Link>
                            <Link to="/register">Регистрация</Link>
                        </>
                    )}
                </div>
            </nav>

        </header>
    );
}
