import { useState } from "react";

// react-router-dom components
import { Link } from "react-router-dom";

import VuiBox from "components/VuiBox";
import VuiTypography from "components/VuiTypography";
import VuiInput from "components/VuiInput";
import VuiButton from "components/VuiButton";
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

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleResetPassword = async (e) => {
    e?.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: "https://autonhealth.com.br/auth/reset-password",
      });

      if (resetError) {
        setError("Erro ao enviar email de recuperação. Tente novamente.");
        return;
      }

      setSuccess(true);
    } catch (err) {
      console.error("Erro ao recuperar senha:", err);
      setError("Erro ao enviar email de recuperação. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <CoverLayout
      title="Esqueceu sua senha?"
      color="white"
      description="Digite seu email para receber um link de recuperação"
      premotto=""
      motto=""
      image={bgSignIn}
    >
      <VuiBox component="form" role="form" sx={{ width: "100%" }} onSubmit={handleResetPassword}>
        {error && (
          <VuiBox
            mb={2}
            p={2}
            sx={{
              background: "rgba(255, 56, 56, 0.1)",
              border: "1px solid rgba(255, 56, 56, 0.3)",
              borderRadius: "12px",
            }}
          >
            <VuiTypography variant="body2" fontWeight="medium" sx={{ color: "#FF3838" }}>
              {error}
            </VuiTypography>
          </VuiBox>
        )}
        {success ? (
          <VuiBox
            mb={2}
            p={2}
            sx={{
              background: "rgba(56, 255, 56, 0.1)",
              border: "1px solid rgba(56, 255, 56, 0.3)",
              borderRadius: "12px",
            }}
          >
            <VuiTypography variant="body2" fontWeight="medium" sx={{ color: "#38FF38" }}>
              Email de recuperação enviado! Verifique sua caixa de entrada e spam.
            </VuiTypography>
          </VuiBox>
        ) : (
          <>
            <VuiBox mb={2}>
              <VuiBox mb={1} ml={0.5}>
                <VuiTypography
                  component="label"
                  variant="button"
                  color="white"
                  fontWeight="medium"
                >
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
            <VuiBox mt={4} mb={1}>
              <VuiButton type="submit" color="info" fullWidth disabled={loading}>
                {loading ? "ENVIANDO..." : "ENVIAR LINK DE RECUPERAÇÃO"}
              </VuiButton>
            </VuiBox>
          </>
        )}
        <VuiBox mt={3} textAlign="center">
          <VuiTypography variant="button" color="text" fontWeight="regular">
            Lembrou sua senha?{" "}
            <VuiTypography
              component={Link}
              to="/authentication/sign-in"
              variant="button"
              color="white"
              fontWeight="medium"
            >
              Entrar
            </VuiTypography>
          </VuiTypography>
        </VuiBox>
      </VuiBox>
    </CoverLayout>
  );
}

export default ForgotPassword;
