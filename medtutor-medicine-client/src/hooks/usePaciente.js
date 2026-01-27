import { useEffect, useState, useRef } from 'react';
import { supabase, verificarERenovarSessao } from '../lib/supabase-client';

export function usePaciente() {
  const [paciente, setPaciente] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const isLoadingRef = useRef(false);
  const loadingTimeoutRef = useRef(null);
  const tentativasRef = useRef(0);
  const maxTentativas = 2;

  async function carregarPaciente() {
    // Evitar múltiplas chamadas simultâneas
    if (isLoadingRef.current) {
      console.log('⚠️ Já existe carregamento em andamento');
      return;
    }

    // Limpar timeout anterior se existir
    if (loadingTimeoutRef.current) {
      clearTimeout(loadingTimeoutRef.current);
      loadingTimeoutRef.current = null;
    }

    isLoadingRef.current = true;
    setLoading(true);
    setError(null);

    // Timeout de segurança: 8 segundos
    loadingTimeoutRef.current = setTimeout(() => {
      if (isLoadingRef.current) {
        console.error('⏱️ Timeout no carregamento do paciente');
        setError('Timeout ao carregar dados');
        setLoading(false);
        isLoadingRef.current = false;
        tentativasRef.current++;
      }
    }, 8000);

    try {
      // Verificar e renovar sessão
      const { session, error: sessionError } = await verificarERenovarSessao();

      // Limpar timeout se chegou aqui
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
        loadingTimeoutRef.current = null;
      }

      if (sessionError) {
        console.error('❌ Erro ao verificar sessão:', sessionError);
        setError(sessionError.message);
        setPaciente(null);
        setLoading(false);
        isLoadingRef.current = false;
        tentativasRef.current++;
        return;
      }

      if (!session?.user) {
        console.log('⚠️ Sem sessão ativa');
        setPaciente(null);
        setError(null);
        setLoading(false);
        isLoadingRef.current = false;
        tentativasRef.current = 0;
        return;
      }

      // Buscar paciente
      const { data, error: pacienteError } = await supabase
        .from('patients')
        .select('*')
        .eq('user_auth', session.user.id)
        .single();

      if (pacienteError) {
        console.error('❌ Erro ao buscar paciente:', pacienteError);
        setError(pacienteError.message);
        setPaciente(null);
        tentativasRef.current++;
        
        // Se já tentou várias vezes, sugerir recarregar
        if (tentativasRef.current >= maxTentativas) {
          setError('Erro ao carregar dados. Por favor, recarregue a página.');
        }
      } else {
        console.log('✅ Paciente carregado com sucesso');
        setPaciente(data);
        setError(null);
        tentativasRef.current = 0; // Reset contador
        
        // Atualizar localStorage
        localStorage.setItem('paciente', JSON.stringify(data));
        localStorage.setItem('user_auth_id', session.user.id);
      }
    } catch (err) {
      console.error('❌ Erro inesperado ao carregar paciente:', err);
      setError(err.message || 'Erro inesperado');
      setPaciente(null);
      tentativasRef.current++;
      
      if (tentativasRef.current >= maxTentativas) {
        setError('Erro inesperado. Por favor, recarregue a página.');
      }
    } finally {
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
        loadingTimeoutRef.current = null;
      }
      setLoading(false);
      isLoadingRef.current = false;
    }
  }

  useEffect(() => {
    let mounted = true;

    // Carregar paciente inicialmente
    if (mounted) {
      carregarPaciente();
    }

    // Escutar apenas eventos críticos de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;

        console.log('🔐 usePaciente - Auth state changed:', event);

        // Apenas reagir a login e logout
        if (event === 'SIGNED_OUT' || event === 'USER_DELETED') {
          setPaciente(null);
          setError(null);
          setLoading(false);
          tentativasRef.current = 0;
          localStorage.removeItem('paciente');
          localStorage.removeItem('user_auth_id');
          return;
        }

        if (event === 'SIGNED_IN' && session?.user) {
          // Resetar contador quando há novo login
          tentativasRef.current = 0;
          
          // Recarregar paciente
          if (!isLoadingRef.current) {
            carregarPaciente();
          }
        }

        // Ignorar TOKEN_REFRESHED para evitar loops
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
      }
    };
  }, []);

  return { paciente, loading, error };
}
