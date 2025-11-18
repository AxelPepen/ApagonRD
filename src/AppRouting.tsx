import {Navigate, Route, Routes} from "react-router-dom";
import {AuthPage} from "./modules/auth/AuthPage";
import {Error500} from "./modules/errors/components/Error500.tsx";
import {ErrorsLayout} from "./modules/errors/ErrorsLayout.tsx";
import {Error404} from "./modules/errors/components/Error404.tsx";
import {Error403} from "./modules/errors/components/Error403.tsx";
import {MainLayout} from "./modules/shared/main/MainLayout.tsx";
import {LandingSite} from "./modules/landingSite/LandingSite.tsx";
import {HomePage} from "./modules/home/HomePage.tsx";
import {MapaPage} from "./modules/Map/MapaPage.tsx";
import {ReportarPage} from "./modules/ReportSector/ReportarPage.tsx";
import {MisReportesPage} from "./modules/Reports/MisReportesPage.tsx";
import {ChangePasswordPage} from "./modules/auth/recover/ChangePasswordPage.tsx";

export const AppRouting = () => {
    return (
        <Routes>
            <Route path="/" element={<LandingSite />} />
            <Route path="/auth/change-password" element={<ChangePasswordPage />} />


            <Route path="/app/*" element={<MainLayout/>}>
                <Route index element={<Navigate to="inicio" replace/>}/>
                <Route path="inicio" element={<HomePage/>}/>
                <Route path="mapa" element={<MapaPage/>}/>
                <Route path="reportar" element={<ReportarPage/>}/>
                <Route path="mis-reportes" element={<MisReportesPage/>}/>
            </Route>

            <Route path="/auth/*" element={<AuthPage/>}/>

            <Route path="/errors" element={<ErrorsLayout/>}>
                <Route index element={<Error404/>}/>
                <Route path="403" element={<Error403/>}/>
                <Route path="404" element={<Error404/>}/>
                <Route path="500" element={<Error500/>}/>
            </Route>

            <Route path="*" element={<Navigate to="/errors/404" replace/>}/>
        </Routes>
    );
}