import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase-client';

export function usePaciente() {
  const [paciente, setPaciente] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function carregarPaciente() {
      try {
        // 1. Verificar se há sessão ativa
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Erro ao verificar sessão:', sessionError);
          setError(sessionError.message);
          setLoading(false);
          return;
        }

        if (!session?.user) {
          setPaciente(null);
          setLoading(false);
          return;
        }

        // 2. Buscar paciente pelo user_auth
        const { data, error: pacienteError } = await supabase
          .from('patients')
          .select('*')
          .eq('user_auth', session.user.id)
          .single();

        if (pacienteError) {
          console.error('Erro ao buscar paciente:', pacienteError);
          setError(pacienteError.message);
          setPaciente(null);
        } else {
          setPaciente(data);
          setError(null);
        }
      } catch (err) {
        console.error('Erro inesperado:', err);
        setError(err.message);
        setPaciente(null);
      } finally {
        setLoading(false);
      }
    }

    carregarPaciente();

    // 3. Escutar mudanças na sessão
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          const { data, error: pacienteError } = await supabase
            .from('patients')
            .select('*')
            .eq('user_auth', session.user.id)
            .single();
          
          if (pacienteError) {
            console.error('Erro ao buscar paciente:', pacienteError);
            setPaciente(null);
            setError(pacienteError.message);
          } else {
            setPaciente(data);
            setError(null);
          }
        } else {
          setPaciente(null);
          setError(null);
        }
        setLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return { paciente, loading, error };
}


