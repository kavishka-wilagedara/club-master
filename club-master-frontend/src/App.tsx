import { BrowserRouter, Routes, Route } from "react-router-dom"



import React from "react";
// import Newclub from './admin/Newclub'
import Home from './pages/Home';
import About from './pages/About';
import Contact  from './pages/Contact';
import Login  from './pages/Login';
import Signup  from './pages/Signup';
import Faqs  from './pages/Faqs';
import Privacy  from './pages/Privacy';
import Clubhome  from './pages/Clubhome';
import Term  from './pages/Term';
import Rotractlogin  from './pages/Rotractlogin';
// import Adminsidebar  from './components/Adminsidebar';
import Rotract  from './Rotractclub/Rotract';
import Leologin  from './pages/Leologin';
// import Clubadmin  from './components/Clubadmin';
import Isacalogin  from './pages/Isacalogin';
import Rotractcontact  from './Rotractclub/Rotractcontact';
import Rotractabout  from './Rotractclub/Rotractabout';
import Rotractevent  from './Rotractclub/Rotractevent';
import Rotractnews  from './Rotractclub/Rotractnews';
import Userprofile  from './pages/Userprofile';
import { UserProvider } from "./common/UserContext";
import ViewMyClubs from "./pages/ViewMyClubs";
import MainAdminDashboard from "./admin/MainAdminDashboard";
// import Clubadmin from "./components/Clubadmin";
import ClubAdminDashboard from "./club-admin/ClubAdminDashboard";
import ViewMyOngoingEvents from "./pages/ViewMyOngoingEvents";
import ViewAllMyOngoingEvents from "./pages/ViewAllMyOngoingEvents";
import ViewMyUpComingEvents from "./pages/ViewMyUpComingEvents";
import ViewMyPastEvents from "./pages/ViewMyPastEvents";
import ViewMyNews from "./pages/ViewMyNews";
import ViewAllNews from "./pages/ViewAllNews";
// import ViewMyEvents from "./pages/ViewMyEvents";







function App() {

  return (
    <UserProvider>
         <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home/>}/>
      <Route path="about" element={<About/>}/>
      <Route path="contact" element={<Contact/>}/>
      <Route path="login" element={<Login/>}/>
      <Route path="signup" element={<Signup/>}/>
      <Route path="faqs" element={<Faqs/>}/>
      <Route path="privacy" element={<Privacy/>}/>
      <Route path="clubhome" element={<Clubhome/>}/>
      <Route path="term" element={<Term/>}/>
      <Route path="rotractlogin" element={<Rotractlogin/>}/>
      {/* <Route path="adminsidebar" element={<Adminsidebar/>}/> */}
      <Route path="rotract" element={<Rotract/>}/>
      <Route path="leologin" element={<Leologin/>}/>
      {/* <Route path="clubadmin" element={<Clubadmin/>}/> */}
      <Route path="isacalogin" element={<Isacalogin/>}/>
      <Route path="rotractcontact" element={<Rotractcontact/>}/>
      <Route path="rotractevent" element={<Rotractevent/>}/>
      <Route path="rotractnews" element={<Rotractnews/>}/>
      <Route path="userprofile" element={<Userprofile/>}/>
      <Route path="rotractabout" element={<Rotractabout/>}/>
      {/* <Route path="newclub" element={<Newclub/>}/>  */}
      <Route path="myclub" element={<ViewMyClubs/>}/>
      <Route path="mainAdmin" element={<MainAdminDashboard/>}/>
      <Route path="myOnGoingEvents" element={<ViewMyOngoingEvents/>}/>
      <Route path="myAllOnGoingEvents" element={<ViewAllMyOngoingEvents/>}/>
      <Route path="myAllUpcomingEvents" element={<ViewMyUpComingEvents/>}/>
      <Route path="myAllPastEvents" element={<ViewMyPastEvents/>}/>
      <Route path="myAllMyNews" element={<ViewMyNews/>}/>
      <Route path="myNews" element={<ViewAllNews/>}/>
      <Route path="clubAdmin" element={<ClubAdminDashboard/>}/>


     
     </Routes>
    </BrowserRouter>
    </UserProvider>
   
  )
}

export default App;
