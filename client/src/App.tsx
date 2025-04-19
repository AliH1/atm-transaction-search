import { Outlet, Route, Routes } from "react-router-dom";
import Transactions from "./components/Transactions"
import SideBar from "./components/SideBar";
import NotImplemented from "./components/NotImplemented";

function App() {

  const SidebarLayout = () => (
    //SideBar layout with jsx Topbar first then the sidebar and outlet that will render main content routes
    <div className="flex flex-col h-screen divide-y divide-solid divide-gray-300">
      <div className="flex justify-between bg-white gap-2 p-4">
        <div className="flex gap-2">
          <div className="w-8 h-8 border-white rounded-sm bg-[#bebbb4]"></div>
          <div className="flex flex-col justify-center">
            <div className="w-24 h-3 border-white rounded-sm bg-[#bebbb4]"></div>
          </div>

        </div>
        <div className="w-8 h-8 bg-[#bebbb4] rounded-full"></div>
      </div>
      <div className="bg-[#faf9f7] flex stretch gap-4">
        <aside>
          <SideBar />
        </aside>
        <main className="flex-1 p-10 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );

  return (
    <Routes>
      <Route element={<SidebarLayout/>}>
        <Route path="/" element={<Transactions />} />
        <Route path="/settings/userMangement" element={<NotImplemented />} />
        <Route path="/settings/atmMangement" element={<NotImplemented />} />
        <Route path="/settings/account" element={<NotImplemented />} />
      </Route>
  </Routes>
  )
}

export default App
