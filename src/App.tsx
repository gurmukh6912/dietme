import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect, RouteProps } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Login } from './components/Login';
import { SignUp } from './components/SignUp';
import { ConfirmSignUp } from './components/ConfirmSignUp';
import { ForgotPassword } from './components/ForgotPassword';
import { Dashboard } from './components/Dashboard';
import { configureAuth } from './config/auth';
import { ChakraProvider, Box, Spinner, Center } from '@chakra-ui/react';
import { MainLayout } from 'layout';
import { DietEditor } from 'diets';
import { FoodsStoreProvider } from 'foods';
import { PortionsStoreProvider } from 'portions';
import { OneTimeCheckStoreProvider, ScreenSizeProvider } from 'general';
import theme from 'theme';
import { loadFoods } from 'foods/persistence';
import 'scroll-polyfill/auto';

interface ProtectedRouteProps extends Omit<RouteProps, 'component'> {
  component: React.ComponentType<any>;
}

const ProtectedRoute = ({ component: Component, ...rest }: ProtectedRouteProps) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <Center h="100vh">
        <Spinner size="xl" color="teal.500" />
      </Center>
    );
  }

  return (
    <Route
      {...rest}
      render={props =>
        isAuthenticated ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{
              pathname: '/login',
              state: { from: props.location }
            }}
          />
        )
      }
    />
  );
};

const AppContent = () => {
  return (
    <Router basename="/">
      <Switch>
        <Route exact path="/login" component={Login} />
        <Route exact path="/signup" component={SignUp} />
        <Route exact path="/confirm-signup" component={ConfirmSignUp} />
        <Route exact path="/forgot-password" component={ForgotPassword} />
        <ProtectedRoute exact path="/" component={Dashboard} />
        <Redirect to="/" />
      </Switch>
    </Router>
  );
};

const App = () => {
  const [isConfigured, setIsConfigured] = useState(false);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        await configureAuth();
        setIsConfigured(true);
      } catch (error) {
        console.error('Failed to initialize auth:', error);
        // Still set as configured to allow the app to load
        setIsConfigured(true);
      }
    };

    initializeAuth();
  }, []);

  if (!isConfigured) {
    return (
      <Center h="100vh">
        <Spinner size="xl" color="teal.500" />
      </Center>
    );
  }

  return (
    <ChakraProvider theme={theme}>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ChakraProvider>
  );
};

export default App;
