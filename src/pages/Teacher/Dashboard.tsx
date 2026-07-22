import React, { useState } from 'react';
import TeacherLayout from './TeacherLayout';
import DashboardTab from './DashboardTab';
import MyCoursesTab from './MyCoursesTab';
import CreateCourseTab from './CreateCourseTab';
import ContentLibraryTab from './ContentLibraryTab';
import StudentsTab from './StudentsTab';
import AnalyticsTab from './AnalyticsTab';
import ReviewsTab from './ReviewsTab';
import CertificatesTab from './CertificatesTab';
import ReportsTab from './ReportsTab';
import ManageCurriculumTab from './ManageCurriculumTab';
import TermsAndConditions from '../TermsAndConditions';
import { useTheme } from '../../contexts/ThemeContext';
import { Course } from '../../types/course';

export default function TeacherDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const { theme } = useTheme();
  const isLight = theme === 'light';

  const handleSetActiveTab = (tab: string) => {
    if (tab !== 'edit' && tab !== 'curriculum') {
      setEditingCourse(null);
    }
    setActiveTab(tab);
  };

  // Renders the correct tab view depending on selection
  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardTab setActiveTab={handleSetActiveTab} />;
      case 'courses':
        return <MyCoursesTab setActiveTab={handleSetActiveTab} setEditingCourse={setEditingCourse} />;
      case 'create':
        return <CreateCourseTab setActiveTab={handleSetActiveTab} />;
      case 'edit':
        return <CreateCourseTab setActiveTab={handleSetActiveTab} courseToEdit={editingCourse} />;
      case 'curriculum':
        return <ManageCurriculumTab setActiveTab={handleSetActiveTab} course={editingCourse!} />;
      case 'library':
        return <ContentLibraryTab />;
      case 'students':
        return <StudentsTab />;
      case 'analytics':
        return <AnalyticsTab />;
      case 'reviews':
        return <ReviewsTab />;
      case 'certificates':
        return <CertificatesTab />;
      case 'reports':
        return <ReportsTab />;
      case 'resources':
        return (
          <div className="space-y-4">
            <h1 className={`text-lg font-black ${isLight ? 'text-slate-800' : 'text-white'}`}>Resources</h1>
            <p className="text-xs text-slate-400 font-semibold">Teacher and instructor guide files, curriculum structures, and resources downloads.</p>
          </div>
        );
      case 'marketing':
        return (
          <div className="space-y-4">
            <h1 className={`text-lg font-black ${isLight ? 'text-slate-800' : 'text-white'}`}>Marketing Tools</h1>
            <p className="text-xs text-slate-400 font-semibold">Generate coupons, links campaigns, and courses promotions configurations.</p>
          </div>
        );
      case 'announcements':
        return (
          <div className="space-y-4">
            <h1 className={`text-lg font-black ${isLight ? 'text-slate-800' : 'text-white'}`}>Announcements</h1>
            <p className="text-xs text-slate-400 font-semibold">Create and broadcast announcements notifications to all student classes.</p>
          </div>
        );
      case 'profile':
        return (
          <div className="space-y-4">
            <h1 className={`text-lg font-black ${isLight ? 'text-slate-800' : 'text-white'}`}>My Profile</h1>
            <p className="text-xs text-slate-400 font-semibold">Configure your coach biography, avatar, certifications and achievements details.</p>
          </div>
        );
      case 'settings':
        return (
          <div className="space-y-4">
            <h1 className={`text-lg font-black ${isLight ? 'text-slate-800' : 'text-white'}`}>Settings</h1>
            <p className="text-xs text-slate-400 font-semibold">Manage payout settings, API keys, visual themes, and notifications preferences.</p>
          </div>
        );
      case 'help':
        return (
          <div className="space-y-4">
            <h1 className={`text-lg font-black ${isLight ? 'text-slate-800' : 'text-white'}`}>Help & Support</h1>
            <p className="text-xs text-slate-400 font-semibold">Contact support admins, read documentation, and browse teaching tips.</p>
          </div>
        );
      case 'terms':
        return <TermsAndConditions role="teacher" />;
      default:
        return <DashboardTab setActiveTab={handleSetActiveTab} />;
    }
  };

  return (
    <TeacherLayout activeTab={activeTab} setActiveTab={handleSetActiveTab}>
      {renderTabContent()}
    </TeacherLayout>
  );
}
