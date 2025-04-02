import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
	signIn as amplifySignIn,
	signUp as amplifySignUp,
	confirmSignUp as amplifyConfirmSignUp,
	resetPassword as amplifyResetPassword,
	confirmResetPassword as amplifyConfirmResetPassword,
	resendSignUpCode,
	getCurrentUser,
	signOut as amplifySignOut,
	fetchAuthSession,
	autoSignIn,
} from 'aws-amplify/auth';
import { type AuthUser } from '@aws-amplify/auth';

interface AuthContextType {
	user: AuthUser | null;
	isAuthenticated: boolean;
	isLoading: boolean;
	signIn: (email: string, password: string) => Promise<any>;
	signUp: (email: string, password: string) => Promise<any>;
	confirmSignUp: (email: string, code: string) => Promise<any>;
	resetPassword: (email: string) => Promise<any>;
	confirmResetPassword: (email: string, code: string, newPassword: string) => Promise<any>;
	resendSignUp: (email: string) => Promise<any>;
	signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error('useAuth must be used within an AuthProvider');
	}
	return context;
};

interface AuthProviderProps {
	children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
	const [user, setUser] = useState<AuthUser | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [isMounted, setIsMounted] = useState(true);

	// Safe setState function that checks if component is mounted
	const safeSetState = <T extends any>(setter: React.Dispatch<React.SetStateAction<T>>) => (value: T) => {
		if (isMounted) {
			setter(value);
		}
	};

	const checkUser = async () => {
		if (!isMounted) return;

		try {
			// First try to get the current session
			const session = await fetchAuthSession();

			if (session.tokens) {
				const currentUser = await getCurrentUser();
				safeSetState(setUser)(currentUser);
			} else {
				// Try auto sign-in if available
				try {
					await autoSignIn();
					const currentUser = await getCurrentUser();
					safeSetState(setUser)(currentUser);
				} catch (autoSignInError) {
					safeSetState(setUser)(null);
				}
			}
		} catch (error) {
			console.log('No authenticated user found');
			safeSetState(setUser)(null);
		} finally {
			if (isMounted) {
				safeSetState(setIsLoading)(false);
			}
		}
	};

	useEffect(() => {
		setIsMounted(true);
		checkUser();

		// Set up session refresh interval
		const refreshInterval = setInterval(checkUser, 30 * 60 * 1000); // Refresh every 30 minutes

		return () => {
			setIsMounted(false);
			clearInterval(refreshInterval);
		};
	}, []);

	const signIn = async (email: string, password: string) => {
		try {
			const signInOutput = await amplifySignIn({ username: email, password });
			if (signInOutput.isSignedIn && isMounted) {
				await checkUser();
			}
			return signInOutput;
		} catch (error) {
			throw error;
		}
	};

	const signUp = async (email: string, password: string) => {
		try {
			const signUpOutput = await amplifySignUp({
				username: email,
				password,
				options: {
					userAttributes: {
						email,
					},
				},
			});
			return signUpOutput;
		} catch (error) {
			throw error;
		}
	};

	const confirmSignUp = async (email: string, code: string) => {
		try {
			const confirmSignUpOutput = await amplifyConfirmSignUp({
				username: email,
				confirmationCode: code,
			});
			return confirmSignUpOutput;
		} catch (error) {
			throw error;
		}
	};

	const resetPassword = async (email: string) => {
		try {
			const resetPasswordOutput = await amplifyResetPassword({
				username: email,
			});
			return resetPasswordOutput;
		} catch (error) {
			throw error;
		}
	};

	const confirmResetPassword = async (email: string, code: string, newPassword: string) => {
		try {
			const confirmResetPasswordOutput = await amplifyConfirmResetPassword({
				username: email,
				confirmationCode: code,
				newPassword,
			});
			return confirmResetPasswordOutput;
		} catch (error) {
			throw error;
		}
	};

	const resendSignUp = async (email: string) => {
		try {
			const resendSignUpOutput = await resendSignUpCode({
				username: email,
			});
			return resendSignUpOutput;
		} catch (error) {
			throw error;
		}
	};

	const signOut = async () => {
		try {
			await amplifySignOut({ global: true });
			if (isMounted) {
				safeSetState(setUser)(null);
			}
		} catch (error) {
			console.error('Error signing out:', error);
			throw error;
		}
	};

	const value = {
		user,
		isAuthenticated: !!user,
		isLoading,
		signIn,
		signUp,
		confirmSignUp,
		resetPassword,
		confirmResetPassword,
		resendSignUp,
		signOut,
	};

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}; 