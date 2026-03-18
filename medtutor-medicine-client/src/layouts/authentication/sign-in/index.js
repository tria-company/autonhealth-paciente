import { useState } from "react";

// react-router-dom components
import { Link, useHistory } from "react-router-dom";

import VuiBox from "components/VuiBox";
import VuiTypography from "components/VuiTypography";
import VuiInput from "components/VuiInput";
import VuiButton from "components/VuiButton";
import VuiSwitch from "components/VuiSwitch";
import GradientBorder from "examples/GradientBorder";

import radialGradient from "assets/theme/functions/radialGradient";
import palette from "assets/theme/base/colors";
import borders from "assets/theme/base/borders";

// Authentication layout components
import CoverLayout from "layouts/authentication/components/CoverLayout";

// Supabase
import { supabase } from "lib/supabase-client";

// Images
import bgSignIn from "assets/images/login-img.jpeg";

function SignIn() {
  const [rememberMe, setRememberMe] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const history = useHistory();

  const handleSetRememberMe = () => setRememberMe(!rememberMe);

  const handleSignIn = async (e) => {
    e?.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // 1. Fazer login no Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        setError("Email ou senha incorretos");
        setLoading(false);
        return;
      }

      // 2. Buscar dados do paciente usando user_auth
      const userAuthId = authData.user.id;
      
      const { data: paciente, error: pacienteError } = await supabase
        .from('patients')
        .select('*')
        .eq('user_auth', userAuthId)
        .single();

      if (pacienteError || !paciente) {
        setError("Paciente não encontrado. Entre em contato com o suporte.");
        setLoading(false);
        return;
      }

      // 3. Salvar dados na sessão/localStorage
      localStorage.setItem('paciente', JSON.stringify(paciente));
      localStorage.setItem('user_auth_id', userAuthId);
      
      // 4. Redirecionar para dashboard
      history.push("/dashboard");
      
    } catch (err) {
      console.error('Erro no login:', err);
      setError("Erro ao fazer login. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <CoverLayout
      title="Que bom te ver!"
      color="white"
      description="Digite seu email e senha para entrar"
      premotto=""
      motto=""
      image={bgSignIn}
    >
      <VuiBox component="form" role="form" sx={{ width: "100%" }} onSubmit={handleSignIn}>
        {error && (
          <VuiBox mb={2} p={2} sx={{ 
            background: "rgba(255, 56, 56, 0.1)", 
            border: "1px solid rgba(255, 56, 56, 0.3)",
            borderRadius: "12px"
          }}>
            <VuiTypography variant="body2" fontWeight="medium" sx={{ color: "#FF3838" }}>
              {error}
            </VuiTypography>
          </VuiBox>
        )}
        <VuiBox mb={2}>
          <VuiBox mb={1} ml={0.5}>
            <VuiTypography component="label" variant="button" color="white" fontWeight="medium">
              E-mail
            </VuiTypography>
          </VuiBox>
          <GradientBorder
            minWidth="100%"
            padding="1px"
            borderRadius={borders.borderRadius.lg}
            backgroundImage={radialGradient(
              palette.gradients.borderLight.main,
              palette.gradients.borderLight.state,
              palette.gradients.borderLight.angle
            )}
          >
            <VuiInput
              type="email"
              placeholder="Seu email..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
              fontWeight="500"
              sx={{
                width: "100%",
                backgroundColor: "#FFFFFF !important",
                "& .MuiInputBase-input": {
                  padding: "16px 28px",
                  fontSize: "1rem",
                  color: "#000000",
                  "&:-webkit-autofill": {
                    WebkitBoxShadow: "0 0 0 1000px #FFFFFF inset !important",
                    boxShadow: "0 0 0 1000px #FFFFFF inset !important",
                  },
                },
              }}
            />
          </GradientBorder>
        </VuiBox>
        <VuiBox mb={2}>
          <VuiBox mb={1} ml={0.5}>
            <VuiTypography component="label" variant="button" color="white" fontWeight="medium">
              Senha
            </VuiTypography>
          </VuiBox>
          <GradientBorder
            minWidth="100%"
            borderRadius={borders.borderRadius.lg}
            padding="1px"
            backgroundImage={radialGradient(
              palette.gradients.borderLight.main,
              palette.gradients.borderLight.state,
              palette.gradients.borderLight.angle
            )}
          >
            <VuiInput
              type="password"
              placeholder="Sua senha..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
              sx={{
                width: "100%",
                backgroundColor: "#FFFFFF !important",
                "& .MuiInputBase-input": {
                  padding: "16px 28px",
                  fontSize: "1rem",
                  color: "#000000",
                  "&:-webkit-autofill": {
                    WebkitBoxShadow: "0 0 0 1000px #FFFFFF inset !important",
                    boxShadow: "0 0 0 1000px #FFFFFF inset !important",
                  },
                },
              }}
            />
          </GradientBorder>
        </VuiBox>
        <VuiBox display="flex" alignItems="center" justifyContent="space-between">
          <VuiBox display="flex" alignItems="center">
            <VuiSwitch color="info" checked={rememberMe} onChange={handleSetRememberMe} disabled={loading} />
            <VuiTypography
              variant="caption"
              color="white"
              fontWeight="medium"
              onClick={handleSetRememberMe}
              sx={{ cursor: "pointer", userSelect: "none" }}
            >
              &nbsp;&nbsp;&nbsp;&nbsp;Lembrar-me
            </VuiTypography>
          </VuiBox>
          <VuiTypography
            component={Link}
            to="/authentication/forgot-password"
            variant="caption"
            color="white"
            fontWeight="medium"
            sx={{ cursor: "pointer", "&:hover": { opacity: 0.8 } }}
          >
            Esqueci minha senha
          </VuiTypography>
        </VuiBox>
        <VuiBox mt={4} mb={1}>
          <VuiButton type="submit" color="info" fullWidth disabled={loading}>
            {loading ? "ENTRANDO..." : "ENTRAR"}
          </VuiButton>
        </VuiBox>
      </VuiBox>
    </CoverLayout>
  );
}

export default SignIn;
