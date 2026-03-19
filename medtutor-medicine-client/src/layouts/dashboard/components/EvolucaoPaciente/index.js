import React, { useState, useRef } from "react";
import { Card, Grid, Collapse, IconButton, Box, Modal, Fade, Backdrop } from "@mui/material";
import VuiBox from "components/VuiBox";
import VuiTypography from "components/VuiTypography";
import VuiButton from "components/VuiButton";
import colors from "assets/theme/base/colors";
import linearGradient from "assets/theme/functions/linearGradient";
import ReactApexChart from "react-apexcharts";
import {
  IoChevronDown,
  IoCamera,
  IoCloudUpload,
  IoTrophy,
  IoScale,
  IoResize,
  IoBody,
  IoPencil,
  IoClose,
  IoCheckmark,
  IoFlag,
  IoTime,
  IoArrowForward,
  IoDocumentText,
  IoImage,
} from "react-icons/io5";

// Dados mock das anamneses
const ANAMNESES_MOCK = [
  {
    id: 0, num: 1, mes: "Janeiro", mesAbr: "Jan", ano: "2025", data: "10 Jan 2025",
    peso: 75.0, cintura: 80, imc: 29.3, gordura: 37, massaMagra: 41.3,
    deltaPeso: null, deltaCintura: null, deltaGordura: null, deltaMagra: null,
    imcClass: "Obesidade I", imcColor: "#e31a1a",
    progresso: 0, totalPerdido: 0, isGoal: false,
    nota: "Inicio do acompanhamento. Habitos alimentares irregulares, alto consumo de ultraprocessados. Paciente motivada e comprometida.",
  },
  {
    id: 1, num: 2, mes: "Fevereiro", mesAbr: "Fev", ano: "2025", data: "12 Fev 2025",
    peso: 73.2, cintura: 78, imc: 28.6, gordura: 35, massaMagra: 41.5,
    deltaPeso: "-1,8 kg", deltaCintura: "-2 cm", deltaGordura: "-2pp", deltaMagra: "+0,2 kg",
    imcClass: "Sobrepeso", imcColor: "#f6a940",
    progresso: 18, totalPerdido: 1.8, isGoal: false,
    nota: "Otima adaptacao. Reduziu acucar e farinhas refinadas. Sono melhorou. Manteve 3x treino por semana.",
  },
  {
    id: 2, num: 3, mes: "Marco", mesAbr: "Mar", ano: "2025", data: "10 Mar 2025",
    peso: 71.0, cintura: 76, imc: 27.7, gordura: 33, massaMagra: 41.8,
    deltaPeso: "-2,2 kg", deltaCintura: "-2 cm", deltaGordura: "-2pp", deltaMagra: "+0,3 kg",
    imcClass: "Sobrepeso", imcColor: "#f6a940",
    progresso: 40, totalPerdido: 4.0, isGoal: false,
    nota: "Excelente progresso! Aumentamos proteina no jantar. Paciente relatou mais energia e menos inchaco abdominal.",
  },
  {
    id: 3, num: 4, mes: "Abril", mesAbr: "Abr", ano: "2025", data: "08 Abr 2025",
    peso: 68.5, cintura: 73, imc: 26.8, gordura: 30, massaMagra: 42.1,
    deltaPeso: "-2,5 kg", deltaCintura: "-3 cm", deltaGordura: "-3pp", deltaMagra: "+0,3 kg",
    imcClass: "Sobrepeso", imcColor: "#f6a940",
    progresso: 65, totalPerdido: 6.5, isGoal: false,
    nota: "Marco importante: -6,5 kg! IMC proximo de normal. Introduzimos carboidratos ciclados no dia de treino.",
  },
  {
    id: 4, num: 5, mes: "Junho", mesAbr: "Jun", ano: "2025", data: "09 Jun 2025",
    peso: 65.0, cintura: 69, imc: 25.4, gordura: 26, massaMagra: 42.6,
    deltaPeso: "-3,5 kg", deltaCintura: "-4 cm", deltaGordura: "-4pp", deltaMagra: "+0,5 kg",
    imcClass: "Normal", imcColor: "#01b574",
    progresso: 100, totalPerdido: 10.0, isGoal: true,
    nota: "META ATINGIDA! Peso: 65 kg. Plano de manutencao iniciado. Paciente firme e confiante. Resultado extraordinario!",
  },
];

