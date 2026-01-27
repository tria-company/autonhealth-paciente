import { useEffect, useRef } from 'react';
import { verificarERenovarSessao } from '../lib/supabase-client';

/**
 * Hook para detectar quando a página volta ao foco após ficar inativa
 * e renovar a sessão do Supabase se necessário
 */
export function usePageFocus() {
  const ultimaVerificacao = useRef(Date.now());
  const processandoRef = useRef(false);

  useEffect(() => {
    const handleVisibilityChange = async () => {
      // Só processar quando a página voltar a ficar visível
      if (document.hidden || processandoRef.current) {
        return;
      }

      // Verificar se passou tempo suficiente desde a última verificação (30 segundos)
      const agora = Date.now();
      const tempoDecorrido = agora - ultimaVerificacao.current;
      
      if (tempoDecorrido < 30000) {
        return;
      }

      console.log('👁️ Página voltou ao foco, verificando sessão...');
      processandoRef.current = true;
      ultimaVerificacao.current = agora;

      try {
        const { session, error } = await verificarERenovarSessao();
        
        if (error) {
          console.error('❌ Erro ao renovar sessão:', error);
          // Se houver erro crítico de autenticação, fazer logout
          if (error.message?.includes('refresh_token_not_found') || 
              error.message?.includes('invalid_grant')) {
            console.log('🚪 Sessão inválida, redirecionando para login...');
            window.location.href = '/authentication/sign-in';
          }
        } else if (session) {
          console.log('✅ Sessão válida e renovada');
        } else {
          console.log('⚠️ Sem sessão ativa');
        }
      } catch (err) {
        console.error('❌ Erro inesperado ao verificar sessão:', err);
      } finally {
        processandoRef.current = false;
      }
    };

    // Escutar mudanças de visibilidade da página
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Escutar evento de foco na janela
    window.addEventListener('focus', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleVisibilityChange);
    };
  }, []);

  return null;
}
