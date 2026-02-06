import { supabase } from './supabase-client';

/**
 * Busca a meta de água diária (ml) do paciente na tabela d_agente_habitos_vida_sistemica.
 * Sempre retorna o valor da **última consulta** (registro mais recente por created_at).
 * @param {string} pacienteId - ID do paciente (UUID)
 * @returns {Promise<number|null>} Meta em ml ou null se não encontrado
 */
function parseMetaAgua(data) {
  if (!data || (data.pilar1_hidratacao_agua_ml_dia != null && data.pilar1_hidratacao_agua_ml_dia === '')) {
    return null;
  }
  const raw = data.pilar1_hidratacao_agua_ml_dia;
  if (raw == null) return null;
  const valor = parseFloat(raw);
  if (Number.isNaN(valor) || valor < 0) return null;
  return valor;
}

export async function buscarMetaAguaPaciente(pacienteId) {
  try {
    const pacienteIdStr = String(pacienteId).trim();

    // Buscar por paciente_id e ordenar pela última consulta (registro mais recente)
    const { data, error } = await supabase
      .from('d_agente_habitos_vida_sistemica')
      .select('pilar1_hidratacao_agua_ml_dia')
      .eq('paciente_id', pacienteIdStr)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      // Se created_at não existir, tentar por updated_at (última atualização)
      if (error.message && (error.message.includes('created_at') || error.code === '42703')) {
        const { data: dataFallback, error: errFallback } = await supabase
          .from('d_agente_habitos_vida_sistemica')
          .select('pilar1_hidratacao_agua_ml_dia')
          .eq('paciente_id', pacienteIdStr)
          .order('updated_at', { ascending: false })
          .limit(1)
          .maybeSingle();
        if (!errFallback && dataFallback) {
          const valor = parseMetaAgua(dataFallback);
          if (valor != null) {
            console.log('✅ Meta de água encontrada (última consulta):', valor, 'ml');
            return valor;
          }
        }
      }
      console.warn('⚠️ Meta de água:', error.message);
      return null;
    }

    const valor = parseMetaAgua(data);
    if (valor != null) {
      console.log('✅ Meta de água encontrada (última consulta):', valor, 'ml');
      return valor;
    }

    return null;
  } catch (err) {
    console.error('❌ Erro ao buscar meta de água:', err);
    return null;
  }
}

/**
 * Busca hábitos de vida (última consulta) para comparar com check-in.
 * Retorna: meta de água (ml), prescrição exercício (min/dia), padrão sono (horas ou valor).
 * @param {string} pacienteId - ID do paciente (UUID)
 * @returns {Promise<{ metaAguaMl: number|null, exercicioDuracaoMin: number|null, sonoDuracaoHoras: number|null }>}
 */
export async function buscarHabitosVidaPaciente(pacienteId) {
  try {
    const pacienteIdStr = String(pacienteId).trim();
    const { data, error } = await supabase
      .from('d_agente_habitos_vida_sistemica')
      .select('pilar1_hidratacao_agua_ml_dia, pilar2_prescricao_fase1_duracao, pilar3_padrao_duracao_total')
      .eq('paciente_id', pacienteIdStr)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      if (error.message && (error.message.includes('created_at') || error.code === '42703')) {
        const { data: fallback } = await supabase
          .from('d_agente_habitos_vida_sistemica')
          .select('pilar1_hidratacao_agua_ml_dia, pilar2_prescricao_fase1_duracao, pilar3_padrao_duracao_total')
          .eq('paciente_id', pacienteIdStr)
          .limit(1)
          .maybeSingle();
        if (fallback) return parseHabitosVida(fallback);
      }
      console.warn('⚠️ Hábitos vida:', error.message);
      return { metaAguaMl: null, exercicioDuracaoMin: null, sonoDuracaoHoras: null };
    }

    return parseHabitosVida(data);
  } catch (err) {
    console.error('❌ Erro ao buscar hábitos vida:', err);
    return { metaAguaMl: null, exercicioDuracaoMin: null, sonoDuracaoHoras: null };
  }
}

