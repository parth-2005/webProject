import { Navigate, Outlet, Route, Routes } from "react-router-dom";

import Sidebar from "./components/layout/Sidebar.jsx";
import Topbar from "./components/layout/Topbar.jsx";
import RoleGuard from "./components/layout/RoleGuard.jsx";
import AppointmentCalendar from "./pages/appointments/AppointmentCalendar.jsx";
import AppointmentList from "./pages/appointments/AppointmentList.jsx";
import BookingModal from "./pages/appointments/BookingModal.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import DoctorList from "./pages/doctors/DoctorList.jsx";
import ScheduleConfig from "./pages/doctors/ScheduleConfig.jsx";
import Login from "./pages/Login.jsx";
import PatientDetail from "./pages/patients/PatientDetail.jsx";
import PatientForm from "./pages/patients/PatientForm.jsx";
import PatientList from "./pages/patients/PatientList.jsx";
import AnalyticsDashboard from "./pages/analytics/AnalyticsDashboard.jsx";
import NotesFormatter from "./pages/ai/NotesFormatter.jsx";

function AppLayout() {
  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-[260px_1fr]">
      <Sidebar />
      <div className="flex flex-col min-h-screen">
        <Topbar />
        <main className="p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<AppLayout />}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="patients" element={<PatientList />} />
        <Route path="patients/new" element={<RoleGuard allowedRoles={["admin", "receptionist"]}><PatientForm /></RoleGuard>} />
        <Route path="patients/:id" element={<PatientDetail />} />
        <Route path="patients/:id/edit" element={<RoleGuard allowedRoles={["admin", "receptionist"]}><PatientForm /></RoleGuard>} />
        <Route path="appointments" element={<AppointmentList />} />
        <Route path="appointments/calendar" element={<AppointmentCalendar />} />
        <Route path="appointments/book" element={<BookingModal />} />
        <Route path="doctors" element={<DoctorList />} />
        <Route path="doctors/schedule" element={<ScheduleConfig />} />
        <Route path="analytics" element={<AnalyticsDashboard />} />
        <Route path="ai/notes" element={<RoleGuard allowedRoles={["doctor", "admin"]}><NotesFormatter /></RoleGuard>} />
      </Route>
    </Routes>
  );
}

export default App;
