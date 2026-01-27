import React from 'react';
import { useLocation } from 'react-router-dom';

import { Card } from '@mui/material';
import VuiBox from 'components/VuiBox';
import VuiTypography from 'components/VuiTypography';
import { IoHeart } from 'react-icons/io5';
import colors from 'assets/theme/base/colors';
import linearGradient from 'assets/theme/functions/linearGradient';
import { usePaciente } from 'hooks/usePaciente';
import { buscarMetricasPaciente } from 'lib/checkins';
import { supabase } from 'lib/supabase-client';
import { useState, useEffect } from 'react';

const IdadeBiologica = () => {
	const { gradients } = colors;
	const { cardContent } = gradients;
	const { paciente } = usePaciente();
	const location = useLocation();
	const [idadeBiologica, setIdadeBiologica] = useState(null);
	const [idadeReal, setIdadeReal] = useState(null);

	// Calcular idade real a partir da data de nascimento
	const calcularIdade = (dataNascimento) => {
		if (!dataNascimento) return null;
		const hoje = new Date();
		const nascimento = new Date(dataNascimento);
		let idade = hoje.getFullYear() - nascimento.getFullYear();
		const mes = hoje.getMonth() - nascimento.getMonth();
		if (mes < 0 || (mes === 0 && hoje.getDate() < nascimento.getDate())) {
			idade--;
		}
		return idade;
	};

	// Resetar estado quando a rota mudar
	useEffect(() => {
		setIdadeBiologica(null);
		setIdadeReal(null);
	}, [location.pathname]);

	useEffect(() => {
		async function carregarIdade() {
			if (paciente?.id) {
				// Calcular idade real
				const idade = calcularIdade(paciente.birth_date);
				setIdadeReal(idade);

				// Buscar idade biológica do banco (se o médico tiver definido)
				const metricas = await buscarMetricasPaciente(paciente.id);
				if (metricas && metricas.idade_biologica) {
					setIdadeBiologica(metricas.idade_biologica);
				}
			}
		}
		carregarIdade();
	}, [paciente, location.pathname]);

	const idadeExibir = idadeBiologica || idadeReal;
	const legendaIdade = idadeBiologica 
		? 'Idade biológica ajustada' 
		: (idadeReal ? 'Idade atual' : 'Calculando...');

	return (
		<Card sx={{ height: '340px', overflow: 'hidden' }}>
				<VuiBox display='flex' flexDirection='column' height='100%' justifyContent='space-between' p={3}>
					<VuiBox display='flex' flexDirection='column'>
						<VuiTypography variant='lg' color='white' fontWeight='bold' mb='4px' sx={{ display: 'block' }}>
							Idade Biológica
						</VuiTypography>
						<VuiTypography variant='button' color='text' fontWeight='regular' sx={{ display: 'block' }}>
							{legendaIdade}
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
						{idadeExibir ? (
							<>
								<VuiTypography color='white' variant='h2' fontWeight='bold' mb='4px'>
									{idadeExibir}
								</VuiTypography>
								<VuiTypography color='text' variant='caption' fontWeight='regular'>
									anos de idade
								</VuiTypography>
							</>
						) : (
							<>
								<VuiTypography color='white' variant='h2' fontWeight='bold' mb='4px'>
									--
								</VuiTypography>
								<VuiTypography color='text' variant='caption' fontWeight='regular'>
									calculando...
								</VuiTypography>
							</>
						)}
				</VuiBox>
			</VuiBox>
		</Card>
	);
};

export default IdadeBiologica;

