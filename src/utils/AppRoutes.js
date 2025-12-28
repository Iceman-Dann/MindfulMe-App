import React from "react";
import { Routes, Route } from "react-router-dom";
import LandingPage from "../components/LandingPage";
import Home from "../components/Home";
// import MoodTracker from "../components/MoodTracker";
// import SupportGroups from "../components/SupportGroups";
import Login from "../components/Profile/Login/Login";
import Logout from "../components/Profile/Logout/Logout";
import Join from "../components/Profile/Join";
// import PrivateRoute from "../components/PrivateRoute";
import MemoryMatch from "../components/MemoryMatch";
import CopingStrategies from "../components/CopingStrategies";
import CBT from "../components/CBT";
// import GoalSetting from '../components/GoalSetting';
// import UsersList from "../components/Chat/UserList/UserList";
// import ChatMessages from "../components/Chat/ChatMessages/ChatMessages";
import SelfAssessment from "../components/SelfAssessment";
import DrawingApp from "../components/DrawingApp";
import GuidedMeditation from "../components/GuidedMeditation";
import Survey from "../components/Survey";
import AdminSurveyReplies from "../components/Survey/AdminSurveyReplies.js";
// import HabitTracker from '../components/HabitTracker';
import Chatbot from "../components/Chatbot";
import LivingAIProfile from "../components/Profile/LivingAIProfile";
import ChangePassword from "../components/Profile/ChangePassword";
// import MoodDetection from '../components/MoodDetection';
// import WellnessEngine from '../components/WellnessEngine';
// import CrisisDetection from '../components/CrisisDetection';
// import WellnessJourney from '../components/WellnessJourney';
// import RealAIChatbot from '../components/RealAIChatbot';
// import VoiceEmotionDetector from '../components/VoiceEmotionDetector';
// import CrisisInterventionSystem from '../components/CrisisInterventionSystem';
// import PersonalizedWellnessJourney from '../components/PersonalizedWellnessJourney';
// import InstantAIDemo from '../components/InstantAIDemo';

const AppRoutes = () => {
  return (
    <Routes>
      <Route exact path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/logout" element={<Logout />} />
      <Route path="/join" element={<Join />} />
      <Route path="/home" element={<Home />} />
      <Route path="/memory-match" element={<MemoryMatch />} />
      <Route path="/coping-strategies" element={<CopingStrategies />} />
      <Route path="/cbt" element={<CBT />} />
      <Route path="/guided-meditation" element={<GuidedMeditation />} />
      <Route path="/self-assessment" element={<SelfAssessment />} />
      <Route path="/draw" element={<DrawingApp />} />
      <Route path="/profile" element={<LivingAIProfile />} />
      {/* <Route path="/goal-setting" element={<GoalSetting />} /> */}
      <Route path="/chatbot" element={<Chatbot />} />
      {/* <Route path="/habit-tracker" element={<HabitTracker />} /> */}
      <Route path="/survey" element={<Survey />} />
      <Route path="/survey-list" element={<AdminSurveyReplies />} />
      <Route path="/change-password" element={<ChangePassword />} />
    </Routes>
  );
};

export default AppRoutes;
