import { useState, FormEvent, useEffect } from 'react';
import { useHistory, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
	Box,
	Button,
	Container,
	FormControl,
	FormLabel,
	Input,
	VStack,
	Text,
	Heading,
	useToast,
	InputGroup,
	InputRightElement,
	IconButton,
} from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';

export const Login = () => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [showPassword, setShowPassword] = useState(false);
	const [isMounted, setIsMounted] = useState(true);
	const { signIn } = useAuth();
	const history = useHistory();
	const location = useLocation<{ from: { pathname: string } }>();
	const toast = useToast();

	const { from } = location.state || { from: { pathname: "/" } };

	useEffect(() => {
		setIsMounted(true);
		return () => {
			setIsMounted(false);
		};
	}, []);

	const showToast = (props: any) => {
		if (isMounted) {
			toast(props);
		}
	};

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();
		setIsLoading(true);

		try {
			const result = await signIn(email, password);
			if (result.isSignedIn) {
				if (isMounted) {
					showToast({
						title: 'Welcome back!',
						status: 'success',
						duration: 3000,
						isClosable: true,
					});
					history.replace(from);
				}
			} else if (result.nextStep.signInStep === 'CONFIRM_SIGN_UP') {
				history.push('/confirm-signup', { email });
			}
		} catch (error: any) {
			let errorMessage = 'Failed to sign in';

			if (error.name === 'UserNotConfirmedException') {
				history.push('/confirm-signup', { email });
				return;
			}

			switch (error.name) {
				case 'NotAuthorizedException':
					errorMessage = 'Incorrect email or password';
					break;
				case 'UserNotFoundException':
					errorMessage = 'No account found with this email';
					break;
				case 'NetworkError':
					errorMessage = 'Network error. Please check your connection';
					break;
				default:
					errorMessage = error.message || 'An unexpected error occurred';
			}

			if (isMounted) {
				showToast({
					title: 'Error',
					description: errorMessage,
					status: 'error',
					duration: 5000,
					isClosable: true,
				});
			}
		} finally {
			if (isMounted) {
				setIsLoading(false);
			}
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
						Welcome Back
					</Heading>

					<Text fontSize="lg" color="gray.600" textAlign="center">
						Sign in to your account to continue
					</Text>

					<form onSubmit={handleSubmit} style={{ width: '100%' }}>
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
								/>
							</FormControl>

							<FormControl isRequired>
								<FormLabel htmlFor="password">Password</FormLabel>
								<InputGroup size="lg">
									<Input
										id="password"
										type={showPassword ? 'text' : 'password'}
										value={password}
										onChange={(e) => setPassword(e.target.value)}
										placeholder="Enter your password"
										autoComplete="current-password"
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

							<Button
								type="submit"
								colorScheme="teal"
								size="lg"
								fontSize="md"
								isLoading={isLoading}
								width="full"
							>
								Sign in
							</Button>
						</VStack>
					</form>

					<VStack spacing="3">
						<Link to="/forgot-password">
							<Text color="teal.600" _hover={{ textDecoration: 'underline' }}>
								Forgot password?
							</Text>
						</Link>

						<Text color="gray.600">
							Don't have an account?{' '}
							<Link to="/signup">
								<Text as="span" color="teal.600" _hover={{ textDecoration: 'underline' }}>
									Sign up
								</Text>
							</Link>
						</Text>
					</VStack>
				</VStack>
			</Box>
		</Container>
	);
}; 