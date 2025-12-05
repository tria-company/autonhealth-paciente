import { supabase } from './supabase-client';

/**
 * Busca os dados do Livro da Vida para um paciente
 * @param {string} pacienteId - ID do paciente
 * @returns {Promise<Object|null>} Dados do Livro da Vida ou null se não encontrado
 */
export async function buscarLivroDaVida(pacienteId) {
  try {
    console.log('🔍 Buscando Livro da Vida para paciente:', pacienteId);
    
    // 1. Primeiro, tentar buscar diretamente pelo paciente_id na tabela
    // O paciente_id pode ser TEXT, então vamos garantir que está como string
    const pacienteIdStr = String(pacienteId).trim();
    console.log('🔍 Buscando com paciente_id (string):', pacienteIdStr);
    
    let { data: livroDaVida, error: livroError } = await supabase
      .from('s_agente_mentalidade_2')
      .select('*')
      .eq('paciente_id', pacienteIdStr)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    console.log('📊 Resultado da busca direta:', { livroDaVida: !!livroDaVida, error: livroError });

    // 2. Se não encontrar pelo paciente_id, tentar buscar pela consulta
    if (livroError || !livroDaVida) {
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
        
        // Buscar dados do Livro da Vida usando consulta_id
        const { data: livroPorConsulta, error: livroPorConsultaError } = await supabase
          .from('s_agente_mentalidade_2')
          .select('*')
          .eq('consulta_id', consulta.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        if (!livroPorConsultaError && livroPorConsulta) {
          livroDaVida = livroPorConsulta;
          console.log('✅ Livro da Vida encontrado pela consulta');
        } else {
          console.log('⚠️ Livro da Vida não encontrado pela consulta:', livroPorConsultaError);
        }
      } else {
        console.log('⚠️ Nenhuma consulta encontrada para o paciente:', consultaError);
      }
    } else {
      console.log('✅ Livro da Vida encontrado diretamente pelo paciente_id');
    }

    if (!livroDaVida) {
      console.log('❌ Nenhum registro do Livro da Vida encontrado');
      return null;
    }

    // 3. Processar os dados
    const dadosProcessados = {
      resumo_executivo: livroDaVida.resumo_executivo,
      padroes: [],
      higiene_sono: null,
    };

    // Processar padrões (padrao_01 até padrao_10)
    for (let i = 1; i <= 10; i++) {
      const padraoKey = `padrao_${String(i).padStart(2, '0')}`;
      const padraoData = livroDaVida[padraoKey];
      
      if (padraoData) {
        try {
          // Se for string JSON, fazer parse
          const padraoParsed = typeof padraoData === 'string' ? JSON.parse(padraoData) : padraoData;
          dadosProcessados.padroes.push({
            id: i,
            ...padraoParsed,
          });
        } catch (e) {
          console.error(`Erro ao processar ${padraoKey}:`, e);
        }
      }
    }

    // Processar resumo executivo
    if (dadosProcessados.resumo_executivo) {
      try {
        dadosProcessados.resumo_executivo = typeof dadosProcessados.resumo_executivo === 'string' 
          ? dadosProcessados.resumo_executivo 
          : JSON.stringify(dadosProcessados.resumo_executivo);
      } catch (e) {
        console.error('Erro ao processar resumo executivo:', e);
      }
    }

    // 4. Buscar higiene do sono (pode estar em uma coluna separada ou dentro do resumo)
    // Por enquanto, vamos tentar buscar de uma coluna específica se existir
    // Se não existir, pode estar dentro do resumo_executivo ou em outra tabela
    // Vamos verificar se há uma coluna higiene_sono na tabela
    if (livroDaVida.higiene_sono) {
      try {
        dadosProcessados.higiene_sono = typeof livroDaVida.higiene_sono === 'string'
          ? JSON.parse(livroDaVida.higiene_sono)
          : livroDaVida.higiene_sono;
      } catch (e) {
        console.error('Erro ao processar higiene do sono:', e);
      }
    }

    console.log('✅ Dados processados:', {
      temResumo: !!dadosProcessados.resumo_executivo,
      numPadroes: dadosProcessados.padroes.length,
      temHigieneSono: !!dadosProcessados.higiene_sono,
    });

    return dadosProcessados;
  } catch (error) {
    console.error('Erro ao buscar Livro da Vida:', error);
    return null;
  }
}

/**
 * Busca dados do Livro da Vida usando consulta_id diretamente
 * @param {string} consultaId - ID da consulta
 * @returns {Promise<Object|null>} Dados do Livro da Vida ou null se não encontrado
 */
export async function buscarLivroDaVidaPorConsulta(consultaId) {
  try {
    const { data: livroDaVida, error: livroError } = await supabase
      .from('s_agente_mentalidade_2')
      .select('*')
      .eq('consulta_id', consultaId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (livroError || !livroDaVida) {
      console.error('Erro ao buscar Livro da Vida:', livroError);
      return null;
    }

    // Processar os dados (mesmo processamento da função anterior)
    const dadosProcessados = {
      resumo_executivo: livroDaVida.resumo_executivo,
      padroes: [],
      higiene_sono: null,
    };

    // Processar padrões
    for (let i = 1; i <= 10; i++) {
      const padraoKey = `padrao_${String(i).padStart(2, '0')}`;
      const padraoData = livroDaVida[padraoKey];
      
      if (padraoData) {
        try {
          const padraoParsed = typeof padraoData === 'string' ? JSON.parse(padraoData) : padraoData;
          dadosProcessados.padroes.push({
            id: i,
            ...padraoParsed,
          });
        } catch (e) {
          console.error(`Erro ao processar ${padraoKey}:`, e);
        }
      }
    }

    // Processar higiene do sono
    if (livroDaVida.higiene_sono) {
      try {
        dadosProcessados.higiene_sono = typeof livroDaVida.higiene_sono === 'string'
          ? JSON.parse(livroDaVida.higiene_sono)
          : livroDaVida.higiene_sono;
      } catch (e) {
        console.error('Erro ao processar higiene do sono:', e);
      }
    }

    return dadosProcessados;
  } catch (error) {
    console.error('Erro ao buscar Livro da Vida:', error);
    return null;
  }
}

