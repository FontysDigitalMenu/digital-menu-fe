const AuthService = {
    isAuthenticated: false,

    async checkAuthentication(config) {
        const token = localStorage.getItem('accessToken');

        if (!token) {
            this.isAuthenticated = false;
            return false;
        }

        try {
            const response = await fetch(`${config.API_URL}/api/v1/User/info`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
            });

            if (!response.ok) {
                console.error('Login failed');
                this.isAuthenticated = false;
                return false;
            }

            const data = await response.json();

            if (data.includes('Admin')) {
                console.log('User successfully logged in');
                this.isAuthenticated = true;
                return true;
            } else {
                console.error('User does not have permission');
                this.isAuthenticated = false;
                return false;
            }
        } catch (error) {
            console.error('Error during login:', error);
            this.isAuthenticated = false;
            return false;
        }
    },

    async refreshAccessToken(config) {
        const refreshToken = localStorage.getItem('refreshToken');

        if (!refreshToken) {
            console.error('Refresh token not found');
            return;
        }

        try {
            const response = await fetch(`${config.API_URL}/api/refresh`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ refreshToken })
            });

            if (!response.ok) {
                console.error('Failed to refresh access token');
                this.isAuthenticated = false;
                return;
            }

            const data = await response.json();
            localStorage.setItem('accessToken', data.accessToken);
        } catch (error) {
            console.error('Error refreshing access token:', error);
            this.isAuthenticated = false;
        }
    }
};

export default AuthService;