const ALL_PESO = [75.0, 73.2, 71.0, 68.5, 65.0];
const ALL_CINTURA = [80, 78, 76, 73, 69];
const ALL_MONTHS = ["Jan", "Fev", "Mar", "Abr", "Jun"];
const PHOTO_LABELS = ["Frente fechada", "Costas fechadas", "Lateral esq.", "Lateral dir."];

const imcPct = (imc) => Math.min(Math.max(((imc - 18.5) / (35 - 18.5)) * 100, 2), 94);
const gordOffset = (g) => 125.7 * (1 - g / 60);
const muscOffset = (m) => Math.max(125.7 * (1 - (m - 38) / 10), 8);

// Chart options builder
const buildChartOptions = (color) => ({
  chart: {
    type: "area",
    toolbar: { show: false },
    zoom: { enabled: false },
    background: "transparent",
  },
  colors: [color, color + "44"],
  dataLabels: { enabled: false },
  stroke: {
    curve: "smooth",
    width: [2.5, 1.5],
    dashArray: [0, 5],
  },
  fill: {
    type: ["gradient", "none"],
    gradient: { shadeIntensity: 1, opacityFrom: 0.3, opacityTo: 0.05, stops: [0, 90, 100] },
  },
  grid: {
    show: true,
    borderColor: "rgba(44, 62, 80, 0.08)",
    strokeDashArray: 4,
    xaxis: { lines: { show: false } },
  },
  xaxis: {
    categories: ALL_MONTHS,
    labels: { style: { colors: "#7a8c94", fontSize: "10px", fontFamily: "Plus Jakarta Display" } },
    axisBorder: { show: false },
    axisTicks: { show: false },
  },
  yaxis: {
    labels: { style: { colors: "#7a8c94", fontSize: "10px", fontFamily: "Plus Jakarta Display" } },
  },
  tooltip: {
    theme: "light",
    style: { fontFamily: "Plus Jakarta Display" },
  },
  legend: { show: false },
  markers: {
    size: [4, 0],
    colors: ["#fff"],
    strokeColors: [color, "transparent"],
    strokeWidth: 2.5,
    hover: { size: 7 },
  },
});

