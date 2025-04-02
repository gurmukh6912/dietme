import { useState, FormEvent } from 'react'
import { useHistory, Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import {
  Box,
  Button,
  Container,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Text,
  useToast,
  InputGroup,
  InputRightElement,
  IconButton,
  FormErrorMessage,
  Heading,
} from '@chakra-ui/react'
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons'

export const SignUp = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const { signUp } = useAuth()
  const history = useHistory()
  const toast = useToast()

  const validatePassword = () => {
    if (password !== confirmPassword) {
      return 'Passwords do not match'
    }
    if (password.length < 8) {
      return 'Password must be at least 8 characters long'
    }
    if (!/[A-Z]/.test(password)) {
      return 'Password must contain at least one uppercase letter'
    }
    if (!/[a-z]/.test(password)) {
      return 'Password must contain at least one lowercase letter'
    }
    if (!/[0-9]/.test(password)) {
      return 'Password must contain at least one number'
    }
    if (!/[!@#$%^&*]/.test(password)) {
      return 'Password must contain at least one special character (!@#$%^&*)'
    }
    return ''
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    const passwordError = validatePassword()

    if (passwordError) {
      toast({
        title: 'Validation Error',
        description: passwordError,
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
      return
    }

    setIsLoading(true)

    try {
      await signUp(email, password)
      toast({
        title: 'Account created!',
        description: 'Please check your email for verification code.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      })
      history.push('/confirm-signup', { email })
    } catch (error: any) {
      let errorMessage = 'Failed to create account'

      switch (error.name) {
        case 'UsernameExistsException':
          errorMessage = 'An account with this email already exists'
          break
        case 'InvalidPasswordException':
          errorMessage = 'Password does not meet requirements'
          break
        case 'InvalidParameterException':
          errorMessage = 'Please provide a valid email address'
          break
        default:
          errorMessage = error.message || 'An unexpected error occurred'
      }

      toast({
        title: 'Error',
        description: errorMessage,
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    } finally {
      setIsLoading(false)
    }
  }

  const passwordError = password ? validatePassword() : ''

  return (
    <Container
      maxW="lg"
      py={{ base: '12', md: '24' }}
      px={{ base: '0', sm: '8' }}
    >
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
            Create New Account
          </Heading>

          <Text fontSize="lg" color="gray.600" textAlign="center">
            Sign up to get started
          </Text>

          <form onSubmit={handleSubmit} style={{ width: '100%' }}>
            <VStack spacing="5">
              <FormControl isRequired>
                <FormLabel htmlFor="email">Email</FormLabel>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  size="lg"
                  autoComplete="email"
                />
              </FormControl>

              <FormControl isRequired isInvalid={!!passwordError}>
                <FormLabel htmlFor="password">Password</FormLabel>
                <InputGroup size="lg">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    autoComplete="new-password"
                  />
                  <InputRightElement>
                    <IconButton
                      variant="ghost"
                      aria-label={
                        showPassword ? 'Hide password' : 'Show password'
                      }
                      icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                      onClick={() => setShowPassword(!showPassword)}
                    />
                  </InputRightElement>
                </InputGroup>
                <FormErrorMessage>{passwordError}</FormErrorMessage>
              </FormControl>

              <FormControl isRequired>
                <FormLabel htmlFor="confirm-password">
                  Confirm Password
                </FormLabel>
                <InputGroup size="lg">
                  <Input
                    id="confirm-password"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    placeholder="Confirm your password"
                    autoComplete="new-password"
                  />
                  <InputRightElement>
                    <IconButton
                      variant="ghost"
                      aria-label={
                        showConfirmPassword ? 'Hide password' : 'Show password'
                      }
                      icon={
                        showConfirmPassword ? <ViewOffIcon /> : <ViewIcon />
                      }
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
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
                Sign up
              </Button>
            </VStack>
          </form>

          <Text color="gray.600">
            Already have an account?{' '}
            <Link to="/login">
              <Text
                as="span"
                color="teal.600"
                _hover={{ textDecoration: 'underline' }}
              >
                Sign in
              </Text>
            </Link>
          </Text>
        </VStack>
      </Box>
    </Container>
  )
}
