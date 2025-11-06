import React from 'react';
import { Card } from '@mui/material';
import VuiBox from 'components/VuiBox';
import VuiTypography from 'components/VuiTypography';
import colors from 'assets/theme/base/colors';
import linearGradient from 'assets/theme/functions/linearGradient';
import CircularProgress from '@mui/material/CircularProgress';

function EquilibrioGeralWidget({ value = 8.9 }) {
  const { gradients } = colors;
  const { cardDark, cardContent } = gradients;

  return (
    <Card sx={{ height: '100%', background: linearGradient(cardDark.main, cardDark.state, cardDark.deg) }}>
      <VuiBox sx={{ width: '100%' }}>
        <VuiBox display='flex' alignItems='center' justifyContent='space-beetween' sx={{ width: '100%' }} mb='40px'>
          <VuiTypography variant='lg' color='white' mr='auto' fontWeight='bold'>
            Equilíbrio Geral
          </VuiTypography>
        </VuiBox>
        <VuiBox display='flex' alignItems='center' justifyContent='center'>
          <VuiBox sx={{ position: 'relative', display: 'inline-flex' }}>
            <CircularProgress
              variant='determinate'
              value={Math.min(Math.max(value * 10, 0), 100)}
              size={window.innerWidth >= 1024 ? 200 : window.innerWidth >= 768 ? 170 : 200}
              color='success'
              thickness={4.5}
            />
            <VuiBox
              sx={{
                top: 0,
                left: 0,
                bottom: 0,
                right: 0,
                position: 'absolute',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
              <VuiBox display='flex' flexDirection='column' justifyContent='center' alignItems='center'>
                <VuiTypography color='text' variant='button' mb='4px'>
                  Equilíbrio Geral
                </VuiTypography>
                <VuiTypography color='white' variant='d4' fontWeight='bold' mb='4px'>
                  {value.toFixed(1)}
                </VuiTypography>
                <VuiTypography color='text' variant='button'>
                  Sua Nota
                </VuiTypography>
              </VuiBox>
            </VuiBox>
          </VuiBox>
        </VuiBox>
      </VuiBox>
    </Card>
  );
}

export default EquilibrioGeralWidget;


