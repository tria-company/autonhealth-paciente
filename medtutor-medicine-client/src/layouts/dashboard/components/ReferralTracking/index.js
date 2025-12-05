import React, { useState, useEffect } from 'react';
import { Card } from '@mui/material';
import Icon from '@mui/material/Icon';
import VuiBox from 'components/VuiBox';
import VuiTypography from 'components/VuiTypography';
import colors from 'assets/theme/base/colors';
import linearGradient from 'assets/theme/functions/linearGradient';
import { usePaciente } from 'hooks/usePaciente';
import { buscarMetricasPaciente } from 'lib/checkins';

function ReferralTracking() {
	const { info, gradients } = colors;
	const { cardContent } = gradients;
	const { paciente } = usePaciente();
	const [aderencia, setAderencia] = useState(0);

	useEffect(() => {
		async function carregarAderencia() {
			if (paciente?.id) {
				const metricas = await buscarMetricasPaciente(paciente.id);
				if (metricas && metricas.aderencia_protocolo !== null) {
					setAderencia(metricas.aderencia_protocolo);
				}
			}
		}
		carregarAderencia();
	}, [paciente]);

	// Normalizar aderência para 0-1
	const progress = (aderencia / 100) || 0;
	const aderenciaFormatada = Math.round(aderencia);

	// Ícone baseado na aderência
	const getIcone = () => {
		if (aderencia >= 80) return "sentiment_satisfied_alt";
		if (aderencia >= 50) return "sentiment_neutral";
		return "sentiment_dissatisfied";
	};

	return (
		<Card
			sx={{
				height: '100%',
				background: linearGradient(gradients.cardDark.main, gradients.cardDark.state, gradients.cardDark.deg)
			}}>
			<VuiBox sx={{ width: '100%' }}>
				<VuiBox
					display='flex'
					alignItems='center'
					justifyContent='space-beetween'
					sx={{ width: '100%' }}
					mb='40px'>
                <VuiBox>
                    <VuiTypography variant='lg' color='white' mr='auto' fontWeight='bold'>
                        Aderência ao Protocolo
                    </VuiTypography>
                </VuiBox>
				</VuiBox>
                <VuiBox display='flex' flexDirection='column' alignItems='center' justifyContent='center'>
                    <VuiBox sx={{ position: 'relative', width: 260, height: 160 }}>
                        {(() => {
                            const size = 260;
                            const radius = 110;
                            const cx = size / 2;
                            const cy = size / 2 + 10;
                            const circumference = Math.PI * radius;
                            const dashArray = circumference;
                            const dashOffset = circumference * (1 - progress);
                            const pathD = `M ${cx - radius} ${cy} A ${radius} ${radius} 0 0 1 ${cx + radius} ${cy}`;
                            return (
                                <svg width={size} height={size} style={{ position: 'absolute', top: -20, left: 0 }}>
                                    <path d={pathD} stroke="#2F3765" strokeWidth={22} fill="none" strokeLinecap="round" />
                                    <path d={pathD} stroke={info.main} strokeWidth={22} fill="none" strokeLinecap="round" strokeDasharray={dashArray} strokeDashoffset={dashOffset} />
                                </svg>
                            );
                        })()}
                        <VuiBox
                            sx={{
                                position: 'absolute',
                                top: 52,
                                left: '50%',
                                transform: 'translateX(-50%)',
                                background: info.main,
                                width: '56px',
                                height: '56px',
                                borderRadius: '50%',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}
                        >
                            <Icon sx={{ color: '#fff', fontSize: 26 }}>{getIcone()}</Icon>
                        </VuiBox>
                    </VuiBox>
                </VuiBox>
            	<VuiBox
                        sx={({ breakpoints }) => ({
                            width: '88%',
                            padding: '14px 18px',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            height: '70px',
                            mx: 'auto',
                            mt: '-28px',
                            borderRadius: '20px',
                            background: linearGradient(cardContent.main, cardContent.state, cardContent.deg)
                        })}
                    >
                        <VuiTypography color='text' variant='caption'>0%</VuiTypography>
                        <VuiBox flexDirection='column' display='flex' justifyContent='center' alignItems='center' sx={{ minWidth: '100px' }}>
                            <VuiTypography color='white' variant='h4'>
                                {aderenciaFormatada}%
                            </VuiTypography>
                            <VuiTypography color='text' variant='caption' fontWeight='regular'>
                                de check-ins realizados
                            </VuiTypography>
                        </VuiBox>
                        <VuiTypography color='text' variant='caption'>100%</VuiTypography>
                    </VuiBox>
			</VuiBox>
		</Card>
	);
}

export default ReferralTracking;
