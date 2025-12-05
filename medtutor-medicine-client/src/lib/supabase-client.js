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

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

