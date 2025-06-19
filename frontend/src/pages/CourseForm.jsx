import React, { useState } from 'react';
import { createCourse } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

export default function CourseForm() {
    const { access } = useAuth();
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        start_date: '',
        end_date: '',
        level: '1',
        photo: null,
    });

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === 'photo') {
            setFormData({ ...formData, photo: files[0] });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const fileToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result.split(',')[1]);
            reader.onerror = error => reject(error);
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Подготовка данных для отправки
        const dataToSend = {
            name: formData.name,
            description: formData.description,
            start_date: formData.start_date,
            end_date: formData.end_date,
            level: formData.level,
        };

        // Если есть файл, конвертируем в base64
        if (formData.photo) {
            try {
                dataToSend.photo = await fileToBase64(formData.photo);
                dataToSend.photo_name = formData.photo.name;
            } catch (err) {
                console.error('Ошибка конвертации файла:', err);
                alert('Ошибка обработки файла');
                return;
            }
        }

        console.log('Отправка JSON:', dataToSend);

        try {
            await createCourse(dataToSend, access);
            alert('Курс создан!');
        } catch (err) {
            console.error('Ошибка:', err.response?.data);
            alert('Ошибка создания курса: ' + (err.response?.data?.detail || err.message));
        }
    };

    return (
        <div className="content">
            <h2>Создание курса</h2>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 600 }}>
                <input type="text" name="name" placeholder="Название" value={formData.name} onChange={handleChange} required />
                <textarea name="description" placeholder="Описание" value={formData.description} onChange={handleChange} />
                <input type="date" name="start_date" value={formData.start_date} onChange={handleChange} />
                <input type="date" name="end_date" value={formData.end_date} onChange={handleChange} />
                <select name="level" value={formData.level} onChange={handleChange}>
                    <option value="1">A1</option>
                    <option value="2">A2</option>
                    <option value="3">B1</option>
                    <option value="4">B2</option>
                    <option value="5">C1</option>
                    <option value="6">C2</option>
                </select>
                <input type="file" name="photo" accept="image/*" onChange={handleChange} />
                <button type="submit" className="event-details__button">Создать курс</button>
            </form>
        </div>
    );
}