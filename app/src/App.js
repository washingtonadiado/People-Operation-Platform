import { Routes, Route } from "react-router-dom";
import { useState } from "react";
import "./App.css";
import MainPage from "./components/MainPage";
import Login from "./components/Login";
import DashBoardHr from "./components/hrUI/DashBoardHr";
import DashBoardEmployee from "./components/employeeUI/DashBoardEmployee";
import Trainings from "./components/hrUI/Trainings";
import AddEmployeeForm from "./components/hrUI/AddEmployee";
import UpdateTrainings from "./components/hrUI/UpdateTrainings";
import ViewEmployeesDocuments from "./components/hrUI/ViewEmployeesDocuments";
import VerifyDocuments from "./components/hrUI/VerifyDocuments";
import EducationDocumentUpload from "./components/employeeUI/EducationDocumentUpload";
import ViewEducation from "./components/employeeUI/ViewEducation";
import UpdateEducation from "./components/employeeUI/UpdateEducation";
import ViewDocuments from "./components/employeeUI/ViewDocuments";
import UpdateDocuments from "./components/employeeUI/UpdateDocuments";
import ViewLeaves from "./components/employeeUI/ViewLeaves";
import UpdateLeave from "./components/employeeUI/UpdateLeave";
import EmployeeProfileForm from "./components/employeeUI/EmployeeProfileForm";
import EmployeeProfile from "./components/employeeUI/EmployeeProfile";
import EditProfileForm from "./components/employeeUI/EditProfileForm";
import Session from "./components/hrUI/Session";
import UpdateSession from "./components/hrUI/UpdateSession";
import Profile from "./components/hrUI/Profile";
import LeaveApprovalForm from "./components/hrUI/PendingLeavesHr";
import DashBoardManager from "./components/managerUI/DashBoardManager";
import ManagerApprovedLeaves from "./components/managerUI/ManagerApprovedLeaves";
import ViewExperience from './components/employeeUI/ViewAddExperience';
import Goals from "./components/employeeUI/ViewGoalsEmployee";
import ViewPayslipEmployee from "./components/employeeUI/ViewPayslipEmployee";
import EmployeeViewTrainings from "./components/employeeUI/EmployeeViewTrainings";
import CreatePayslip from "./components/hrUI/CreatePayslip";
import ViewStaffEducation from "./components/hrUI/ViewStaffEducation";
import DeleteEmployeeForm from "./components/hrUI/DeleteEmployee";
import ManagerPendingLeaves from "./components/managerUI/LeaveApproval_Manager";
import CreateProfile from "./components/hrUI/CreateProfile";
import EditProfile from "./components/hrUI/EditProfile";
import ViewDepartmentTrainings from "./components/managerUI/ViewDepartmentTrainings";
import RecommendTraining from "./components/managerUI/RecommendTraining";
import ViewEmployeesPerDepartment from "./components/managerUI/ViewEmployeesPerDepartment";
import ManagerProfile from "./components/managerUI/ManagerProfile";
import ViewPayslipHr from "./components/hrUI/ViewPayslipHr";
import ViewStaffDetails from './components/hrUI/ViewStaffDetails';
import ManagerEditProfile from './components/managerUI/ManagerEditProfile';
import ManagerCreateProfile from './components/managerUI/ManagerCreateProfile'
import ViewDepartments from './components/managerUI/ViewDepartments';
import UpdateDepartment from './components/managerUI/UpdateDepartments';
import ViewTrainingsEmployee from './components/employeeUI/ViewTrainingsEmployee';
import ViewManagers from './components/hrUI/ViewManagers';
import ViewHrPersonnel from './components/hrUI/ViewHrPersonnel';
import AddGoalForm from './components/employeeUI/AddGoalsEmployee'
import ResetPassword from './components/ResetPassword';
import ChangePassword from "./components/ChangePassword";
import HRViewLeaves from './components/hrUI/HRViewLeaves';
import UpdateExperience from './components/employeeUI/UpdateExperience';

