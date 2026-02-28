import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_BASEURL
})

// If a dev user id is stored in localStorage, attach it as a header for local testing
api.interceptors.request.use((config) => {
    try {
        const devUser = sessionStorage.getItem('dev_user')
        if (devUser) {
            config.headers = config.headers || {}
            config.headers['x-dev-user'] = devUser

            // Attach profile info if available (for auto-provisioning on server)
            try {
                const userDataString = sessionStorage.getItem('mock_user_data');

                const userData = JSON.parse(userDataString)
                if (userData) {
                    if (userData.fullName) config.headers['x-dev-user-fullname'] = userData.fullName
                    if (userData.primaryEmailAddress?.emailAddress) config.headers['x-dev-user-email'] = userData.primaryEmailAddress.emailAddress
                    if (userData.imageUrl) config.headers['x-dev-user-image'] = userData.imageUrl
                }
            } catch (err) {
                // ignore parse error
            }
        }
    } catch (e) {
        // ignore in non-browser environments
    }
    return config
})

export default api