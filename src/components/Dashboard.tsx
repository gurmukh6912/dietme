import { FoodCategoriesSelect } from 'foods-categories';
import { useAuth } from '../contexts/AuthContext';
import {
	Box,
	Button,
	Container,
	Heading,
	Text,
	VStack,
	useToast,
} from '@chakra-ui/react';
import { OneTimeCheckStoreProvider, ScreenSizeProvider } from 'general';
import { PortionsStoreProvider } from 'portions';
import { useHistory } from 'react-router-dom';
import { MainLayout } from 'layout';
import { DietEditor } from 'diets';
import { FoodsStoreProvider } from 'foods';
import { useState } from 'react';
import { loadFoods } from 'foods/persistence';

export const Dashboard = () => {
	const { user, signOut } = useAuth();
	const history = useHistory();
	const toast = useToast();
	const [foods] = useState(loadFoods)

	const handleSignOut = async () => {
		try {
			await signOut();
			history.push('/login');
		} catch (error: any) {
			toast({
				title: 'Error',
				description: error.message || 'Failed to sign out',
				status: 'error',
				duration: 5000,
				isClosable: true,
			});
		}
	};

	return (
		<Container maxW="container.xl" py="8">
			<VStack spacing="6" align="stretch">


				<ScreenSizeProvider>
					<OneTimeCheckStoreProvider>
						<PortionsStoreProvider>
							<FoodsStoreProvider initialFoods={foods}>
								<MainLayout>
									<DietEditor />
								</MainLayout>
							</FoodsStoreProvider>
						</PortionsStoreProvider>
					</OneTimeCheckStoreProvider>
				</ScreenSizeProvider>
			</VStack>

			<Box position="fixed" bottom="4" right="4">
				<Button
					colorScheme="teal"
					variant="outline"
					onClick={handleSignOut}
				>
					Sign Out
				</Button>
			</Box>
		</Container>
	);
}; 