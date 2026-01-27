import { useEffect, useState } from "react";
import { Route, Redirect } from "react-router-dom";
import { supabase } from "lib/supabase-client";

function ProtectedRoute({ component: Component, ...rest }) {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    async function checkAuth() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          // Verificar se o paciente existe
          const { data: paciente } = await supabase
            .from('patients')
            .select('*')
            .eq('user_auth', session.user.id)
            .single();

          if (paciente) {
            setAuthenticated(true);
            localStorage.setItem('paciente', JSON.stringify(paciente));
            localStorage.setItem('user_auth_id', session.user.id);
          } else {
            setAuthenticated(false);
          }
        } else {
          setAuthenticated(false);
        }
      } catch (error) {
        console.error('Erro ao verificar autenticação:', error);
        setAuthenticated(false);
      } finally {
        setLoading(false);
      }
    }

    checkAuth();

    // Escutar mudanças na autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        supabase
          .from('patients')
          .select('*')
          .eq('user_auth', session.user.id)
          .single()
          .then(({ data: paciente }) => {
            if (paciente) {
              setAuthenticated(true);
              localStorage.setItem('paciente', JSON.stringify(paciente));
              localStorage.setItem('user_auth_id', session.user.id);
            } else {
              setAuthenticated(false);
            }
            setLoading(false);
          });
      } else {
        setAuthenticated(false);
        setLoading(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  if (loading) {
    return null; // Ou um componente de loading
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







