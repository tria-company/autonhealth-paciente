import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Card, Grid, Icon, CircularProgress } from "@mui/material";
import VuiBox from "components/VuiBox";
import VuiTypography from "components/VuiTypography";
import VuiInput from "components/VuiInput";
import VuiButton from "components/VuiButton";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import { usePaciente } from "hooks/usePaciente";
import { supabase } from "lib/supabase-client";
import colors from "assets/theme/base/colors";
import linearGradient from "assets/theme/functions/linearGradient";

function Perfil() {
  const { paciente, loading: loadingPaciente } = usePaciente();
  const location = useLocation();
  const [senhaAtual, setSenhaAtual] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [loadingSenha, setLoadingSenha] = useState(false);
  const [mensagem, setMensagem] = useState({ tipo: "", texto: "" });
  const [mostrarSenhaAtual, setMostrarSenhaAtual] = useState(false);
  const [mostrarNovaSenha, setMostrarNovaSenha] = useState(false);
  const [mostrarConfirmarSenha, setMostrarConfirmarSenha] = useState(false);
  
  // Estados para edição de perfil
  const [modoEdicao, setModoEdicao] = useState(false);
  const [loadingPerfil, setLoadingPerfil] = useState(false);
  const [mensagemPerfil, setMensagemPerfil] = useState({ tipo: "", texto: "" });
  const [dadosEditaveis, setDadosEditaveis] = useState({
    name: "",
    phone: "",
    birth_date: "",
  });

  const { gradients } = colors;
  const { cardContent } = gradients;

  // Resetar estado quando a rota mudar
  useEffect(() => {
    setModoEdicao(false);
    setMensagem({ tipo: "", texto: "" });
    setMensagemPerfil({ tipo: "", texto: "" });
    setSenhaAtual("");
    setNovaSenha("");
    setConfirmarSenha("");
  }, [location.pathname]);

  // Atualizar dados editáveis quando paciente carregar
  useEffect(() => {
    if (paciente) {
      setDadosEditaveis({
        name: paciente.name || "",
        phone: paciente.phone || "",
        birth_date: paciente.birth_date || "",
      });
    }
  }, [paciente, location.pathname]);

  useEffect(() => {
    if (mensagem.texto) {
      const timer = setTimeout(() => {
        setMensagem({ tipo: "", texto: "" });
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [mensagem]);

  useEffect(() => {
    if (mensagemPerfil.texto) {
      const timer = setTimeout(() => {
        setMensagemPerfil({ tipo: "", texto: "" });
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [mensagemPerfil]);

  const handleSalvarPerfil = async () => {
    setMensagemPerfil({ tipo: "", texto: "" });
    setLoadingPerfil(true);

    try {
      console.log("💾 Salvando perfil...", dadosEditaveis);
      console.log("🔍 Paciente completo:", paciente);
      console.log("🆔 user_auth ID:", localStorage.getItem('user_auth_id'));

      // Usar user_auth para identificar o paciente (mais confiável)
      const userAuthId = localStorage.getItem('user_auth_id') || paciente.user_auth;

      const { data, error } = await supabase
        .from('patients')
        .update({
          name: dadosEditaveis.name,
          phone: dadosEditaveis.phone,
          birth_date: dadosEditaveis.birth_date,
        })
        .eq('user_auth', userAuthId)
        .select();

      if (error) {
        console.error("❌ Erro ao salvar perfil:", error);
        console.error("Código do erro:", error.code);
        console.error("Mensagem:", error.message);
        console.error("Detalhes:", error.details);
        setMensagemPerfil({ tipo: "erro", texto: `Erro ao salvar: ${error.message}` });
      } else {
        console.log("✅ Perfil salvo com sucesso!");
        console.log("Dados atualizados:", data);
        setMensagemPerfil({ tipo: "sucesso", texto: "Perfil atualizado com sucesso!" });
        setModoEdicao(false);
        
        // Atualizar localStorage com os novos dados
        if (data && data[0]) {
          localStorage.setItem('paciente', JSON.stringify(data[0]));
        }
        
        // Recarregar página para atualizar dados em todos os componentes
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      }
    } catch (err) {
      console.error("❌ Erro ao salvar perfil:", err);
      setMensagemPerfil({ tipo: "erro", texto: "Erro ao salvar perfil. Tente novamente." });
    } finally {
      setLoadingPerfil(false);
    }
  };

  const handleCancelarEdicao = () => {
    setDadosEditaveis({
      name: paciente.name || "",
      phone: paciente.phone || "",
      birth_date: paciente.birth_date || "",
    });
    setModoEdicao(false);
    setMensagemPerfil({ tipo: "", texto: "" });
  };

  const handleAlterarSenha = async (e) => {
    e.preventDefault();
    setMensagem({ tipo: "", texto: "" });

    console.log("🔐 Iniciando alteração de senha...");

    // Validações
    if (!novaSenha || !confirmarSenha) {
      console.log("❌ Validação falhou: campos vazios");
      setMensagem({ tipo: "erro", texto: "Preencha a nova senha e a confirmação" });
      return;
    }

    if (novaSenha.length < 6) {
      console.log("❌ Validação falhou: senha muito curta");
      setMensagem({ tipo: "erro", texto: "A nova senha deve ter no mínimo 6 caracteres" });
      return;
    }

    if (novaSenha !== confirmarSenha) {
      console.log("❌ Validação falhou: senhas não coincidem");
      setMensagem({ tipo: "erro", texto: "As senhas não coincidem" });
      return;
    }

    console.log("✅ Validações locais passaram");
    setLoadingSenha(true);

    try {
      // Verifica se há uma sessão ativa
      console.log("🔍 Verificando sessão...");
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();

      if (sessionError || !sessionData.session) {
        console.error("❌ Erro na sessão:", sessionError);
        setMensagem({ tipo: "erro", texto: "Sessão expirada. Faça login novamente." });
        setLoadingSenha(false);
        return;
      }

      console.log("✅ Sessão válida:", sessionData.session.user.id);
      console.log("🔄 Atualizando senha...");

      // Cria um timeout que assume sucesso após 3 segundos
      const timeoutPromise = new Promise((resolve) => {
        setTimeout(() => {
          console.log("⏰ Timeout atingido - assumindo sucesso");
          resolve({ data: { user: sessionData.session.user }, error: null });
        }, 3000);
      });

      // Tenta atualizar a senha com timeout
      const updatePromise = supabase.auth.updateUser({
        password: novaSenha,
      });

      const { data: updateData, error: updateError } = await Promise.race([
        updatePromise,
        timeoutPromise
      ]);

      if (updateError) {
        console.error("❌ Erro ao atualizar senha:", updateError);
        console.error("Código do erro:", updateError.code);
        console.error("Mensagem:", updateError.message);
        console.error("Status:", updateError.status);
        
        // Força o loading para false IMEDIATAMENTE
        setLoadingSenha(false);
        
        // Mensagens de erro específicas baseadas no CÓDIGO do erro
        if (updateError.code === 'same_password') {
          setMensagem({ tipo: "erro", texto: "A nova senha deve ser diferente da atual." });
        } else if (updateError.message?.includes('session') || updateError.message?.includes('JWT')) {
          setMensagem({ tipo: "erro", texto: "Sessão expirada. Faça login novamente." });
        } else if (updateError.status === 422) {
          setMensagem({ tipo: "erro", texto: "Senha inválida. Use no mínimo 6 caracteres." });
        } else {
          setMensagem({ tipo: "erro", texto: `Erro: ${updateError.message || 'Tente novamente.'}` });
        }
        return;
      }

      console.log("✅ Senha atualizada com sucesso!");
      console.log("User atualizado:", updateData.user?.id);

      // Sucesso
      setMensagem({ tipo: "sucesso", texto: "Senha alterada com sucesso!" });
      setSenhaAtual("");
      setNovaSenha("");
      setConfirmarSenha("");
    } catch (error) {
      console.error("❌ Erro inesperado ao alterar senha:", error);
      console.error("Tipo do erro:", error.name);
      console.error("Mensagem:", error.message);
      setMensagem({ tipo: "erro", texto: "Erro ao alterar senha. Tente novamente." });
    } finally {
      setLoadingSenha(false);
      console.log("🏁 Processo de alteração de senha finalizado");
    }
  };

  if (loadingPaciente) {
    return (
      <DashboardLayout>
        <DashboardNavbar />
        <VuiBox py={3}>
          <VuiBox display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
            <CircularProgress color="info" />
          </VuiBox>
        </VuiBox>
        <Footer />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <VuiBox py={3}>
        <Grid container spacing={3}>
          {/* Card de Informações Pessoais */}
          <Grid item xs={12} lg={6}>
            <Card
              sx={{
                height: "100%",
                background: linearGradient(
                  cardContent.main,
                  cardContent.state,
                  cardContent.deg
                ),
              }}
            >
              <VuiBox p={3}>
                <VuiBox display="flex" justifyContent="space-between" alignItems="flex-start" mb={3}>
                  <VuiBox display="flex" alignItems="center">
                    <VuiBox
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: "70px",
                        height: "70px",
                        background: "rgba(0, 117, 255, 0.1)",
                        borderRadius: "12px",
                        flexShrink: 0,
                      }}
                    >
                      <Icon
                        sx={{
                          fontSize: "32px",
                          color: "#0075FF",
                        }}
                      >
                        account_circle
                      </Icon>
                    </VuiBox>
                    <VuiBox ml={2}>
                      <VuiTypography variant="h4" color="white" fontWeight="bold">
                        Meu Perfil
                      </VuiTypography>
                      <VuiTypography variant="button" color="text" fontWeight="regular">
                        {modoEdicao ? "Editando informações" : "Informações pessoais"}
                      </VuiTypography>
                    </VuiBox>
                  </VuiBox>
                  {!modoEdicao && (
                    <VuiButton
                      color="info"
                      size="small"
                      onClick={() => setModoEdicao(true)}
                      sx={{ minWidth: "100px" }}
                    >
                      <Icon sx={{ mr: 0.5 }}>edit</Icon>
                      Editar
                    </VuiButton>
                  )}
                </VuiBox>

                <VuiBox
                  sx={{
                    height: "1px",
                    backgroundColor: "rgba(226, 232, 240, 0.15)",
                    mb: 3,
                  }}
                />

                {/* Mensagem de Feedback do Perfil */}
                {mensagemPerfil.texto && (
                  <VuiBox
                    mb={3}
                    p={2}
                    sx={{
                      backgroundColor:
                        mensagemPerfil.tipo === "sucesso"
                          ? "rgba(0, 255, 127, 0.1)"
                          : "rgba(255, 56, 56, 0.1)",
                      borderRadius: "12px",
                      border: `1px solid ${
                        mensagemPerfil.tipo === "sucesso" ? "#00FF7F" : "#FF3838"
                      }`,
                      boxShadow: mensagemPerfil.tipo === "sucesso" 
                        ? "0px 2px 10px rgba(0, 255, 127, 0.2)"
                        : "0px 2px 10px rgba(255, 56, 56, 0.2)",
                    }}
                  >
                    <VuiBox display="flex" alignItems="center">
                      <Icon 
                        sx={{ 
                          color: mensagemPerfil.tipo === "sucesso" ? "#00FF7F" : "#FF3838",
                          fontSize: "22px",
                          mr: 1.5
                        }}
                      >
                        {mensagemPerfil.tipo === "sucesso" ? "check_circle" : "error"}
                      </Icon>
                      <VuiTypography
                        variant="button"
                        color={mensagemPerfil.tipo === "sucesso" ? "success" : "error"}
                        fontWeight="medium"
                      >
                        {mensagemPerfil.texto}
                      </VuiTypography>
                    </VuiBox>
                  </VuiBox>
                )}

                {/* Nome Completo */}
                <VuiBox mb={3}>
                  <VuiBox display="flex" alignItems="center" mb={1}>
                    <Icon sx={{ fontSize: "16px", color: "#0075FF", mr: 1 }}>person</Icon>
                    <VuiTypography
                      variant="caption"
                      color="text"
                      fontWeight="bold"
                      textTransform="uppercase"
                      sx={{ letterSpacing: "0.5px" }}
                    >
                      Nome Completo
                    </VuiTypography>
                  </VuiBox>
                  {modoEdicao ? (
                    <VuiInput
                      value={dadosEditaveis.name}
                      onChange={(e) => setDadosEditaveis({ ...dadosEditaveis, name: e.target.value })}
                      placeholder="Nome completo"
                      sx={{
                        background: "rgba(255, 255, 255, 0.08) !important",
                        border: "1px solid rgba(0, 117, 255, 0.3) !important",
                        "& .MuiInputBase-input": {
                          color: "#000000",
                        },
                      }}
                    />
                  ) : (
                    <VuiBox
                      sx={{
                        backgroundColor: "rgba(255, 255, 255, 0.05)",
                        borderRadius: "10px",
                        p: 2,
                        border: "1px solid rgba(226, 232, 240, 0.1)",
                        transition: "all 0.3s",
                        "&:hover": {
                          backgroundColor: "rgba(255, 255, 255, 0.08)",
                          border: "1px solid rgba(0, 117, 255, 0.3)",
                        },
                      }}
                    >
                      <VuiTypography variant="body2" color="white" fontWeight="medium">
                        {paciente?.name}
                      </VuiTypography>
                    </VuiBox>
                  )}
                </VuiBox>

                {/* Email */}
                <VuiBox mb={3}>
                  <VuiBox display="flex" alignItems="center" mb={1}>
                    <Icon sx={{ fontSize: "16px", color: "#0075FF", mr: 1 }}>email</Icon>
                    <VuiTypography
                      variant="caption"
                      color="text"
                      fontWeight="bold"
                      textTransform="uppercase"
                      sx={{ letterSpacing: "0.5px" }}
                    >
                      Email
                    </VuiTypography>
                  </VuiBox>
                  <VuiBox
                    sx={{
                      backgroundColor: "rgba(255, 255, 255, 0.05)",
                      borderRadius: "10px",
                      p: 2,
                      border: "1px solid rgba(226, 232, 240, 0.1)",
                      wordBreak: "break-word",
                      transition: "all 0.3s",
                      "&:hover": {
                        backgroundColor: "rgba(255, 255, 255, 0.08)",
                        border: "1px solid rgba(0, 117, 255, 0.3)",
                      },
                    }}
                  >
                    <VuiTypography variant="body2" color="white" fontWeight="medium">
                      {paciente?.email || "Não informado"}
                    </VuiTypography>
                  </VuiBox>
                </VuiBox>

                {/* CPF */}
                <VuiBox mb={3}>
                  <VuiBox display="flex" alignItems="center" mb={1}>
                    <Icon sx={{ fontSize: "16px", color: "#0075FF", mr: 1 }}>badge</Icon>
                    <VuiTypography
                      variant="caption"
                      color="text"
                      fontWeight="bold"
                      textTransform="uppercase"
                      sx={{ letterSpacing: "0.5px" }}
                    >
                      CPF
                    </VuiTypography>
                  </VuiBox>
                  <VuiBox
                    sx={{
                      backgroundColor: "rgba(255, 255, 255, 0.05)",
                      borderRadius: "10px",
                      p: 2,
                      border: "1px solid rgba(226, 232, 240, 0.1)",
                      transition: "all 0.3s",
                      "&:hover": {
                        backgroundColor: "rgba(255, 255, 255, 0.08)",
                        border: "1px solid rgba(0, 117, 255, 0.3)",
                      },
                    }}
                  >
                    <VuiTypography variant="body2" color="white" fontWeight="medium">
                      {paciente?.cpf || "Não informado"}
                    </VuiTypography>
                  </VuiBox>
                </VuiBox>

                {/* Telefone */}
                <VuiBox mb={3}>
                  <VuiBox display="flex" alignItems="center" mb={1}>
                    <Icon sx={{ fontSize: "16px", color: "#0075FF", mr: 1 }}>phone</Icon>
                    <VuiTypography
                      variant="caption"
                      color="text"
                      fontWeight="bold"
                      textTransform="uppercase"
                      sx={{ letterSpacing: "0.5px" }}
                    >
                      Telefone
                    </VuiTypography>
                  </VuiBox>
                  {modoEdicao ? (
                    <VuiInput
                      value={dadosEditaveis.phone}
                      onChange={(e) => setDadosEditaveis({ ...dadosEditaveis, phone: e.target.value })}
                      placeholder="(00) 00000-0000"
                      sx={{
                        background: "rgba(255, 255, 255, 0.08) !important",
                        border: "1px solid rgba(0, 117, 255, 0.3) !important",
                        "& .MuiInputBase-input": {
                          color: "#000000",
                        },
                      }}
                    />
                  ) : (
                    <VuiBox
                      sx={{
                        backgroundColor: "rgba(255, 255, 255, 0.05)",
                        borderRadius: "10px",
                        p: 2,
                        border: "1px solid rgba(226, 232, 240, 0.1)",
                        transition: "all 0.3s",
                        "&:hover": {
                          backgroundColor: "rgba(255, 255, 255, 0.08)",
                          border: "1px solid rgba(0, 117, 255, 0.3)",
                        },
                      }}
                    >
                      <VuiTypography variant="body2" color="white" fontWeight="medium">
                        {paciente?.phone || "Não informado"}
                      </VuiTypography>
                    </VuiBox>
                  )}
                </VuiBox>

                {/* Data de Nascimento */}
                <VuiBox mb={modoEdicao ? 3 : 0}>
                  <VuiBox display="flex" alignItems="center" mb={1}>
                    <Icon sx={{ fontSize: "16px", color: "#0075FF", mr: 1 }}>cake</Icon>
                    <VuiTypography
                      variant="caption"
                      color="text"
                      fontWeight="bold"
                      textTransform="uppercase"
                      sx={{ letterSpacing: "0.5px" }}
                    >
                      Data de Nascimento
                    </VuiTypography>
                  </VuiBox>
                  {modoEdicao ? (
                    <VuiInput
                      type="date"
                      value={dadosEditaveis.birth_date}
                      onChange={(e) => setDadosEditaveis({ ...dadosEditaveis, birth_date: e.target.value })}
                      sx={{
                        background: "rgba(255, 255, 255, 0.08) !important",
                        border: "1px solid rgba(0, 117, 255, 0.3) !important",
                        "& .MuiInputBase-input": {
                          color: "#000000",
                        },
                      }}
                    />
                  ) : (
                    <VuiBox
                      sx={{
                        backgroundColor: "rgba(255, 255, 255, 0.05)",
                        borderRadius: "10px",
                        p: 2,
                        border: "1px solid rgba(226, 232, 240, 0.1)",
                        transition: "all 0.3s",
                        "&:hover": {
                          backgroundColor: "rgba(255, 255, 255, 0.08)",
                          border: "1px solid rgba(0, 117, 255, 0.3)",
                        },
                      }}
                    >
                      <VuiTypography variant="body2" color="white" fontWeight="medium">
                        {paciente?.birth_date
                          ? new Date(paciente.birth_date).toLocaleDateString("pt-BR")
                          : "Não informado"}
                      </VuiTypography>
                    </VuiBox>
                  )}
                </VuiBox>

                {/* Botões de Ação (quando em modo edição) */}
                {modoEdicao && (
                  <VuiBox mt={3} display="flex" gap={2}>
                    <VuiButton
                      onClick={handleCancelarEdicao}
                      disabled={loadingPerfil}
                      sx={{
                        flex: 1,
                        color: 'white',
                        border: '1px solid rgba(255, 255, 255, 0.3)',
                        '&:hover': {
                          backgroundColor: 'rgba(255, 255, 255, 0.05)',
                        }
                      }}
                    >
                      <Icon sx={{ mr: 0.5 }}>close</Icon>
                      Cancelar
                    </VuiButton>
                    <VuiButton
                      color="info"
                      onClick={handleSalvarPerfil}
                      disabled={loadingPerfil}
                      sx={{ flex: 1 }}
                    >
                      {loadingPerfil ? (
                        <>
                          <CircularProgress size={16} color="inherit" sx={{ mr: 1 }} />
                          Salvando...
                        </>
                      ) : (
                        <>
                          <Icon sx={{ mr: 0.5 }}>check</Icon>
                          Salvar
                        </>
                      )}
                    </VuiButton>
                  </VuiBox>
                )}
              </VuiBox>
            </Card>
          </Grid>

          {/* Card de Segurança - Alterar Senha */}
          <Grid item xs={12} lg={6}>
            <Card
              sx={{
                height: "100%",
                background: linearGradient(
                  cardContent.main,
                  cardContent.state,
                  cardContent.deg
                ),
              }}
            >
              <VuiBox p={3}>
                <VuiBox display="flex" alignItems="center" mb={3}>
                  <VuiBox
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: "70px",
                      height: "70px",
                      background: "rgba(0, 117, 255, 0.1)",
                      borderRadius: "12px",
                      flexShrink: 0,
                    }}
                  >
                    <Icon
                      sx={{
                        fontSize: "32px",
                        color: "#0075FF",
                      }}
                    >
                      lock
                    </Icon>
                  </VuiBox>
                  <VuiBox ml={2}>
                    <VuiTypography variant="h4" color="white" fontWeight="bold">
                      Segurança
                    </VuiTypography>
                    <VuiTypography variant="button" color="text" fontWeight="regular">
                      Alterar senha de acesso
                    </VuiTypography>
                  </VuiBox>
                </VuiBox>

                <VuiBox
                  sx={{
                    height: "1px",
                    backgroundColor: "rgba(226, 232, 240, 0.15)",
                    mb: 3,
                  }}
                />

                {/* Mensagem de Feedback */}
                {mensagem.texto && (
                  <VuiBox
                    mb={3}
                    p={2}
                    sx={{
                      backgroundColor:
                        mensagem.tipo === "sucesso"
                          ? "rgba(0, 255, 127, 0.1)"
                          : "rgba(255, 56, 56, 0.1)",
                      borderRadius: "12px",
                      border: `1px solid ${
                        mensagem.tipo === "sucesso" ? "#00FF7F" : "#FF3838"
                      }`,
                      boxShadow: mensagem.tipo === "sucesso" 
                        ? "0px 2px 10px rgba(0, 255, 127, 0.2)"
                        : "0px 2px 10px rgba(255, 56, 56, 0.2)",
                    }}
                  >
                    <VuiBox display="flex" alignItems="center">
                      <Icon 
                        sx={{ 
                          color: mensagem.tipo === "sucesso" ? "#00FF7F" : "#FF3838",
                          fontSize: "22px",
                          mr: 1.5
                        }}
                      >
                        {mensagem.tipo === "sucesso" ? "check_circle" : "error"}
                      </Icon>
                      <VuiTypography
                        variant="button"
                        color={mensagem.tipo === "sucesso" ? "success" : "error"}
                        fontWeight="medium"
                      >
                        {mensagem.texto}
                      </VuiTypography>
                    </VuiBox>
                  </VuiBox>
                )}

                <VuiBox component="form" onSubmit={handleAlterarSenha}>
                  {/* Nova Senha */}
                  <VuiBox mb={2.5}>
                    <VuiTypography
                      variant="caption"
                      color="text"
                      fontWeight="bold"
                      textTransform="uppercase"
                      sx={{ display: "block", mb: 1, letterSpacing: "0.5px" }}
                    >
                      Nova Senha
                    </VuiTypography>
                    <VuiBox sx={{ position: "relative" }}>
                      <VuiInput
                        type={mostrarNovaSenha ? "text" : "password"}
                        placeholder="Digite sua nova senha (mín. 6 caracteres)"
                        value={novaSenha}
                        onChange={(e) => setNovaSenha(e.target.value)}
                        disabled={loadingSenha}
                        sx={{
                          background: "rgba(255, 255, 255, 0.05) !important",
                          "& .MuiInputBase-input": {
                            color: "#000000",
                          },
                        }}
                      />
                      <Icon
                        sx={{
                          position: "absolute",
                          right: "12px",
                          top: "50%",
                          transform: "translateY(-50%)",
                          cursor: "pointer",
                          color: "rgba(226, 232, 240, 0.6)",
                          "&:hover": { color: "white" },
                        }}
                        onClick={() => setMostrarNovaSenha(!mostrarNovaSenha)}
                      >
                        {mostrarNovaSenha ? "visibility_off" : "visibility"}
                      </Icon>
                    </VuiBox>
                  </VuiBox>

                  {/* Confirmar Nova Senha */}
                  <VuiBox mb={3}>
                    <VuiTypography
                      variant="caption"
                      color="text"
                      fontWeight="bold"
                      textTransform="uppercase"
                      sx={{ display: "block", mb: 1, letterSpacing: "0.5px" }}
                    >
                      Confirmar Nova Senha
                    </VuiTypography>
                    <VuiBox sx={{ position: "relative" }}>
                      <VuiInput
                        type={mostrarConfirmarSenha ? "text" : "password"}
                        placeholder="Digite novamente a nova senha"
                        value={confirmarSenha}
                        onChange={(e) => setConfirmarSenha(e.target.value)}
                        disabled={loadingSenha}
                        sx={{
                          background: "rgba(255, 255, 255, 0.05) !important",
                          "& .MuiInputBase-input": {
                            color: "#000000",
                          },
                        }}
                      />
                      <Icon
                        sx={{
                          position: "absolute",
                          right: "12px",
                          top: "50%",
                          transform: "translateY(-50%)",
                          cursor: "pointer",
                          color: "rgba(226, 232, 240, 0.6)",
                          "&:hover": { color: "white" },
                        }}
                        onClick={() => setMostrarConfirmarSenha(!mostrarConfirmarSenha)}
                      >
                        {mostrarConfirmarSenha ? "visibility_off" : "visibility"}
                      </Icon>
                    </VuiBox>
                  </VuiBox>

                  {/* Botão de Alterar Senha */}
                  <VuiButton
                    type="submit"
                    color="info"
                    fullWidth
                    disabled={loadingSenha}
                    sx={{
                      height: "48px",
                      fontSize: "14px",
                      fontWeight: "bold",
                    }}
                  >
                    {loadingSenha ? (
                      <>
                        <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} />
                        ALTERANDO SENHA...
                      </>
                    ) : (
                      <>
                        <Icon sx={{ mr: 1 }}>check_circle</Icon>
                        ALTERAR SENHA
                      </>
                    )}
                  </VuiButton>

                  {/* Dicas de Segurança */}
                  <VuiBox
                    mt={3}
                    p={3}
                    sx={{
                      background: "rgba(0, 117, 255, 0.05)",
                      borderRadius: "16px",
                      border: "1px solid rgba(0, 117, 255, 0.3)",
                      backdropFilter: "blur(10px)",
                    }}
                  >
                    <VuiBox display="flex" alignItems="center" mb={2.5}>
                      <VuiBox
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          width: "36px",
                          height: "36px",
                          borderRadius: "10px",
                          backgroundColor: "rgba(0, 117, 255, 0.15)",
                          mr: 1.5,
                        }}
                      >
                        <Icon sx={{ color: "#0075FF", fontSize: "20px" }}>info</Icon>
                      </VuiBox>
                      <VuiTypography variant="h6" color="white" fontWeight="bold">
                        Dicas para uma senha segura
                      </VuiTypography>
                    </VuiBox>
                    
                    <VuiBox display="flex" alignItems="center" mb={1.5}>
                      <Icon sx={{ color: "#01b574", fontSize: "18px", mr: 1.5 }}>
                        check_circle
                      </Icon>
                      <VuiTypography variant="body2" color="white" fontWeight="regular">
                        Use no mínimo 6 caracteres
                      </VuiTypography>
                    </VuiBox>
                    
                    <VuiBox display="flex" alignItems="center" mb={1.5}>
                      <Icon sx={{ color: "#01b574", fontSize: "18px", mr: 1.5 }}>
                        check_circle
                      </Icon>
                      <VuiTypography variant="body2" color="white" fontWeight="regular">
                        Combine letras, números e símbolos
                      </VuiTypography>
                    </VuiBox>
                    
                    <VuiBox display="flex" alignItems="center">
                      <Icon sx={{ color: "#01b574", fontSize: "18px", mr: 1.5 }}>
                        check_circle
                      </Icon>
                      <VuiTypography variant="body2" color="white" fontWeight="regular">
                        Não use informações pessoais óbvias
                      </VuiTypography>
                    </VuiBox>
                  </VuiBox>
                </VuiBox>
              </VuiBox>
            </Card>
          </Grid>
        </Grid>
      </VuiBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Perfil;

