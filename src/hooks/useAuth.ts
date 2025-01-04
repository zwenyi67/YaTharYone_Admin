import Cookies from "js-cookie"
import { useState } from "react"

export default function useAuth() {
	const token = Cookies.get("admin")
	const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!token)

	const userLogin = (token: string) => {
		Cookies.set("admin", token)

		setIsAuthenticated(true)
	}

	const userLogout = () => {
		Cookies.remove("admin")

		setIsAuthenticated(false)
	}

	return { isAuthenticated, userLogin, userLogout }
}
