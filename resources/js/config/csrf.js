import axios from 'axios';
/**
 * Fetches CSRF cookie and extracts the XSRF-TOKEN from cookies
 * @returns {Promise<string|null>} The decoded XSRF token or null if not found
 */
export async function getCsrfToken() {
    try {
        // Step 1: Request CSRF cookie
        await axios.get('http://localhost:8000/sanctum/csrf-cookie', {
            withCredentials: true
        });

        // Step 2: Extract XSRF-TOKEN from document.cookie
        const xsrfToken = document.cookie
            .split('; ')
            .find(cookie => cookie.startsWith('XSRF-TOKEN='))
            ?.split('=')[1];
        console.log(xsrfToken)
        if (!xsrfToken) {
            console.error('XSRF-TOKEN not found in cookies');
            return null;
        }

        return decodeURIComponent(xsrfToken);
    } catch (error) {
        console.error('Error fetching CSRF token:', error);
        return null;
    }
}