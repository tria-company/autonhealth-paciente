import { useEffect, useState, useRef } from "react";
import { Route, Redirect } from "react-router-dom";
import { CircularProgress, Box, Button } from "@mui/material";
import VuiTypography from "components/VuiTypography";
import { supabase, verificarERenovarSessao } from "lib/supabase-client";

function ProtectedRoute({ component: Component, ...rest }) {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [error, setError] = useState(null);
  const checkingRef = useRef(false);
  const timeoutRef = useRef(null);

  const checkAuth = async () => {
    // Evitar múltiplas chamadas simultâneas
    if (checkingRef.current) {
      return;
    }

    checkingRef.current = true;
    setLoading(true);
    setError(null);

    // Timeout de segurança de 8 segundos
    timeoutRef.current = setTimeout(() => {
      if (checkingRef.current) {
        console.error('⏱️ Timeout na verificação de autenticação');
        setError('Timeout ao verificar autenticação');
        setLoading(false);
        setAuthenticated(false);
        checkingRef.current = false;
      }
    }, 8000);

    try {
      // Verificar e renovar sessão
      const { session, error: sessionError } = await verificarERenovarSessao();
      
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }

      if (sessionError || !session?.user) {
        console.log('❌ Sem sessão válida');
        setAuthenticated(false);
        setLoading(false);
        checkingRef.current = false;
        return;
      }

      // Buscar dados do paciente
      const { data: paciente, error: pacienteError } = await supabase
        .from('patients')
        .select('*')
        .eq('user_auth', session.user.id)
        .single();

      if (pacienteError || !paciente) {
        console.error('❌ Erro ao buscar paciente:', pacienteError);
        setAuthenticated(false);
        setError('Paciente não encontrado');
      } else {
        console.log('✅ Autenticação válida');
        setAuthenticated(true);
        localStorage.setItem('paciente', JSON.stringify(paciente));
        localStorage.setItem('user_auth_id', session.user.id);
      }
    } catch (err) {
      console.error('❌ Erro ao verificar autenticação:', err);
      setError(err.message || 'Erro ao verificar autenticação');
      setAuthenticated(false);
    } finally {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      setLoading(false);
      checkingRef.current = false;
    }
  };

  useEffect(() => {
    let mounted = true;

    // Verificar autenticação inicial
    checkAuth();

    // Escutar apenas eventos críticos de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔐 Auth state changed:', event);

        // Apenas reagir a eventos de login/logout
        if (event === 'SIGNED_OUT' || event === 'USER_DELETED') {
          if (mounted) {
            setAuthenticated(false);
            setLoading(false);
            localStorage.removeItem('paciente');
            localStorage.removeItem('user_auth_id');
          }
        } else if (event === 'SIGNED_IN' && session?.user) {
          if (mounted && !checkingRef.current) {
            checkAuth();
          }
        }
        // Ignorar TOKEN_REFRESHED para evitar loops
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Estado de loading
  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          backgroundColor: '#EBF3F6'
        }}
      >
        <CircularProgress sx={{ color: "#1B4266" }} />
        <VuiTypography variant="body2" mt={2} sx={{ fontWeight: 500, color: "#1B4266" }}>
          Verificando autenticação...
        </VuiTypography>
      </Box>
    );
  }

  // Estado de erro
  if (error) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          backgroundColor: '#EBF3F6',
          gap: 2,
          padding: 3
        }}
      >
        <VuiTypography variant="h5" textAlign="center" fontWeight="bold" sx={{ color: "#1B4266" }}>
          Erro ao carregar
        </VuiTypography>
        <VuiTypography variant="body2" textAlign="center" sx={{ color: "#1B4266" }}>
          {error}
        </VuiTypography>
        <Button
          variant="contained"
          onClick={() => window.location.reload()}
          sx={{
            mt: 2,
            backgroundColor: '#1B4266',
            color: '#FFFFFF',
            '&:hover': { backgroundColor: '#2D6293' }
          }}
        >
          Recarregar Página
        </Button>
      </Box>
    );
  }

  return (
    <Route
      {...rest}
      render={(props) =>
        authenticated ? (
          <Component {...props} />
        ) : (
          <Redirect to="/authentication/sign-in" />
        )
      }
    />
  );
}

export default ProtectedRoute;