function App() {
  const [trainings, setTrainings] = useState([]);
  const [sessions, setSessions] = useState([]);

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/reset_password" element={<ResetPassword />} />
        <Route path="/change_password" element={<ChangePassword />} />
        <Route path="/session" element={<Session />} />
        <Route path="/employee" element={<DashBoardEmployee />}>
        <Route path="/employee/view_education/:employeeId" element={<ViewEducation />} />
        <Route path="/employee/add_education" element={<EducationDocumentUpload />}/>
        <Route path="/employee/update_document/:id" element={<UpdateDocuments />} />
        <Route path="/employee/view_leaves/:id" element={<ViewLeaves />} />
        <Route path="/employee/update_leave/:id" element={<UpdateLeave />} />
        <Route path="/employee/profile" element={<EmployeeProfile/>} />
        <Route path="/employee/profile/create" element={<EmployeeProfileForm />} />
        <Route path="/employee/profile/edit" element={<EditProfileForm />} />
        <Route path="/employee/view_documents/:id" element={<ViewDocuments />} />
        <Route path="/employee/view_trainings/:id" element={<EmployeeViewTrainings/>} /> 
        <Route path="/employee/update_education/:id" element={<UpdateEducation />} />
        <Route path="/employee/goals" element={<Goals />}/>
        <Route path="/employee/view_education/:id" element={<ViewEducation />} />
        <Route path="/employee/goals" element={<Goals />}/>
        <Route path="/employee/view_experience" element={<ViewExperience />}/>
        <Route path="/employee/update_experience/:id" element={<UpdateExperience />} />
        <Route path="/employee/payslip" element={<ViewPayslipEmployee />} />
        <Route path="/employee/view_trainings_employee" element={<ViewTrainingsEmployee />} />
        <Route path="/employee/add_goals" element={<AddGoalForm />} /> 
        <Route path="/employee/update-experience/:id" element={<UpdateExperience />} />

       </Route>

        <Route path="/hr" element={<DashBoardHr />} >
        <Route path="/hr/training_page" element={<Trainings trainings={trainings} setTrainings={setTrainings} />  } />
        <Route path="/hr/add_employee" element={<AddEmployeeForm />} />      
        <Route path="/hr/update_trainings/:id" element={<UpdateTrainings />} />
        <Route path="/hr/view_employees_documents" element={<ViewEmployeesDocuments />} />
        <Route path="/hr/verify_documents/:employeeId"  element={<VerifyDocuments />} />
        <Route path="/hr/hr_pending_leaves" element={<LeaveApprovalForm />}/>
        <Route path="/hr/hr_profile" element={<Profile />}/>
        <Route path="/hr/staff_education" element={<ViewStaffEducation />}/>
        <Route path="/hr/view_staff_details" element={<ViewStaffDetails/>}/>
        <Route path="/hr/hr_delete_employee" element={<DeleteEmployeeForm />}/>
        <Route path="/hr/create_profile" element={<CreateProfile/>}/>
        <Route path="/hr/edit_profile" element={<EditProfile/>}/>
        <Route path="/hr/update_session/:id" element={<UpdateSession/>}/>
        <Route path="/hr/session" element={<Session sessions={sessions} setSessions={setSessions}/>}/>
        <Route path="/hr/create_payslip" element={<CreatePayslip />} />
        <Route path="/hr/view_employee_payslip" element={<ViewPayslipHr />} />
        <Route path="/hr/view_managers" element={<ViewManagers />} />
        <Route path="/hr/view_hr_personnel" element={<ViewHrPersonnel />} />
        <Route path="/hr/view_leaves" element={<HRViewLeaves />} />
        

        
        </Route>

        <Route path="/manager" element={<DashBoardManager />} >
        <Route path="/manager/manager_pending_leaves" element={<ManagerPendingLeaves />}/>
        <Route path="/manager/manager_approved_leaves" element={<ManagerApprovedLeaves />}/>
        <Route path="/manager/view_department_trainings" element={<ViewDepartmentTrainings />}/>
        <Route path="/manager/recommend_training/:employeeId" element={<RecommendTraining />}/>
        <Route path="/manager/department_employees/:deptId" element={<ViewEmployeesPerDepartment/>}/>
        <Route path="/manager/manager_profile" element={<ManagerProfile/>}/>
        <Route path="/manager/create_profile" element={<ManagerCreateProfile/>}/>
        <Route path="/manager/manager_update_profile" element={<ManagerEditProfile/>}/>
        <Route path="/manager/departments" element={<ViewDepartments/>}/>
        <Route path="/manager/update_departments/:id" element={<UpdateDepartment/>}/>

        </Route>

      </Routes>
    </div>
  );
}

export default App;
        