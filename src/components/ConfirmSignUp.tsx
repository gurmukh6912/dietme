import { useState, FormEvent } from 'react';
import { useHistory, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
	Box,
	Button,
	FormControl,
	FormLabel,
	VStack,
	Text,
	useToast,
	Container,
	Heading,
	HStack,
	PinInput,
	PinInputField,
} from '@chakra-ui/react';

interface LocationState {
	email: string;
}

export const ConfirmSignUp = () => {
	const [verificationCode, setVerificationCode] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [isResending, setIsResending] = useState(false);
	const { confirmSignUp, resendSignUp } = useAuth();
	const history = useHistory();
	const location = useLocation<LocationState>();
	const toast = useToast();

	const email = location.state?.email;

	if (!email) {
		history.replace('/signup');
		return null;
	}

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();
		setIsLoading(true);

		try {
			await confirmSignUp(email, verificationCode);
			toast({
				title: 'Success!',
				description: 'Your email has been verified. You can now sign in.',
				status: 'success',
				duration: 5000,
				isClosable: true,
			});
			history.replace('/login');
		} catch (error: any) {
			let errorMessage = 'Failed to verify email';

			switch (error.name) {
				case 'CodeMismatchException':
					errorMessage = 'Invalid verification code';
					break;
				case 'ExpiredCodeException':
					errorMessage = 'Verification code has expired';
					break;
				default:
					errorMessage = error.message || 'An unexpected error occurred';
			}

			toast({
				title: 'Error',
				description: errorMessage,
				status: 'error',
				duration: 5000,
				isClosable: true,
			});
		} finally {
			setIsLoading(false);
		}
	};

	const handleResendCode = async () => {
		setIsResending(true);

		try {
			await resendSignUp(email);
			toast({
				title: 'Code Resent',
				description: 'A new verification code has been sent to your email',
				status: 'success',
				duration: 5000,
				isClosable: true,
			});
		} catch (error: any) {
			toast({
				title: 'Error',
				description: error.message || 'Failed to resend verification code',
				status: 'error',
				duration: 5000,
				isClosable: true,
			});
		} finally {
			setIsResending(false);
		}
	};

	return (
		<Container maxW="lg" py={{ base: '12', md: '24' }} px={{ base: '0', sm: '8' }}>
			<Box
				py={{ base: '8', sm: '8' }}
				px={{ base: '4', sm: '10' }}
				bg="white"
				boxShadow={{ base: 'none', sm: 'md' }}
				borderRadius={{ base: 'none', sm: 'xl' }}
			>
				<VStack spacing="6">
					<Heading
						size="xl"
						fontWeight="extrabold"
						textAlign="center"
						bgGradient="linear(to-r, teal.500, green.500)"
						bgClip="text"
					>
						Verify Your Email
					</Heading>

					<Text fontSize="lg" color="gray.600" textAlign="center">
						Please enter the verification code sent to {email}
					</Text>

					<form onSubmit={handleSubmit} style={{ width: '100%' }}>
						<VStack spacing="6">
							<FormControl isRequired>
								<FormLabel htmlFor="verification-code" textAlign="center">
									Verification Code
								</FormLabel>
								<HStack justify="center">
									<PinInput
										id="verification-code"
										otp
										size="lg"
										value={verificationCode}
										onChange={setVerificationCode}
									>
										<PinInputField />
										<PinInputField />
										<PinInputField />
										<PinInputField />
										<PinInputField />
										<PinInputField />
									</PinInput>
								</HStack>
							</FormControl>

							<VStack spacing="4" width="full">
								<Button
									type="submit"
									colorScheme="teal"
									size="lg"
									fontSize="md"
									isLoading={isLoading}
									width="full"
								>
									Verify Email
								</Button>

								<Button
									variant="ghost"
									onClick={handleResendCode}
									isLoading={isResending}
									size="lg"
									width="full"
								>
									Resend Code
								</Button>
							</VStack>
						</VStack>
					</form>

					<Text color="gray.600">
						Back to{' '}
						<Link to="/login">
							<Text as="span" color="teal.600" _hover={{ textDecoration: 'underline' }}>
								Sign in
							</Text>
						</Link>
					</Text>
				</VStack>
			</Box>
		</Container>
	);
}; 