import usersRoutes from "./users.routes.js";
import storeRoutes from "./store.routes.js";
import customersRoutes from "./customers.routes.js";

const API_PREFIX = '/api/v1';
export const getURL = (url) => `${API_PREFIX}/${url}`;


export default (app) => {
    app.use(getURL('user'), usersRoutes)
    app.use(getURL('store'), storeRoutes)
    app.use(getURL('customer'), customersRoutes)
}
