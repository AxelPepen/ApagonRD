import {Navigate, Outlet, useLocation} from "react-router-dom";
import {useAuthContext} from "../../contexts/AuthContext.tsx";

const LOGIN_ROUTE = '/auth/login';
const HOME_ROUTE = '/app/inicio';

export const RequireAuth = () => {
    const {authenticated, validating} = useAuthContext();
    const location = useLocation();

    if (validating) {
        return null;
    }

    if (authenticated) {
        return <Outlet/>;
    }

    return (
        <Navigate to={LOGIN_ROUTE} state={{from: location.pathname}} replace/>
    );
};

export const GuestOnly = () => {
    const {authenticated, validating} = useAuthContext();

    if (validating) {
        return null;
    }

    if (authenticated) {
        return <Navigate to={HOME_ROUTE} replace/>;
    }

    return <Outlet/>;
};

