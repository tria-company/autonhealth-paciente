import { supabase } from './supabase-client';

/**
 * Parseia um array de strings JSON para um array de objetos
 * @param {string[]|null} arr - Array de strings JSON
 * @returns {Array} Array de objetos parseados
 */
function parseJsonArray(arr) {
  if (!arr || !Array.isArray(arr)) return [];
  try {
    return arr.map(item => {
      if (typeof item === 'string') {
        return JSON.parse(item);
      }
      return item; // Já é um objeto
    });
  } catch (error) {
    console.error('Erro ao fazer parse de array:', error);
    return [];
  }
}

/**
 * Busca os dados de suplementação para um paciente
 * @param {string} pacienteId - ID do paciente
 * @returns {Promise<Object|null>} Dados de suplementação ou null se não encontrado
 */
export async function buscarSuplementacao(pacienteId) {
  try {
    console.log('🔍 Buscando Suplementação para paciente:', pacienteId);
    
    // 1. Primeiro, tentar buscar diretamente pelo paciente_id na tabela
    const pacienteIdStr = String(pacienteId).trim();
    console.log('🔍 Buscando com paciente_id (string):', pacienteIdStr);
    
    let { data: suplementacao, error: suplementacaoError } = await supabase
      .from('s_suplementacao2')
      .select('*')
      .eq('paciente_id', pacienteIdStr)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    // 2. Se não encontrar pelo paciente_id, tentar buscar pela consulta
    if (suplementacaoError || !suplementacao) {
      console.log('⚠️ Não encontrado pelo paciente_id, tentando buscar pela consulta...');
      
      const { data: consulta, error: consultaError } = await supabase
        .from('consultations')
        .select('id')
        .eq('patient_id', pacienteId)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (!consultaError && consulta) {
        console.log('✅ Consulta encontrada:', consulta.id);
        
        // Buscar dados de suplementação usando consulta_id
        const { data: suplementacaoPorConsulta, error: suplementacaoPorConsultaError } = await supabase
          .from('s_suplementacao2')
          .select('*')
          .eq('consulta_id', consulta.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        if (!suplementacaoPorConsultaError && suplementacaoPorConsulta) {
          suplementacao = suplementacaoPorConsulta;
          console.log('✅ Suplementação encontrada pela consulta');
        } else {
          console.log('⚠️ Suplementação não encontrada pela consulta:', suplementacaoPorConsultaError);
        }
      } else {
        console.log('⚠️ Nenhuma consulta encontrada para o paciente:', consultaError);
      }
    } else {
      console.log('✅ Suplementação encontrada diretamente pelo paciente_id');
    }

    if (!suplementacao) {
      console.log('❌ Nenhum registro de suplementação encontrado');
      return null;
    }

    if (!suplementacao) {
      console.log('❌ Nenhum registro de suplementação encontrado');
      return null;
    }

    // 3. Processar os dados - parsear arrays de strings JSON
    const dadosProcessados = {
      suplementos: parseJsonArray(suplementacao.suplementos),
      fitoterapicos: parseJsonArray(suplementacao.fitoterapicos),
      homeopatia: parseJsonArray(suplementacao.homeopatia),
      florais_bach: parseJsonArray(suplementacao.florais_bach),
    };

    console.log('✅ Dados processados:', {
      numSuplementos: dadosProcessados.suplementos.length,
      numFitoterapicos: dadosProcessados.fitoterapicos.length,
      numHomeopatia: dadosProcessados.homeopatia.length,
      numFloraisBach: dadosProcessados.florais_bach.length,
    });

    return dadosProcessados;
  } catch (error) {
    console.error('Erro ao buscar Suplementação:', error);
    return null;
  }
}

/**
 * Busca dados de suplementação usando consulta_id diretamente
 * @param {string} consultaId - ID da consulta
 * @returns {Promise<Object|null>} Dados de suplementação ou null se não encontrado
 */
export async function buscarSuplementacaoPorConsulta(consultaId) {
  try {
    const { data: suplementacao, error: suplementacaoError } = await supabase
      .from('s_suplementacao2')
      .select('*')
      .eq('consulta_id', consultaId)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (suplementacaoError || !suplementacao) {
      console.error('Erro ao buscar Suplementação:', suplementacaoError);
      return null;
    }

    // Processar os dados (mesmo processamento da função anterior)
    const dadosProcessados = {
      suplementos: parseJsonArray(suplementacao.suplementos),
      fitoterapicos: parseJsonArray(suplementacao.fitoterapicos),
      homeopatia: parseJsonArray(suplementacao.homeopatia),
      florais_bach: parseJsonArray(suplementacao.florais_bach),
    };

    return dadosProcessados;
  } catch (error) {
    console.error('Erro ao buscar Suplementação:', error);
    return null;
  }
}

