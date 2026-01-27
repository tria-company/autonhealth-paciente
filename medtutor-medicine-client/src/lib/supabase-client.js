import { createClient } from '@supabase/supabase-js';

// Debug: verificar se as variáveis estão sendo carregadas
console.log('🔍 Debug - Variáveis de ambiente:');
console.log('REACT_APP_SUPABASE_URL:', process.env.REACT_APP_SUPABASE_URL ? '✅ Carregada' : '❌ Não encontrada');
console.log('REACT_APP_SUPABASE_ANON_KEY:', process.env.REACT_APP_SUPABASE_ANON_KEY ? '✅ Carregada' : '❌ Não encontrada');
console.log('Todas as variáveis REACT_APP_*:', Object.keys(process.env).filter(key => key.startsWith('REACT_APP_')));

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'https://yzjlhezmvdkwdhibyvwh.supabase.co';
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl6amxoZXptdmRrd2RoaWJ5dndoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc1MjY2NTcsImV4cCI6MjA3MzEwMjY1N30.6k4ey41rv--Eawi55H_pacZgMrmM-SR--l2t88gV7z0';

if (!supabaseUrl || !supabaseAnonKey) {
  const errorMessage = `
    ⚠️ ERRO: Variáveis de ambiente do Supabase não encontradas!
    
    Certifique-se de que o arquivo .env.local existe na raiz do projeto com:
    
    REACT_APP_SUPABASE_URL=https://seu-projeto.supabase.co
    REACT_APP_SUPABASE_ANON_KEY=sua-anon-key
    
    E reinicie o servidor de desenvolvimento (npm start).
  `;
  console.error(errorMessage);
  throw new Error('Supabase URL e ANON KEY devem estar configurados nas variáveis de ambiente. Verifique o arquivo .env.local e reinicie o servidor.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    storage: window.localStorage,
    flowType: 'pkce',
  },
  global: {
    headers: {
      'x-client-info': 'medtutor-client',
    },
    fetch: (url, options = {}) => {
      // Timeout de 10 segundos para todas as requisições
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);
      
      return fetch(url, {
        ...options,
        signal: controller.signal,
      }).finally(() => {
        clearTimeout(timeoutId);
      });
    },
  },
});

/**
 * Verifica e renova a sessão se necessário
 * @returns {Promise<{session: Object|null, error: Error|null}>}
 */
export async function verificarERenovarSessao() {
  try {
    const { data, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('Erro ao verificar sessão:', error);
      return { session: null, error };
    }
    
    if (!data.session) {
      return { session: null, error: null };
    }
    
    // Verificar se o token está perto de expirar (menos de 5 minutos)
    const expiresAt = data.session.expires_at;
    const now = Math.floor(Date.now() / 1000);
    const tempoRestante = expiresAt - now;
    
    // Se restar menos de 5 minutos, renovar
    if (tempoRestante < 300) {
      console.log('🔄 Token próximo de expirar, renovando...');
      const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession();
      
      if (refreshError) {
        console.error('Erro ao renovar sessão:', refreshError);
        return { session: null, error: refreshError };
      }
      
      return { session: refreshData.session, error: null };
    }
    
    return { session: data.session, error: null };
  } catch (err) {
    console.error('Erro ao verificar e renovar sessão:', err);
    return { session: null, error: err };
  }
}
