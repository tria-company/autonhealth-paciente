import { createContext, useContext, useEffect, useState, useRef } from "react";
import { supabase, verificarERenovarSessao } from "lib/supabase-client";

const PacienteContext = createContext(null);

export function PacienteProvider({ children }) {
  const [paciente, setPaciente] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const isLoadingRef = useRef(false);
  const loadingTimeoutRef = useRef(null);
  const tentativasRef = useRef(0);
  const maxTentativas = 2;

  async function carregarPaciente() {
    if (isLoadingRef.current) return;
    if (loadingTimeoutRef.current) {
      clearTimeout(loadingTimeoutRef.current);
      loadingTimeoutRef.current = null;
    }
    isLoadingRef.current = true;
    setLoading(true);
    setError(null);
    loadingTimeoutRef.current = setTimeout(() => {
      if (isLoadingRef.current) {
        setError("Timeout ao carregar dados");
        setLoading(false);
        isLoadingRef.current = false;
        tentativasRef.current++;
      }
    }, 8000);
    try {
      const { session, error: sessionError } = await verificarERenovarSessao();
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
        loadingTimeoutRef.current = null;
      }
      if (sessionError) {
        setError(sessionError.message);
        setPaciente(null);
        setLoading(false);
        isLoadingRef.current = false;
        tentativasRef.current++;
        return;
      }
      if (!session?.user) {
        setPaciente(null);
        setError(null);
        setLoading(false);
        isLoadingRef.current = false;
        tentativasRef.current = 0;
        return;
      }
      const { data, error: pacienteError } = await supabase
        .from("patients")
        .select("*")
        .eq("user_auth", session.user.id)
        .single();
      if (pacienteError) {
        setError(pacienteError.message);
        setPaciente(null);
        tentativasRef.current++;
        if (tentativasRef.current >= maxTentativas) {
          setError("Erro ao carregar dados. Por favor, recarregue a página.");
        }
      } else {
        setPaciente(data);
        setError(null);
        tentativasRef.current = 0;
        localStorage.setItem("paciente", JSON.stringify(data));
        localStorage.setItem("user_auth_id", session.user.id);
      }
    } catch (err) {
      setError(err.message || "Erro inesperado");
      setPaciente(null);
      tentativasRef.current++;
      if (tentativasRef.current >= maxTentativas) {
        setError("Erro inesperado. Por favor, recarregue a página.");
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
    carregarPaciente();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!mounted) return;
      if (event === "SIGNED_OUT" || event === "USER_DELETED") {
        setPaciente(null);
        setError(null);
        setLoading(false);
        tentativasRef.current = 0;
        localStorage.removeItem("paciente");
        localStorage.removeItem("user_auth_id");
        return;
      }
      if (event === "SIGNED_IN" && session?.user) {
        tentativasRef.current = 0;
        if (!isLoadingRef.current) carregarPaciente();
      }
    });
    return () => {
      mounted = false;
      subscription.unsubscribe();
      if (loadingTimeoutRef.current) clearTimeout(loadingTimeoutRef.current);
    };
  }, []);

  const value = {
    paciente,
    loading,
    error,
    refetchPaciente: carregarPaciente,
  };

  return (
    <PacienteContext.Provider value={value}>
      {children}
    </PacienteContext.Provider>
  );
}

export function usePaciente() {
  const ctx = useContext(PacienteContext);
  if (!ctx) {
    throw new Error("usePaciente deve ser usado dentro de PacienteProvider");
  }
  return ctx;
}
