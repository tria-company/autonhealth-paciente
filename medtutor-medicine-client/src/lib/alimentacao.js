import { supabase } from './supabase-client';

/**
 * Busca os dados de alimentação do paciente com timeout
 * @param {string} pacienteId - ID do paciente (UUID)
 * @param {number} tentativas - Número de tentativas (padrão: 1)
 * @returns {Promise<Array>} Array com os alimentos do plano
 */
export async function buscarAlimentacaoPaciente(pacienteId, tentativas = 1) {
  console.log('🍽️ Buscando alimentação para paciente:', pacienteId);

  try {
    // Criar uma promise com timeout de 8 segundos
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Timeout ao buscar alimentação')), 8000);
    });

    const queryPromise = supabase
      .from('s_gramaturas_alimentares')
      .select('*')
      .eq('paciente_id', pacienteId)
      .order('id', { ascending: true });

    const { data, error } = await Promise.race([queryPromise, timeoutPromise]);

    if (error) {
      console.error('❌ Erro ao buscar alimentação:', error);
      
      // Tentar novamente se for erro de rede e ainda tiver tentativas
      if (tentativas > 0 && (error.message?.includes('network') || error.message?.includes('timeout'))) {
        console.log('🔄 Tentando novamente buscar alimentação...');
        await new Promise(resolve => setTimeout(resolve, 1000));
        return buscarAlimentacaoPaciente(pacienteId, tentativas - 1);
      }
      
      throw error;
    }

    console.log('✅ Alimentação encontrada:', data?.length || 0, 'alimentos');
    return data || [];
  } catch (error) {
    console.error('❌ Erro na busca de alimentação:', error);
    
    // Tentar novamente se for timeout e ainda tiver tentativas
    if (tentativas > 0 && error.message?.includes('Timeout')) {
      console.log('🔄 Timeout - tentando novamente buscar alimentação...');
      await new Promise(resolve => setTimeout(resolve, 1000));
      return buscarAlimentacaoPaciente(pacienteId, tentativas - 1);
    }
    
    return [];
  }
}

/**
 * Processa os dados brutos e organiza por refeições
 * @param {Array} alimentos - Array de alimentos do banco
 * @returns {Object} Dados organizados por refeições
 */
export function processarDadosAlimentacao(alimentos) {
  if (!alimentos || alimentos.length === 0) {
    return {
      refeicoes: [],
      totalCalorias: 0,
      totalProteinas: 0,
      totalCarboidratos: 0,
      totalGorduras: 0,
    };
  }

  // Mapear refeições (ref1, ref2, ref3, ref4)
  const refeicoesMapa = {
    ref1: { nome: 'Refeição 1', itens: [], totalKcal: 0 },
    ref2: { nome: 'Refeição 2', itens: [], totalKcal: 0 },
    ref3: { nome: 'Refeição 3', itens: [], totalKcal: 0 },
    ref4: { nome: 'Refeição 4', itens: [], totalKcal: 0 },
  };

  let totalCalorias = 0;

  // Processar cada alimento
  alimentos.forEach((alimento) => {
    // Ref1
    if (alimento.ref1_g && alimento.ref1_kcal) {
      refeicoesMapa.ref1.itens.push({
        alimento: alimento.alimento,
        quantidade: `${alimento.ref1_g} g`,
        kcal: alimento.ref1_kcal,
        tipo: alimento.tipo_de_alimentos,
      });
      refeicoesMapa.ref1.totalKcal += alimento.ref1_kcal;
      totalCalorias += alimento.ref1_kcal;
    }

    // Ref2
    if (alimento.ref2_g && alimento.ref2_kcal) {
      refeicoesMapa.ref2.itens.push({
        alimento: alimento.alimento,
        quantidade: `${alimento.ref2_g} g`,
        kcal: alimento.ref2_kcal,
        tipo: alimento.tipo_de_alimentos,
      });
      refeicoesMapa.ref2.totalKcal += alimento.ref2_kcal;
      totalCalorias += alimento.ref2_kcal;
    }

    // Ref3
    if (alimento.ref3_g && alimento.ref3_kcal) {
      refeicoesMapa.ref3.itens.push({
        alimento: alimento.alimento,
        quantidade: `${alimento.ref3_g} g`,
        kcal: alimento.ref3_kcal,
        tipo: alimento.tipo_de_alimentos,
      });
      refeicoesMapa.ref3.totalKcal += alimento.ref3_kcal;
      totalCalorias += alimento.ref3_kcal;
    }

    // Ref4
    if (alimento.ref4_g && alimento.ref4_kcal) {
      refeicoesMapa.ref4.itens.push({
        alimento: alimento.alimento,
        quantidade: `${alimento.ref4_g} g`,
        kcal: alimento.ref4_kcal,
        tipo: alimento.tipo_de_alimentos,
      });
      refeicoesMapa.ref4.totalKcal += alimento.ref4_kcal;
      totalCalorias += alimento.ref4_kcal;
    }
  });

  // Converter para array, filtrando refeições vazias
  const refeicoes = Object.entries(refeicoesMapa)
    .filter(([_, refeicao]) => refeicao.itens.length > 0)
    .map(([key, refeicao], index) => ({
      id: index + 1,
      nome: refeicao.nome,
      itens: refeicao.itens,
      kcal: Math.round(refeicao.totalKcal),
    }));

  return {
    refeicoes,
    totalCalorias: Math.round(totalCalorias),
    totalProteinas: 0, // Calcular se necessário
    totalCarboidratos: 0, // Calcular se necessário
    totalGorduras: 0, // Calcular se necessário
  };
}