// Pill component
function Pill({ children, variant = "default" }) {
  const bgMap = {
    default: "rgba(44, 62, 80, 0.06)",
    success: "rgba(1, 181, 116, 0.1)",
    warning: "rgba(249, 207, 5, 0.12)",
  };
  const colorMap = {
    default: "#7a8c94",
    success: "#01b574",
    warning: "#c49a00",
  };
  const borderMap = {
    default: "rgba(44, 62, 80, 0.12)",
    success: "rgba(1, 181, 116, 0.25)",
    warning: "rgba(249, 207, 5, 0.3)",
  };

  return (
    <Box
      component="span"
      sx={{
        fontSize: "11px",
        fontWeight: 600,
        padding: "3px 10px",
        borderRadius: "20px",
        background: bgMap[variant],
        border: `1px solid ${borderMap[variant]}`,
        color: colorMap[variant],
        display: "inline-flex",
        alignItems: "center",
        gap: "3px",
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </Box>
  );
}

// Delta badge
function DeltaBadge({ text, positive = true }) {
  if (!text) return null;
  return (
    <Box
      component="span"
      sx={{
        fontSize: "10px",
        fontWeight: 600,
        padding: "2px 7px",
        borderRadius: "20px",
        background: positive ? "rgba(1, 181, 116, 0.12)" : "rgba(227, 26, 26, 0.12)",
        color: positive ? "#01b574" : "#e31a1a",
        ml: "6px",
      }}
    >
      {text}
    </Box>
  );
}

// Composition Ring SVG
function CompositionRing({ value, max, color, label, delta, displayValue, unit = "%" }) {
  const circumference = 125.7;
  const normalizedValue = Math.min(Math.max(value, 0), max);
  const offset = circumference * (1 - normalizedValue / max);

  return (
    <Box sx={{ textAlign: "center", flex: 1 }}>
      <Box sx={{ position: "relative", width: 56, height: 56, margin: "0 auto 6px" }}>
        <svg viewBox="0 0 52 52" width="56" height="56">
          <circle cx="26" cy="26" r="20" fill="none" stroke="rgba(44,62,80,0.08)" strokeWidth="5" />
          <circle
            cx="26" cy="26" r="20" fill="none" stroke={color} strokeWidth="5"
            strokeDasharray={circumference} strokeDashoffset={offset}
            strokeLinecap="round" transform="rotate(-90 26 26)"
            style={{ transition: "stroke-dashoffset 0.8s ease" }}
          />
        </svg>
        <Box sx={{
          position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <VuiTypography variant="caption" color="white" fontWeight="bold" sx={{ fontSize: "11px" }}>
            {displayValue !== undefined ? displayValue : value}{unit}
          </VuiTypography>
        </Box>
      </Box>
      <VuiTypography variant="caption" color="text" sx={{ fontSize: "10px", display: "block" }}>
        {label}
      </VuiTypography>
      {delta && <DeltaBadge text={delta} positive />}
    </Box>
  );
}

// Photo Slot
function PhotoSlot({ label, onUpload, photo }) {
  return (
    <Box
      onClick={onUpload}
      sx={{
        background: "rgba(44, 62, 80, 0.03)",
        border: "1.5px dashed rgba(44, 62, 80, 0.15)",
        borderRadius: "12px",
        overflow: "hidden",
        position: "relative",
        cursor: "pointer",
        minHeight: { xs: "120px", md: "140px" },
        width: "100%",
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "6px",
        transition: "all 0.2s",
        "&:hover": {
          borderColor: "#2c3e50",
          background: "rgba(44, 62, 80, 0.06)",
        },
        "&:hover .edit-btn": {
          opacity: 1,
        },
      }}
    >
      {photo ? (
        <>
          <Box
            component="img"
            src={photo}
            sx={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
          />
          <Box
            sx={{
              position: "absolute", bottom: 0, left: 0, right: 0,
              padding: "8px 10px",
              background: "linear-gradient(to top, rgba(10,25,15,0.85) 0%, transparent 100%)",
            }}
          >
            <VuiTypography sx={{ fontSize: "9px", fontWeight: 700, color: "#fff", textTransform: "uppercase", letterSpacing: "0.06em" }}>
              {label}
            </VuiTypography>
          </Box>
          <Box
            className="edit-btn"
            sx={{
              position: "absolute", top: 6, right: 6,
              width: 24, height: 24,
              background: "rgba(255,255,255,0.9)",
              border: "1px solid rgba(44,62,80,0.12)",
              borderRadius: "50%",
              display: "flex", alignItems: "center", justifyContent: "center",
              opacity: 0, transition: "opacity 0.2s",
            }}
          >
            <IoPencil size={10} color="#2c3e50" />
          </Box>
        </>
      ) : (
        <>
          <Box sx={{
            width: 38, height: 38,
            background: "#fff",
            border: "1.5px dashed rgba(44,62,80,0.2)",
            borderRadius: "10px",
            display: "flex", alignItems: "center", justifyContent: "center",
            transition: "all 0.2s",
          }}>
            <IoCamera size={16} color="#7a8c94" />
          </Box>
          <VuiTypography sx={{ fontSize: "10px", color: "#7a8c94", textAlign: "center", lineHeight: 1.4, fontWeight: 500 }}>
            {label}
          </VuiTypography>
        </>
      )}
    </Box>
  );
}

// Upload Modal
function UploadModal({ open, onClose, title, subtitle, onConfirm }) {
  const fileInputRef = useRef(null);
  const [preview, setPreview] = useState(null);

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setPreview(ev.target.result);
    reader.readAsDataURL(file);
  };

  const handleConfirm = () => {
    if (preview) onConfirm(preview);
    setPreview(null);
    onClose();
  };

  const handleClose = () => {
    setPreview(null);
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{ timeout: 300, sx: { backdropFilter: "blur(6px)", background: "rgba(44,62,80,0.35)" } }}
    >
      <Fade in={open}>
        <Box sx={{
          position: "absolute", top: "50%", left: "50%",
          transform: "translate(-50%, -50%)",
          background: "#fff", borderRadius: "20px", padding: "26px",
          width: "90%", maxWidth: 360,
          boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
        }}>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <IoCamera size={18} color="#2c3e50" />
              <VuiTypography sx={{ fontSize: "17px", fontWeight: 800, color: "#2c3e50" }}>
                {title || "Foto"}
              </VuiTypography>
            </Box>
            <IconButton onClick={handleClose} size="small">
              <IoClose size={18} color="#7a8c94" />
            </IconButton>
          </Box>
          <VuiTypography sx={{ fontSize: "12px", color: "#7a8c94", mb: 2 }}>
            {subtitle || "Selecione a imagem."}
          </VuiTypography>

          {!preview && (
            <Box
              onClick={() => fileInputRef.current?.click()}
              sx={{
                border: "2px dashed rgba(44,62,80,0.2)",
                borderRadius: "14px",
                padding: "26px",
                textAlign: "center",
                cursor: "pointer",
                transition: "all 0.2s",
                background: "rgba(44,62,80,0.02)",
                mb: 2,
                "&:hover": {
                  borderColor: "#2c3e50",
                  background: "rgba(44,62,80,0.05)",
                },
              }}
            >
              <IoCloudUpload size={28} color="#2c3e50" style={{ marginBottom: 6 }} />
              <VuiTypography sx={{ fontSize: "12px", color: "#7a8c94" }}>
                <strong style={{ color: "#2c3e50" }}>Clique para selecionar</strong>
                <br />
                <span style={{ fontSize: "10px" }}>JPG, PNG - ate 10 MB</span>
              </VuiTypography>
            </Box>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleFile}
          />

          {preview && (
            <Box sx={{ mb: 2 }}>
              <Box
                component="img"
                src={preview}
                sx={{ width: "100%", borderRadius: "10px", border: "1px solid rgba(44,62,80,0.12)" }}
              />
            </Box>
          )}

          <Box sx={{ display: "flex", gap: 1 }}>
            <Box
              onClick={handleClose}
              sx={{
                flex: 1, padding: "10px", textAlign: "center",
                background: "transparent", border: "1.5px solid rgba(44,62,80,0.15)",
                borderRadius: "10px", color: "#7a8c94", cursor: "pointer",
                fontFamily: "Plus Jakarta Display", fontSize: "13px", fontWeight: 500,
                transition: "all 0.2s",
                "&:hover": { borderColor: "#2c3e50", color: "#2c3e50" },
              }}
            >
              Cancelar
            </Box>
            <Box
              onClick={handleConfirm}
              sx={{
                flex: 2, padding: "10px", textAlign: "center",
                background: "linear-gradient(135deg, #2c3e50, #1a252f)",
                borderRadius: "10px", color: "#fff", cursor: "pointer",
                fontFamily: "Plus Jakarta Display", fontSize: "13px", fontWeight: 700,
                boxShadow: "0 4px 14px rgba(44,62,80,0.28)",
                display: "flex", alignItems: "center", justifyContent: "center", gap: "6px",
                transition: "opacity 0.2s",
                "&:hover": { opacity: 0.9 },
              }}
            >
              <IoCheckmark size={16} /> Confirmar
            </Box>
          </Box>
        </Box>
      </Fade>
    </Modal>
  );
}

// Accordion Item
function AnamnesesItem({ anamnese, isOpen, onToggle, photos, onPhotoUpload }) {
  const { gradients } = colors;
  const { cardContent } = gradients;
  const a = anamnese;

  return (
    <Box sx={{ position: "relative", zIndex: 1 }}>
      <Card
        sx={{
          background: linearGradient(cardContent.main, cardContent.state, cardContent.deg),
          border: isOpen
            ? "1.5px solid rgba(44, 62, 80, 0.25)"
            : a.isGoal
            ? "1.5px solid #01b574"
            : "1.5px solid rgba(44, 62, 80, 0.1)",
          borderRadius: "16px",
          boxShadow: isOpen
            ? "0 8px 28px rgba(0,0,0,0.1)"
            : "0 2px 12px rgba(0,0,0,0.04)",
          overflow: "hidden",
          transition: "all 0.25s",
        }}
      >
        {/* Header */}
        <Box
          onClick={onToggle}
          sx={{
            display: "flex",
            alignItems: "center",
            gap: { xs: "10px", md: "14px" },
            padding: { xs: "12px 14px", md: "14px 18px" },
            cursor: "pointer",
            userSelect: "none",
            transition: "background 0.2s",
            background: isOpen ? "rgba(44, 62, 80, 0.04)" : "transparent",
            "&:hover": { background: "rgba(44, 62, 80, 0.03)" },
          }}
        >
          {/* Number circle */}
          <Box sx={{
            width: 44, height: 44, borderRadius: "50%",
            background: isOpen ? "#2c3e50" : a.isGoal ? "#01b574" : "rgba(44,62,80,0.05)",
            border: isOpen ? "2px solid #2c3e50" : a.isGoal ? "2px solid #01b574" : "2px solid rgba(44,62,80,0.12)",
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
            flexShrink: 0, transition: "all 0.2s",
          }}>
            <VuiTypography sx={{
              fontSize: "14px", fontWeight: 800, lineHeight: 1,
              color: isOpen || a.isGoal ? "#fff" : "#7a8c94",
            }}>
              {a.num}
            </VuiTypography>
            <VuiTypography sx={{
              fontSize: "8px", textTransform: "uppercase", letterSpacing: "0.04em",
              color: isOpen || a.isGoal ? "rgba(255,255,255,0.7)" : "#b4bfb4",
            }}>
              Ana.
            </VuiTypography>
          </Box>

          {/* Info */}
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
              <VuiTypography color="white" fontWeight="bold" sx={{ fontSize: { xs: "14px", md: "16px" } }}>
                {a.mes} {a.ano}
              </VuiTypography>
              <VuiTypography sx={{ fontSize: "11px", color: "#7a8c94" }}>
                {a.data}
              </VuiTypography>
              {a.isGoal && (
                <Box sx={{
                  background: "#01b574", color: "#fff",
                  fontSize: "10px", fontWeight: 700,
                  padding: "2px 9px", borderRadius: "20px",
                  letterSpacing: "0.03em",
                  display: "inline-flex", alignItems: "center", gap: "4px",
                }}>
                  <IoTrophy size={10} /> Meta atingida!
                </Box>
              )}
            </Box>
            <Box sx={{ display: "flex", gap: "6px", mt: "6px", flexWrap: "wrap" }}>
              {a.deltaPeso ? (
                <>
                  <Pill variant="success">{a.deltaPeso}</Pill>
                  <Pill variant="success">{a.deltaCintura}</Pill>
                  <Pill variant="warning">IMC {a.imc.toFixed(1)} - {a.imcClass}</Pill>
                </>
              ) : (
                <>
                  <Pill>Peso inicial: {a.peso} kg</Pill>
                  <Pill variant="warning">IMC {a.imc.toFixed(1)} - {a.imcClass}</Pill>
                </>
              )}
            </Box>
          </Box>

          {/* Chevron */}
          <Box sx={{
            width: 32, height: 32,
            border: "1.5px solid rgba(44,62,80,0.12)",
            borderRadius: "50%",
            display: "flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0,
            transition: "all 0.3s",
            transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
            background: isOpen ? "#fff" : "transparent",
            borderColor: isOpen ? "rgba(44,62,80,0.2)" : "rgba(44,62,80,0.12)",
          }}>
            <IoChevronDown size={14} color={isOpen ? "#2c3e50" : "#b4bfb4"} />
          </Box>
        </Box>

        {/* Body */}
        <Collapse in={isOpen} timeout={450}>
          <Box sx={{ padding: { xs: "0 14px 16px", md: "0 18px 20px" }, borderTop: "1px solid rgba(44,62,80,0.08)" }}>
            <Grid container spacing={2} sx={{ mt: 1, alignItems: "stretch" }}>
              {/* Photos Grid */}
              <Grid item xs={12} md={7} sx={{ display: "flex" }}>
                <Grid container spacing={1.2} sx={{ flex: 1 }}>
                  {PHOTO_LABELS.map((label, i) => (
                    <Grid item xs={6} key={i} sx={{ display: "flex" }}>
                      <Box sx={{ width: "100%", display: "flex" }}>
                        <PhotoSlot
                          label={label}
                          photo={photos[`${a.id}-${i}`]}
                          onUpload={() => onPhotoUpload(a.id, i)}
                        />
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Grid>

              {/* Info Card */}
              <Grid item xs={12} md={5} sx={{ display: "flex" }}>
                <Box sx={{
                  background: "rgba(44, 62, 80, 0.03)",
                  border: "1px solid rgba(44, 62, 80, 0.08)",
                  borderRadius: "12px",
                  padding: { xs: "14px", md: "16px" },
                  width: "100%",
                }}>
                  {/* Tag */}
                  <Box sx={{
                    display: "inline-flex", alignItems: "center",
                    background: "rgba(44,62,80,0.06)", border: "1px solid rgba(44,62,80,0.12)",
                    borderRadius: "8px", padding: "3px 9px",
                    fontSize: "10px", fontWeight: 700, color: "#2c3e50",
                    letterSpacing: "0.06em", textTransform: "uppercase", mb: "12px",
                  }}>
                    {a.mesAbr} {a.ano}
                  </Box>

                  {/* Peso */}
                  <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", py: "7px", borderBottom: "1px solid rgba(44,62,80,0.06)" }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "11px", color: "#7a8c94" }}>
                      <IoScale size={13} /> Peso
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <VuiTypography sx={{ fontSize: "12px", fontWeight: 700, color: "#2c3e50" }}>
                        {a.peso.toFixed(1)} kg
                      </VuiTypography>
                      {a.deltaPeso && <DeltaBadge text={a.deltaPeso} positive />}
                    </Box>
                  </Box>

                  {/* Cintura */}
                  <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", py: "7px", borderBottom: "1px solid rgba(44,62,80,0.06)" }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "11px", color: "#7a8c94" }}>
                      <IoResize size={13} /> Cintura
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <VuiTypography sx={{ fontSize: "12px", fontWeight: 700, color: "#2c3e50" }}>
                        {a.cintura} cm
                      </VuiTypography>
                      {a.deltaCintura && <DeltaBadge text={a.deltaCintura} positive />}
                    </Box>
                  </Box>

                  {/* IMC section */}
                  <Box sx={{ my: "10px" }}>
                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1 }}>
                      <Box sx={{ textAlign: "center" }}>
                        <VuiTypography sx={{ fontSize: "9px", color: "#7a8c94" }}>IMC atual</VuiTypography>
                        <VuiTypography sx={{ fontSize: "20px", fontWeight: 800, color: "#2c3e50" }}>
                          {a.imc.toFixed(1)}
                        </VuiTypography>
                        <VuiTypography sx={{ fontSize: "9px", color: a.imcColor, fontWeight: 500 }}>
                          {a.imcClass}
                        </VuiTypography>
                      </Box>
                      <IoArrowForward size={14} color="#b4bfb4" />
                      <Box sx={{ textAlign: "center" }}>
                        <VuiTypography sx={{ fontSize: "9px", color: "#7a8c94" }}>IMC meta</VuiTypography>
                        <VuiTypography sx={{ fontSize: "20px", fontWeight: 800, color: "#01b574" }}>
                          25,4
                        </VuiTypography>
                        <VuiTypography sx={{ fontSize: "9px", color: "#01b574", fontWeight: 500 }}>
                          Normal
                        </VuiTypography>
                      </Box>
                    </Box>

                    {/* IMC Track */}
                    <Box sx={{
                      position: "relative", height: "7px", borderRadius: "7px",
                      background: "linear-gradient(90deg, #01b574 0%, #F9CF05 45%, #e31a1a 75%)",
                      overflow: "visible", my: 1,
                    }}>
                      <Box sx={{
                        position: "absolute", top: "50%",
                        left: `${imcPct(a.imc)}%`,
                        transform: "translate(-50%, -50%)",
                        width: 13, height: 13,
                        background: "#fff",
                        border: "2.5px solid #2c3e50",
                        borderRadius: "50%",
                        boxShadow: "0 2px 5px rgba(0,0,0,0.15)",
                        transition: "left 0.6s ease",
                      }} />
                    </Box>
                    <Box sx={{ display: "flex", justifyContent: "space-between", mt: "3px" }}>
                      <VuiTypography sx={{ fontSize: "9px", color: "#b4bfb4" }}>18,5</VuiTypography>
                      <VuiTypography sx={{ fontSize: "9px", color: "#b4bfb4" }}>25</VuiTypography>
                      <VuiTypography sx={{ fontSize: "9px", color: "#b4bfb4" }}>30</VuiTypography>
                    </Box>
                  </Box>

                  {/* Divider */}
                  <Box sx={{ height: "1px", background: "rgba(44,62,80,0.06)", my: "10px" }} />

                  {/* Composicao Corporal */}
                  <VuiTypography sx={{
                    fontSize: "9px", color: "#7a8c94", fontWeight: 700,
                    textTransform: "uppercase", letterSpacing: "0.06em", mb: "8px",
                  }}>
                    Composicao Corporal
                  </VuiTypography>
                  <Box sx={{ display: "flex", gap: 1, justifyContent: "center", mb: 1 }}>
                    <CompositionRing
                      value={a.gordura} max={60} color="#2c3e50"
                      label="% Gordura" delta={a.deltaGordura}
                      displayValue={a.gordura}
                    />
                    <CompositionRing
                      value={a.massaMagra - 38} max={10} color="#01b574"
                      label="Massa magra" delta={a.deltaMagra}
                      displayValue={a.massaMagra.toFixed(1)}
                      unit=" kg"
                    />
                  </Box>

                  {/* Divider */}
                  <Box sx={{ height: "1px", background: "rgba(44,62,80,0.06)", my: "10px" }} />

                  {/* Progress */}
                  <VuiTypography sx={{ fontSize: "9px", color: "#7a8c94", mb: "5px" }}>
                    Progresso rumo a meta (65 kg)
                  </VuiTypography>
                  <Box sx={{ height: 5, background: "rgba(44,62,80,0.08)", borderRadius: "5px", overflow: "hidden" }}>
                    <Box sx={{
                      height: "100%",
                      background: "linear-gradient(90deg, #2c3e50, #34495e)",
                      borderRadius: "5px",
                      width: isOpen ? `${a.progresso}%` : "0%",
                      transition: "width 1s ease",
                    }} />
                  </Box>
                  <Box sx={{ display: "flex", justifyContent: "space-between", mt: "4px" }}>
                    <VuiTypography sx={{ fontSize: "9px", color: "#7a8c94" }}>75 kg</VuiTypography>
                    <VuiTypography sx={{ fontSize: "9px", color: "#2c3e50", fontWeight: 700 }}>
                      {a.progresso}%
                    </VuiTypography>
                    <VuiTypography sx={{ fontSize: "9px", color: "#7a8c94" }}>65 kg</VuiTypography>
                  </Box>

                  {/* Total badge */}
                  <Box sx={{
                    mt: "10px", background: "rgba(44,62,80,0.05)",
                    border: "1px solid rgba(44,62,80,0.1)",
                    borderRadius: "10px", padding: "10px 12px", textAlign: "center",
                  }}>
                    <VuiTypography sx={{ fontSize: "22px", fontWeight: 800, color: "#2c3e50" }}>
                      {a.totalPerdido > 0 ? `-${a.totalPerdido.toFixed(1)} kg` : "75,0 kg"}
                    </VuiTypography>
                    <VuiTypography sx={{ fontSize: "10px", color: "#7a8c94", mt: "1px" }}>
                      {a.totalPerdido > 0 ? "perdidos desde o inicio" : "inicio do acompanhamento"}
                    </VuiTypography>
                  </Box>

                  {/* Nota */}
                  <Box sx={{ mt: "10px" }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: "4px", mb: "4px" }}>
                      <IoDocumentText size={10} color="#7a8c94" />
                      <VuiTypography sx={{
                        fontSize: "9px", color: "#7a8c94", fontWeight: 700,
                        textTransform: "uppercase", letterSpacing: "0.06em",
                      }}>
                        Obs. do nutricionista
                      </VuiTypography>
                    </Box>
                    <VuiTypography sx={{ fontSize: "10px", color: "#2c3e50", lineHeight: 1.5, fontStyle: "italic" }}>
                      {a.nota}
                    </VuiTypography>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Collapse>
      </Card>
    </Box>
  );
}

// Main Component
function EvolucaoPaciente() {
  const { gradients } = colors;
  const { cardDark } = gradients;
  const [openId, setOpenId] = useState(null);
  const [photos, setPhotos] = useState({});
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTarget, setModalTarget] = useState({ aid: null, slot: null });

  const handleToggle = (id) => {
    setOpenId(openId === id ? null : id);
  };

  const handlePhotoUpload = (aid, slot) => {
    setModalTarget({ aid, slot });
    setModalOpen(true);
  };

  const handlePhotoConfirm = (dataUrl) => {
    setPhotos((prev) => ({
      ...prev,
      [`${modalTarget.aid}-${modalTarget.slot}`]: dataUrl,
    }));
  };

  const currentAnamnese = ANAMNESES_MOCK.find((a) => a.id === modalTarget.aid);

  return (
    <Card sx={{
      background: linearGradient(cardDark.main, cardDark.state, cardDark.deg),
      overflow: "visible",
    }}>
      <VuiBox p={{ xs: "16px", md: "24px" }}>
        {/* Title */}
        <VuiBox mb={3}>
          <Box sx={{ display: "flex", alignItems: "center", gap: "10px", mb: "4px" }}>
            <Box sx={{
              width: 36, height: 36,
              background: "linear-gradient(135deg, #2c3e50, #1a252f)",
              borderRadius: "10px",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 4px 14px rgba(44,62,80,0.2)",
            }}>
              <IoTime size={18} color="#fff" />
            </Box>
            <Box>
              <VuiTypography variant="lg" color="white" fontWeight="bold" sx={{ display: "block" }}>
                Evolucao do Paciente
              </VuiTypography>
              <VuiTypography variant="caption" color="text" fontWeight="regular">
                Acompanhamento mensal de anamneses
              </VuiTypography>
            </Box>
          </Box>
        </VuiBox>

        {/* Global Charts */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} md={6}>
            <Card sx={{
              background: "#fff",
              border: "1.5px solid rgba(44,62,80,0.08)",
              borderRadius: "16px",
              padding: { xs: "14px", md: "18px 20px 14px" },
              boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
            }}>
              <VuiTypography sx={{ fontSize: "13px", fontWeight: 700, color: "#2c3e50" }}>
                Peso corporal
              </VuiTypography>
              <VuiTypography sx={{ fontSize: "11px", color: "#7a8c94", mt: "2px", mb: "12px" }}>
                kg - evolucao mes a mes
              </VuiTypography>
              <Box sx={{ height: 110 }}>
                <ReactApexChart
                  options={buildChartOptions("#2c3e50")}
                  series={[
                    { name: "Peso", data: ALL_PESO },
                    { name: "Meta", data: Array(ALL_MONTHS.length).fill(65) },
                  ]}
                  type="area"
                  width="100%"
                  height="100%"
                />
              </Box>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card sx={{
              background: "#fff",
              border: "1.5px solid rgba(44,62,80,0.08)",
              borderRadius: "16px",
              padding: { xs: "14px", md: "18px 20px 14px" },
              boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
            }}>
              <VuiTypography sx={{ fontSize: "13px", fontWeight: 700, color: "#2c3e50" }}>
                Circunferencia da cintura
              </VuiTypography>
              <VuiTypography sx={{ fontSize: "11px", color: "#7a8c94", mt: "2px", mb: "12px" }}>
                cm - evolucao mes a mes
              </VuiTypography>
              <Box sx={{ height: 110 }}>
                <ReactApexChart
                  options={buildChartOptions("#01b574")}
                  series={[
                    { name: "Cintura", data: ALL_CINTURA },
                    { name: "Meta", data: Array(ALL_MONTHS.length).fill(68) },
                  ]}
                  type="area"
                  width="100%"
                  height="100%"
                />
              </Box>
            </Card>
          </Grid>
        </Grid>

        {/* Timeline */}
        <Box sx={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          "&::before": {
            content: '""',
            position: "absolute",
            left: "22px",
            top: "24px",
            bottom: "24px",
            width: "2px",
            background: "linear-gradient(to bottom, rgba(44,62,80,0.12), #2c3e50)",
            borderRadius: "2px",
            zIndex: 0,
          },
        }}>
          {ANAMNESES_MOCK.map((anamnese) => (
            <AnamnesesItem
              key={anamnese.id}
              anamnese={anamnese}
              isOpen={openId === anamnese.id}
              onToggle={() => handleToggle(anamnese.id)}
              photos={photos}
              onPhotoUpload={handlePhotoUpload}
            />
          ))}
        </Box>
      </VuiBox>

      {/* Upload Modal */}
      <UploadModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={modalTarget.slot !== null ? PHOTO_LABELS[modalTarget.slot] : "Foto"}
        subtitle={
          currentAnamnese
            ? `${currentAnamnese.mes} ${currentAnamnese.ano} - ${PHOTO_LABELS[modalTarget.slot] || ""}`
            : "Selecione a imagem."
        }
        onConfirm={handlePhotoConfirm}
      />
    </Card>
  );
}

export default EvolucaoPaciente;