function parseHabitosVida(row) {
  if (!row) return { metaAguaMl: null, exercicioDuracaoMin: null, sonoDuracaoHoras: null };
  const metaAguaMl = parseFloat(row.pilar1_hidratacao_agua_ml_dia);
  const exercicioDuracaoMin = parseFloat(row.pilar2_prescricao_fase1_duracao);
  const sonoDuracaoHoras = parseFloat(row.pilar3_padrao_duracao_total);
  return {
    metaAguaMl: Number.isNaN(metaAguaMl) || metaAguaMl < 0 ? null : metaAguaMl,
    exercicioDuracaoMin: Number.isNaN(exercicioDuracaoMin) || exercicioDuracaoMin < 0 ? null : exercicioDuracaoMin,
    sonoDuracaoHoras: Number.isNaN(sonoDuracaoHoras) || sonoDuracaoHoras < 0 ? null : sonoDuracaoHoras,
  };
}

/**
 * Busca os dados de refeições do paciente na tabela s_refeicao.
 * Retorna o registro mais recente (por created_at) com ref_1, ref_2, ref_3, ref_4 (JSONB).
 * @param {string} pacienteId - ID do paciente (UUID)
 * @returns {Promise<Object|null>} Registro s_refeicao ou null
 */
export async function buscarRefeicaoPaciente(pacienteId) {
  try {
    // 1. Tentar RPC (bypassa RLS) - requer função get_refeicao_paciente() no Supabase
    const { data: dataRpc, error: errRpc } = await supabase.rpc('get_refeicao_paciente');

    if (!errRpc && dataRpc) {
      const row = Array.isArray(dataRpc) ? dataRpc[0] : dataRpc;
      if (row && (row.ref_1 || row.ref_2 || row.ref_3 || row.ref_4)) {
        console.log('✅ Refeição encontrada via RPC');
        return row;
      }
    }

    // 2. Fallback: query direta (coluna paciente)
    const { data: dataPaciente, error: errPaciente } = await supabase
      .from('s_refeicao')
      .select('id, created_at, ref_1, ref_2, ref_3, ref_4')
      .eq('paciente', pacienteId)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (!errPaciente && dataPaciente) {
      console.log('✅ Refeição encontrada (coluna paciente)');
      return dataPaciente;
    }

    // 3. Fallback: query direta (coluna paciente_id)
    const { data: dataPacienteId, error: errPacienteId } = await supabase
      .from('s_refeicao')
      .select('id, created_at, ref_1, ref_2, ref_3, ref_4')
      .eq('paciente_id', pacienteId)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (!errPacienteId && dataPacienteId) {
      console.log('✅ Refeição encontrada (coluna paciente_id)');
      return dataPacienteId;
    }

    console.log('🍽️ Nenhum registro de refeição encontrado para paciente:', pacienteId);
    return null;
  } catch (err) {
    console.error('❌ Erro ao buscar refeição:', err);
    return null;
  }
}

/**
 * Busca os dados de alimentação do paciente (legado - s_gramaturas_alimentares).
 * Mantido para compatibilidade.
 * @param {string} pacienteId - ID do paciente (UUID)
 * @param {number} tentativas - Número de tentativas (padrão: 1)
 * @returns {Promise<Array>} Array com os alimentos do plano
 */
export async function buscarAlimentacaoPaciente(pacienteId, tentativas = 1) {
  console.log('🍽️ Buscando alimentação (legado) para paciente:', pacienteId);

  try {
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
      if (tentativas > 0 && (error.message?.includes('network') || error.message?.includes('timeout'))) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        return buscarAlimentacaoPaciente(pacienteId, tentativas - 1);
      }
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('❌ Erro na busca de alimentação:', error);
    if (tentativas > 0 && error?.message?.includes('Timeout')) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return buscarAlimentacaoPaciente(pacienteId, tentativas - 1);
    }
    return [];
  }
}

/**
 * Converte um item do banco em formato de exibição.
 * Suporta: { alimento, gramas, quantidade, kcal, porcao }
 */
function parseItem(item) {
  if (!item || typeof item !== 'object') return null;
  if (typeof item === 'string') return { alimento: item, quantidade: '', kcal: 0, categoria: '' };
  const gramas = item.gramas != null ? Number(item.gramas) : null;
  const quantidade = item.quantidade || item.porcao || (gramas != null && !Number.isNaN(gramas) ? `${Math.round(gramas)}g` : '');
  return {
    alimento: item.alimento || item.nome || item.descricao || '—',
    quantidade,
    kcal: Number(item.kcal) || Number(item.calorias) || 0,
    categoria: item.categoria || '',
  };
}

