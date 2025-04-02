import { Amplify } from 'aws-amplify';

export const configureAuth = async () => {
	try {
		await Amplify.configure({
			Auth: {
				Cognito: {
					userPoolClientId: import.meta.env.VITE_COGNITO_CLIENT_ID || "otp93qgca9lviva98jblaoufp",
					userPoolId: import.meta.env.VITE_COGNITO_USER_POOL_ID || "us-east-1_eOValqLwZ",
					signUpVerificationMethod: 'code',
					loginWith: {
						email: true,
						username: false,
						phone: false
					}
				}
			}
		});
	} catch (error) {
		console.error('Error configuring Amplify:', error);
		throw error;
	}
}; 