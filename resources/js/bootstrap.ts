import axios from 'axios';
window.axios = axios;

window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
// Send XSRF cookie as CSRF token header automatically
window.axios.defaults.withCredentials = true;
window.axios.defaults.withXSRFToken = true;

// Also read the CSRF token from the Blade meta tag as a fallback
const csrfMeta = document.head.querySelector('meta[name="csrf-token"]') as HTMLMetaElement | null;
if (csrfMeta) {
    window.axios.defaults.headers.common['X-CSRF-TOKEN'] = csrfMeta.content;
}
