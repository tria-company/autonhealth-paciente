import React from 'react';

import { Card } from '@mui/material';
import VuiBox from 'components/VuiBox';
import VuiTypography from 'components/VuiTypography';
import { IoHeart } from 'react-icons/io5';
import colors from 'assets/theme/base/colors';
import linearGradient from 'assets/theme/functions/linearGradient';

const IdadeBiologica = () => {
	const { gradients } = colors;
	const { cardContent } = gradients;

	return (
		<Card sx={{ height: '340px', overflow: 'hidden' }}>
			<VuiBox display='flex' flexDirection='column' height='100%' justifyContent='space-between' p={3}>
				<VuiBox display='flex' flexDirection='column'>
					<VuiTypography variant='lg' color='white' fontWeight='bold' mb='4px' sx={{ display: 'block' }}>
						Idade Biológica
					</VuiTypography>
					<VuiTypography variant='button' color='text' fontWeight='regular' sx={{ display: 'block' }}>
						Baseada nos check-ins
					</VuiTypography>
				</VuiBox>
				<VuiBox 
					sx={{ 
						display: 'flex', 
						justifyContent: 'center', 
						alignItems: 'center',
						flex: 1
					}}>
					<VuiBox
						sx={{
							'@keyframes pulse': {
								'0%, 100%': {
									transform: 'scale(1)',
									opacity: 1,
								},
								'50%': {
									transform: 'scale(1.15)',
									opacity: 0.85,
								},
							},
							animation: 'pulse 1.5s ease-in-out infinite',
							filter: 'drop-shadow(0 4px 8px rgba(255, 56, 56, 0.4))',
						}}
					>
						<IoHeart size='120px' color='#FF3838' />
					</VuiBox>
				</VuiBox>
				<VuiBox
					sx={{
						width: '100%',
						padding: '18px 22px',
						display: 'flex',
						justifyContent: 'center',
						flexDirection: 'column',
						alignItems: 'center',
						borderRadius: '20px',
						background: linearGradient(cardContent.main, cardContent.state, cardContent.deg),
					}}>
					<VuiTypography color='white' variant='h2' fontWeight='bold' mb='4px'>
						53
					</VuiTypography>
					<VuiTypography color='text' variant='caption' fontWeight='regular'>
						anos de idade biológica
					</VuiTypography>
				</VuiBox>
			</VuiBox>
		</Card>
	);
};

export default IdadeBiologica;