/**
 * Parseia um objeto JSONB de refeição (ref_1, ref_2, etc).
 * Estrutura real: { principal: [...], substituicoes: { gorduras: [...], proteinas: [...], leguminosas: [...], carboidratos: [...] } }
 */
function parseRefeicaoJsonb(jsonb, nomeRefeicao) {
  if (!jsonb) return null;

  // Se vier como string (JSON do banco), fazer parse
  if (typeof jsonb === 'string') {
    try {
      jsonb = JSON.parse(jsonb);
    } catch (e) {
      console.warn('Erro ao parsear refeição JSON:', e);
      return null;
    }
  }

  if (typeof jsonb !== 'object') return null;

  const parseItens = (src) => {
    if (!src) return [];
    if (Array.isArray(src)) {
      return src.map((item) => parseItem(item)).filter(Boolean);
    }
    if (src.itens && Array.isArray(src.itens)) return parseItens(src.itens);
    if (src.alimento) return [parseItem(src)].filter(Boolean);
    return [];
  };

  const principal = jsonb.principal || jsonb.refeicao_principal || jsonb.refeicaoPrincipal;
  const substituicoesRaw = jsonb.substituicoes || jsonb.substituições || jsonb.substituicoes_lista || [];

  const itensPrincipal = principal ? parseItens(principal) : [];

  // Manter substituições agrupadas por categoria: { proteinas: [...], carboidratos: [...], gorduras: [...], leguminosas: [...] }
  const ordemCategorias = ['proteinas', 'carboidratos', 'gorduras', 'leguminosas'];
  const substituicoesPorCategoria = {};

  if (substituicoesRaw && typeof substituicoesRaw === 'object' && !Array.isArray(substituicoesRaw)) {
    ordemCategorias.forEach((cat) => {
      const arr = substituicoesRaw[cat];
      substituicoesPorCategoria[cat] = Array.isArray(arr) ? arr.map(parseItem).filter(Boolean) : [];
    });
  }

  const totalKcalPrincipal = itensPrincipal.reduce((acc, i) => acc + (i.kcal || 0), 0);
  const itensSubstFlat = ordemCategorias.flatMap((cat) => substituicoesPorCategoria[cat] || []);
  const totalKcalSubst = itensSubstFlat.reduce((acc, i) => acc + (i.kcal || 0), 0);

  if (itensPrincipal.length === 0 && itensSubstFlat.length === 0) {
    return null;
  }

  return {
    nome: nomeRefeicao,
    refeicaoPrincipal: { itens: itensPrincipal, totalKcal: Math.round(totalKcalPrincipal) },
    substituicoesPorCategoria,
    substituicoes: itensSubstFlat,
    totalKcalSubstituicoes: Math.round(totalKcalSubst),
    totalKcal: Math.round(totalKcalPrincipal || totalKcalSubst),
  };
}

/**
 * Processa os dados da tabela s_refeicao (ref_1..ref_4) para o formato da UI.
 * @param {Object|Array|null} registro - Registro de s_refeicao ou array com um registro
 * @returns {Object} Dados para exibição
 */
export function processarDadosRefeicao(registro) {
  const nomes = ['Refeição 1', 'Refeição 2', 'Refeição 3', 'Refeição 4'];
  const refeicoes = [];

  if (!registro) {
    return { refeicoes: [], totalCalorias: 0 };
  }

  // Se vier array (ex: resposta bruta), pegar o primeiro registro
  const row = Array.isArray(registro) ? registro[0] : registro;
  if (!row || typeof row !== 'object') {
    return { refeicoes: [], totalCalorias: 0 };
  }

  ['ref_1', 'ref_2', 'ref_3', 'ref_4'].forEach((key, idx) => {
    const parsed = parseRefeicaoJsonb(row[key], nomes[idx]);
    if (parsed) {
      refeicoes.push({ id: idx + 1, ...parsed });
    }
  });

  const totalCalorias = refeicoes.reduce((acc, r) => acc + (r.totalKcal || 0), 0);

  return {
    refeicoes,
    totalCalorias: Math.round(totalCalorias),
  };
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

