import {Navigate, Route, Routes} from "react-router-dom";
import {LoginPage} from "./LoginPage.tsx";
import {RecoverPage} from "./recover/RecoverPage.tsx";
import {SendRecoverPasswordPage} from "./recover/SendRecoverPasswordPage.tsx";
import {RegisterPage} from "./RegisterPage.tsx";

export const AuthPage = () => {
    return (
        <Routes>
            <Route path="/" element={<Navigate to="/auth/login" replace/>}/>
            <Route path='login' element={<LoginPage/>}/>
            <Route path='register' element={<RegisterPage/>}/>
            <Route path='reset' element={<LoginPage/>}/>
            <Route path='recover' element={<RecoverPage/>}/>
            <Route path='send-recover' element={<SendRecoverPasswordPage/>}/>
        </Routes>
    )
}