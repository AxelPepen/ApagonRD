import {MainNavbar} from "./MainNavbar.tsx";
import {Navigate, Outlet} from "react-router-dom";
import {AuthContextValue, useAuthContext} from "../../../contexts/AuthContext.tsx";
import {LoadingPage} from "../../../components/io/output/LoadingPage.tsx";

export const MainLayout = () => {
    const {validating, authenticated}: AuthContextValue = useAuthContext();

    if (validating) {
        return <LoadingPage/>
    } else if (authenticated) {
        return (
            <div className="flex flex-col h-screen overflow-hidden">
                <MainNavbar/>
                <main className="flex-1 content pt-20 overflow-hidden" id="content" role="content">
                    <div className="wrapper flex h-full flex-col overflow-hidden">
                        <Outlet/>
                    </div>
                </main>
            </div>
        )
    } else {
        return <Navigate to={'/auth/login'} replace={true}/>;
    }

}