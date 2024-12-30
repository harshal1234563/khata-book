import {getURL} from "../routes/apiFactor.routes.js";

const unProtectedRoutes = ['user/register', 'user/login', 'user/refresh-token'];

// *check route is protected!! checking negative condition if route includes in unProtectedRoutes arr then return false otherwise return true
const checkProtectedRoute = (route) => !unProtectedRoutes.some((unProtectedRoute) => {
        return getURL(unProtectedRoute) === route;
    }
)


export {checkProtectedRoute};