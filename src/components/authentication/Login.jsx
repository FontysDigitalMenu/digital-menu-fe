import { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AuthService from '../../services/AuthService.jsx'
import ConfigContext from '../../provider/ConfigProvider.jsx'
import { useTranslation } from 'react-i18next'
import SettingsContext from '../../provider/SettingsProvider.jsx'

function Login({ setIsAuthenticated }) {
    const config = useContext(ConfigContext)
    const setting = useContext(SettingsContext)
    const { t } = useTranslation()
    const navigate = useNavigate()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const queryString = window.location.search
    const urlParams = new URLSearchParams(queryString)
    const intended = urlParams.get('intended') ?? 'admin'

    useEffect(() => {
        if (!setting) return
        document.title = setting.companyName
    }, [setting])

    const sendLoginRequest = async () => {
        try {
            const response = await fetch(`${config.API_URL}/api/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: email,
                    password: password,
                }),
            })

            if (!response.ok) {
                console.error('Login failed')
                navigate('/login')
                return
            }

            const data = await response.json()

            localStorage.setItem('accessToken', data.accessToken)
            localStorage.setItem('refreshToken', data.refreshToken)

            await AuthService.checkAuthentication(config)

            setIsAuthenticated(true)

            navigate(`/${intended}`)
        } catch (error) {
            console.error('Error during login:', error)
            navigate('/login')
        }
    }

    const handleSubmit = async (event) => {
        event.preventDefault()
        await sendLoginRequest().then((r) => r)
    }

    return (
        <div className="bg-gray-50">
            <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                <a href="#" className="flex items-center mb-6 text-2xl font-semibold text-gray-900">
                    <h1 className="text-4xl font-bold">{setting.companyName}</h1>
                </a>
                <div className="w-full bg-white rounded-lg shadow md:mt-0 sm:max-w-md xl:p-0">
                    <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                        <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">{t('Sign in to your account')}</h1>
                        <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
                            <div>
                                <label htmlFor="username" className="block mb-2 text-sm font-medium text-gray-900">
                                    {t('Email')}
                                </label>
                                <input
                                    type="email"
                                    name="username"
                                    id="username"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                    placeholder="username"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <div>
                                <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900">
                                    {t('Password')}
                                </label>
                                <input
                                    type="password"
                                    name="password"
                                    id="password"
                                    placeholder="••••••••"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                            <button type="submit" className={`w-full !bg-[${setting.primaryColor}] text-white hover:!bg-[${setting.secondaryColor}] focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center`}>
                                {t('Sign in')}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login
