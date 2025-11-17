import {LandingSite} from "./LandingSite.tsx";
import { Navigate, Route, Routes } from "react-router-dom";

export const LandingSiteRouting = () => {
    return (
        <Routes>
            <Route path="/" element={<LandingSite />} />
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
};
