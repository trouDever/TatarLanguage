import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import OrganizationProfile from './pages/OrganizationProfile';
import Dashboard from './pages/Dashboard';
import HomePage from './pages/HomePage';
import ProtectedRoute from './components/ProtectedRoute';
import Events from "./pages/Events";
import EventDetail from "./pages/EventDetail/EventDetail";
import Courses from './pages/Courses';
import CourseDetail from './pages/CourseDetail';
import CreateCourse from './pages/CreateCourse';
import EditCourse from './pages/EditCourse';
import Exams from './pages/Exams';
import ExamDetail from './pages/ExamDetail';
import CreateExam from './pages/CreateExam';
import EditExam from './pages/EditExam';

export default function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/events" element={<Events />} />
            <Route path="/events-detail" element={<EventDetail />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route
                path="/profile"
                element={
                    <ProtectedRoute>
                        <ProfilePage />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/organization-profile"
                element={
                    <ProtectedRoute>
                        <OrganizationProfile />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/dashboard"
                element={
                    <ProtectedRoute>
                        <Dashboard />
                    </ProtectedRoute>
                }
            />
            <Route path="/courses" element={<Courses />} />
            <Route path="/courses/:id" element={<CourseDetail />} />
            <Route path="/courses/create" element={<CreateCourse />} />
            <Route path="/courses/:id/edit" element={<EditCourse />} />
            <Route path="/exams" element={<Exams />} />
            <Route path="/exams/:id" element={<ExamDetail />} />
            <Route path="/exams/create" element={<CreateExam />} />
            <Route path="/exams/:id/edit" element={<EditExam />} />
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}
