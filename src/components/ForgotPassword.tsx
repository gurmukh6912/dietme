import { useState, FormEvent } from 'react';
import { useHistory, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
	Box,
	Button,
	FormControl,
	FormLabel,
	Input,
	VStack,
	Text,
	useToast,
	Container,
	Heading,
	InputGroup,
	InputRightElement,
	IconButton,
} from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';

export const ForgotPassword = () => {
	const [email, setEmail] = useState('');
	const [code, setCode] = useState('');
	const [newPassword, setNewPassword] = useState('');
	const [showPassword, setShowPassword] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [codeSent, setCodeSent] = useState(false);
	const { resetPassword, confirmResetPassword } = useAuth();
	const history = useHistory();
	const toast = useToast();

	const validatePassword = (password: string) => {
		if (password.length < 8) {
			return 'Password must be at least 8 characters long';
		}
		if (!/[A-Z]/.test(password)) {
			return 'Password must contain at least one uppercase letter';
		}
		if (!/[a-z]/.test(password)) {
			return 'Password must contain at least one lowercase letter';
		}
		if (!/[0-9]/.test(password)) {
			return 'Password must contain at least one number';
		}
		if (!/[!@#$%^&*]/.test(password)) {
			return 'Password must contain at least one special character (!@#$%^&*)';
		}
		return '';
	};

	const handleRequestCode = async (e: FormEvent) => {
		e.preventDefault();
		setIsLoading(true);

		try {
			await resetPassword(email);
			setCodeSent(true);
			toast({
				title: 'Code Sent',
				description: 'Please check your email for the password reset code',
				status: 'success',
				duration: 5000,
				isClosable: true,
			});
		} catch (error: any) {
			let errorMessage = 'Failed to send reset code';

			switch (error.name) {
				case 'UserNotFoundException':
					errorMessage = 'No account found with this email';
					break;
				case 'LimitExceededException':
					errorMessage = 'Too many attempts. Please try again later';
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

	const handleResetPassword = async (e: FormEvent) => {
		e.preventDefault();
		const passwordError = validatePassword(newPassword);

		if (passwordError) {
			toast({
				title: 'Validation Error',
				description: passwordError,
				status: 'error',
				duration: 5000,
				isClosable: true,
			});
			return;
		}

		setIsLoading(true);

		try {
			await confirmResetPassword(email, code, newPassword);
			toast({
				title: 'Success!',
				description: 'Your password has been reset. You can now sign in with your new password.',
				status: 'success',
				duration: 5000,
				isClosable: true,
			});
			history.push('/login');
		} catch (error: any) {
			let errorMessage = 'Failed to reset password';

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
						Reset Password
					</Heading>

					<Text fontSize="lg" color="gray.600" textAlign="center">
						{codeSent
							? 'Enter the verification code sent to your email'
							: 'Enter your email to receive a verification code'}
					</Text>

					<form onSubmit={codeSent ? handleResetPassword : handleRequestCode} style={{ width: '100%' }}>
						<VStack spacing="5">
							<FormControl isRequired>
								<FormLabel htmlFor="email">Email</FormLabel>
								<Input
									id="email"
									type="email"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									placeholder="Enter your email"
									size="lg"
									autoComplete="email"
									isReadOnly={codeSent}
								/>
							</FormControl>

							{codeSent && (
								<>
									<FormControl isRequired>
										<FormLabel htmlFor="code">Verification Code</FormLabel>
										<Input
											id="code"
											value={code}
											onChange={(e) => setCode(e.target.value)}
											placeholder="Enter verification code"
											size="lg"
										/>
									</FormControl>

									<FormControl isRequired>
										<FormLabel htmlFor="new-password">New Password</FormLabel>
										<InputGroup size="lg">
											<Input
												id="new-password"
												type={showPassword ? 'text' : 'password'}
												value={newPassword}
												onChange={(e) => setNewPassword(e.target.value)}
												placeholder="Enter new password"
												autoComplete="new-password"
											/>
											<InputRightElement>
												<IconButton
													variant="ghost"
													aria-label={showPassword ? 'Hide password' : 'Show password'}
													icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
													onClick={() => setShowPassword(!showPassword)}
												/>
											</InputRightElement>
										</InputGroup>
									</FormControl>
								</>
							)}

							<Button
								type="submit"
								colorScheme="teal"
								size="lg"
								fontSize="md"
								isLoading={isLoading}
								width="full"
							>
								{codeSent ? 'Reset Password' : 'Send Code'}
							</Button>
						</VStack>
					</form>

					<Text color="gray.600">
						Remember your password?{' '}
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