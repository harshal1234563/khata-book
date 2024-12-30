import usersRoutes from "./users.routes.js";

const API_PREFIX = '/api/v1';
export const getURL = (url) => `${API_PREFIX}/${url}`;


export default (app) => {
    app.use(getURL('user'),usersRoutes)
}
