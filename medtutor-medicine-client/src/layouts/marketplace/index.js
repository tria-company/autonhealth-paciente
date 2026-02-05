import React, { useState } from "react";
import Grid from "@mui/material/Grid";
import {
  Card,
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  Select,
  MenuItem,
  FormControl,
  Pagination,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
} from "@mui/material";
import VuiBox from "components/VuiBox";
import VuiTypography from "components/VuiTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import colors from "assets/theme/base/colors";
import linearGradient from "assets/theme/functions/linearGradient";
import { IoCart, IoLeaf, IoChevronDown } from "react-icons/io5";

const Marketplace = () => {
  const { gradients } = colors;
  const { cardContent } = gradients;
  const [expandedFilters, setExpandedFilters] = useState({
    marca: true,
    categoria: true,
    preco: true,
  });
  const [precoMin, setPrecoMin] = useState("");
  const [precoMax, setPrecoMax] = useState("");
  const [itensPorPagina, setItensPorPagina] = useState(48);
  const [ordenacao, setOrdenacao] = useState("mais-vendidos");
  const [paginaAtual, setPaginaAtual] = useState(1);

  // Dados de exemplo - Suplementos e Fitoterápicos
  const produtos = [
    {
      id: 1,
      nome: "Whey Protein Concentrado 900g Growth Supplements",
      marca: "Growth Supplements",
      categoria: "Proteínas",
      quantidade: "900g",
      preco: 89.90,
      precoOriginal: 129.90,
      desconto: 31,
      imagem: "https://via.placeholder.com/200x200/2E72AC/FFFFFF?text=Whey+Protein",
      quantidadeEstoque: "30 Unidades",
    },
    {
      id: 2,
      nome: "Creatina Monohidratada 300g Universal Nutrition",
      marca: "Universal Nutrition",
      categoria: "Performance",
      quantidade: "300g",
      preco: 45.90,
      precoOriginal: 69.90,
      desconto: 34,
      imagem: "https://via.placeholder.com/200x200/2E72AC/FFFFFF?text=Creatina",
      quantidadeEstoque: "15 Unidades",
    },
    {
      id: 3,
      nome: "Ômega 3 1000mg 120 Cápsulas Sundown Naturals",
      marca: "Sundown Naturals",
      categoria: "Vitaminas",
      quantidade: "120 Cápsulas",
      preco: 59.90,
      precoOriginal: 89.90,
      desconto: 33,
      imagem: "https://via.placeholder.com/200x200/2E72AC/FFFFFF?text=Ômega+3",
      quantidadeEstoque: "25 Unidades",
    },
    {
      id: 4,
      nome: "Vitamina D3 2000UI 120 Cápsulas Addera",
      marca: "Addera",
      categoria: "Vitaminas",
      quantidade: "120 Cápsulas",
      preco: 34.90,
      precoOriginal: 49.90,
      desconto: 30,
      imagem: "https://via.placeholder.com/200x200/2E72AC/FFFFFF?text=Vit+D3",
      quantidadeEstoque: "40 Unidades",
    },
    {
      id: 5,
      nome: "Multivitamínico Centrum 90 Comprimidos",
      marca: "Centrum",
      categoria: "Vitaminas",
      quantidade: "90 Comprimidos",
      preco: 79.90,
      precoOriginal: 119.90,
      desconto: 33,
      imagem: "https://via.placeholder.com/200x200/2E72AC/FFFFFF?text=Centrum",
      quantidadeEstoque: "20 Unidades",
    },
    {
      id: 6,
      nome: "BCAA 2:1:1 300g Max Titanium",
      marca: "Max Titanium",
      categoria: "Aminoácidos",
      quantidade: "300g",
      preco: 52.90,
      precoOriginal: 79.90,
      desconto: 34,
      imagem: "https://via.placeholder.com/200x200/2E72AC/FFFFFF?text=BCAA",
      quantidadeEstoque: "18 Unidades",
    },
    {
      id: 7,
      nome: "Ginseng Coreano 500mg 60 Cápsulas Herbarium",
      marca: "Herbarium",
      categoria: "Fitoterápicos",
      quantidade: "60 Cápsulas",
      preco: 64.90,
      precoOriginal: 94.90,
      desconto: 32,
      imagem: "https://via.placeholder.com/200x200/2E72AC/FFFFFF?text=Ginseng",
      quantidadeEstoque: "12 Unidades",
    },
    {
      id: 8,
      nome: "Extrato de Chá Verde 500mg 60 Cápsulas Natue",
      marca: "Natue",
      categoria: "Fitoterápicos",
      quantidade: "60 Cápsulas",
      preco: 39.90,
      precoOriginal: 59.90,
      desconto: 33,
      imagem: "https://via.placeholder.com/200x200/2E72AC/FFFFFF?text=Chá+Verde",
      quantidadeEstoque: "28 Unidades",
    },
    {
      id: 9,
      nome: "Colágeno Hidrolisado 300g Sanavita",
      marca: "Sanavita",
      categoria: "Beleza",
      quantidade: "300g",
      preco: 69.90,
      precoOriginal: 99.90,
      desconto: 30,
      imagem: "https://via.placeholder.com/200x200/2E72AC/FFFFFF?text=Colágeno",
      quantidadeEstoque: "22 Unidades",
    },
    {
      id: 10,
      nome: "Magnésio Dimalato 500mg 120 Cápsulas NutriGold",
      marca: "NutriGold",
      categoria: "Minerais",
      quantidade: "120 Cápsulas",
      preco: 54.90,
      precoOriginal: 79.90,
      desconto: 31,
      imagem: "https://via.placeholder.com/200x200/2E72AC/FFFFFF?text=Magnésio",
      quantidadeEstoque: "16 Unidades",
    },
    {
      id: 11,
      nome: "Ashwagandha 450mg 60 Cápsulas Now Foods",
      marca: "Now Foods",
      categoria: "Fitoterápicos",
      quantidade: "60 Cápsulas",
      preco: 74.90,
      precoOriginal: 109.90,
      desconto: 32,
      imagem: "https://via.placeholder.com/200x200/2E72AC/FFFFFF?text=Ashwagandha",
      quantidadeEstoque: "14 Unidades",
    },
    {
      id: 12,
      nome: "ZMA (Zinco + Magnésio) 90 Cápsulas Universal",
      marca: "Universal Nutrition",
      categoria: "Minerais",
      quantidade: "90 Cápsulas",
      preco: 89.90,
      precoOriginal: 129.90,
      desconto: 31,
      imagem: "https://via.placeholder.com/200x200/2E72AC/FFFFFF?text=ZMA",
      quantidadeEstoque: "10 Unidades",
    },
  ];

  const marcas = [
    { nome: "Growth Supplements", quantidade: 15 },
    { nome: "Universal Nutrition", quantidade: 8 },
    { nome: "Max Titanium", quantidade: 12 },
    { nome: "Addera", quantidade: 6 },
    { nome: "Centrum", quantidade: 4 },
    { nome: "Herbarium", quantidade: 9 },
    { nome: "NutriGold", quantidade: 7 },
    { nome: "Now Foods", quantidade: 5 },
  ];

  const categorias = [
    { nome: "Proteínas", quantidade: 25 },
    { nome: "Aminoácidos", quantidade: 18 },
    { nome: "Vitaminas", quantidade: 32 },
    { nome: "Minerais", quantidade: 15 },
    { nome: "Fitoterápicos", quantidade: 28 },
    { nome: "Performance", quantidade: 22 },
    { nome: "Beleza", quantidade: 14 },
  ];

  const handleFilterChange = (filter) => (event, isExpanded) => {
    setExpandedFilters({
      ...expandedFilters,
      [filter]: isExpanded,
    });
  };

  const formatarPreco = (valor) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(valor);
  };

  const calcularPrecoUnidade = (preco, quantidade) => {
    // Simulação de preço por unidade
    return formatarPreco(preco);
  };

  const calcularPrecoDuasUnidades = (preco) => {
    const desconto = preco * 0.15; // 15% de desconto na compra de 2 unidades
    return formatarPreco(preco - desconto);
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <VuiBox pt={3} pb={6}>
        {/* Header */}
        <VuiBox mb={4}>
          <VuiBox display="flex" alignItems="center" mb={2}>
            <IoLeaf size={40} color="#FF3838" style={{ marginRight: 16 }} />
            <VuiTypography variant="h3" color="white" fontWeight="bold">
              Suplementos e Fitoterápicos
            </VuiTypography>
          </VuiBox>
          <VuiTypography variant="body1" color="text" fontWeight="regular" sx={{ lineHeight: 1.8, mb: 3 }}>
            Encontre os melhores suplementos e fitoterápicos para sua saúde e performance. Produtos selecionados
            com qualidade garantida, entrega rápida e preços competitivos. Compre com confiança e tenha bem-estar
            ao seu alcance!
          </VuiTypography>
          <VuiBox display="flex" alignItems="center" justifyContent="space-between" flexWrap="wrap" gap={2}>
            <VuiTypography variant="h6" color="text" fontWeight="medium">
              {produtos.length} PRODUTOS ENCONTRADOS
            </VuiTypography>
            <VuiBox display="flex" alignItems="center" gap={2} flexWrap="wrap">
              <VuiBox display="flex" alignItems="center" gap={1}>
                <VuiTypography variant="button" color="text" fontWeight="regular">
                  ITENS POR PÁGINA:
                </VuiTypography>
                <FormControl size="small" sx={{ minWidth: 80 }}>
                  <Select
                    value={itensPorPagina}
                    onChange={(e) => setItensPorPagina(e.target.value)}
                    sx={{
                      color: "white",
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: "rgba(255, 255, 255, 0.3)",
                      },
                      "& .MuiSvgIcon-root": {
                        color: "white",
                      },
                    }}
                  >
                    <MenuItem value={24}>24</MenuItem>
                    <MenuItem value={48}>48</MenuItem>
                    <MenuItem value={72}>72</MenuItem>
                  </Select>
                </FormControl>
              </VuiBox>
              <VuiBox display="flex" alignItems="center" gap={1}>
                <VuiTypography variant="button" color="text" fontWeight="regular">
                  Ordenar por:
                </VuiTypography>
                <FormControl size="small" sx={{ minWidth: 150 }}>
                  <Select
                    value={ordenacao}
                    onChange={(e) => setOrdenacao(e.target.value)}
                    sx={{
                      color: "white",
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: "rgba(255, 255, 255, 0.3)",
                      },
                      "& .MuiSvgIcon-root": {
                        color: "white",
                      },
                    }}
                  >
                    <MenuItem value="mais-vendidos">Mais Vendidos</MenuItem>
                    <MenuItem value="menor-preco">Menor Preço</MenuItem>
                    <MenuItem value="maior-preco">Maior Preço</MenuItem>
                    <MenuItem value="nome-az">Nome A-Z</MenuItem>
                    <MenuItem value="nome-za">Nome Z-A</MenuItem>
                  </Select>
                </FormControl>
              </VuiBox>
            </VuiBox>
          </VuiBox>
        </VuiBox>

        <Grid container spacing={3}>
          {/* Filtros - Coluna Esquerda */}
          <Grid item xs={12} md={3}>
            <Card
              sx={{
                borderRadius: "20px",
                background: linearGradient(cardContent.main, cardContent.state, cardContent.deg),
                p: 2,
                position: "sticky",
                top: 20,
              }}
            >
              <VuiTypography variant="h6" color="white" fontWeight="bold" mb={2}>
                Filtros
              </VuiTypography>

              {/* Filtro Marca */}
              <Accordion
                expanded={expandedFilters.marca}
                onChange={handleFilterChange("marca")}
                sx={{
                  background: "transparent",
                  boxShadow: "none",
                  mb: 1,
                  "&:before": { display: "none" },
                }}
              >
                <AccordionSummary
                  expandIcon={<IoChevronDown size={20} color="white" />}
                  sx={{ px: 0, minHeight: "auto" }}
                >
                  <VuiTypography variant="button" color="white" fontWeight="bold">
                    Marca
                  </VuiTypography>
                </AccordionSummary>
                <AccordionDetails sx={{ px: 0, pt: 0 }}>
                  <VuiBox maxHeight="200px" sx={{ overflowY: "auto", pl: 1.5 }}>
                    {marcas.map((marca, index) => (
                      <FormControlLabel
                        key={index}
                        control={
                          <Checkbox
                            size="small"
                            sx={{
                              color: "rgba(255, 255, 255, 0.5)",
                              "&.Mui-checked": {
                                color: "#2c3e50",
                              },
                            }}
                          />
                        }
                        label={
                          <VuiTypography variant="body2" color="text" fontWeight="regular">
                            {marca.nome} [{marca.quantidade}]
                          </VuiTypography>
                        }
                        sx={{
                          display: "block",
                          mb: 0.5,
                          "& .MuiFormControlLabel-label": {
                            marginLeft: "8px",
                          },
                        }}
                      />
                    ))}
                  </VuiBox>
                  <VuiTypography
                    variant="caption"
                    color="info"
                    fontWeight="medium"
                    sx={{ cursor: "pointer", mt: 1, display: "block" }}
                  >
                    ver mais
                  </VuiTypography>
                </AccordionDetails>
              </Accordion>

              <Divider sx={{ my: 2, borderColor: "rgba(255, 255, 255, 0.1)" }} />

              {/* Filtro Categoria */}
              <Accordion
                expanded={expandedFilters.categoria}
                onChange={handleFilterChange("categoria")}
                sx={{
                  background: "transparent",
                  boxShadow: "none",
                  mb: 1,
                  "&:before": { display: "none" },
                }}
              >
                <AccordionSummary
                  expandIcon={<IoChevronDown size={20} color="white" />}
                  sx={{ px: 0, minHeight: "auto" }}
                >
                  <VuiTypography variant="button" color="white" fontWeight="bold">
                    Categoria
                  </VuiTypography>
                </AccordionSummary>
                <AccordionDetails sx={{ px: 0, pt: 0 }}>
                  <VuiBox maxHeight="200px" sx={{ overflowY: "auto", pl: 1.5 }}>
                    {categorias.map((categoria, index) => (
                      <FormControlLabel
                        key={index}
                        control={
                          <Checkbox
                            size="small"
                            sx={{
                              color: "rgba(255, 255, 255, 0.5)",
                              "&.Mui-checked": {
                                color: "#2c3e50",
                              },
                            }}
                          />
                        }
                        label={
                          <VuiTypography variant="body2" color="text" fontWeight="regular">
                            {categoria.nome} [{categoria.quantidade}]
                          </VuiTypography>
                        }
                        sx={{
                          display: "block",
                          mb: 0.5,
                          "& .MuiFormControlLabel-label": {
                            marginLeft: "8px",
                          },
                        }}
                      />
                    ))}
                  </VuiBox>
                </AccordionDetails>
              </Accordion>

              <Divider sx={{ my: 2, borderColor: "rgba(255, 255, 255, 0.1)" }} />

              {/* Filtro Preço */}
              <Accordion
                expanded={expandedFilters.preco}
                onChange={handleFilterChange("preco")}
                sx={{
                  background: "transparent",
                  boxShadow: "none",
                  mb: 1,
                  "&:before": { display: "none" },
                }}
              >
                <AccordionSummary
                  expandIcon={<IoChevronDown size={20} color="white" />}
                  sx={{ px: 0, minHeight: "auto" }}
                >
                  <VuiTypography variant="button" color="white" fontWeight="bold">
                    Preço
                  </VuiTypography>
                </AccordionSummary>
                <AccordionDetails sx={{ px: 0, pt: 0 }}>
                  <VuiBox display="flex" flexDirection="column" gap={2}>
                    <TextField
                      size="small"
                      label="Mínimo"
                      value={precoMin}
                      onChange={(e) => setPrecoMin(e.target.value)}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      fullWidth
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          color: "white",
                          backgroundColor: "rgba(255, 255, 255, 0.05)",
                          marginTop: "20px",
                          "& fieldset": {
                            borderColor: "rgba(255, 255, 255, 0.3)",
                          },
                          "&:hover fieldset": {
                            borderColor: "rgba(255, 255, 255, 0.5)",
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: "#2c3e50",
                          },
                        },
                        "& .MuiInputLabel-root": {
                          color: "rgba(255, 255, 255, 0.7) !important",
                          transform: "translate(14px, 0px) scale(0.75) !important",
                          top: "0px",
                          "&.Mui-focused": {
                            color: "#2c3e50 !important",
                          },
                        },
                        "& .MuiInputBase-input": {
                          color: "white",
                          padding: "10px 14px",
                        },
                      }}
                    />
                    <TextField
                      size="small"
                      label="Máximo"
                      value={precoMax}
                      onChange={(e) => setPrecoMax(e.target.value)}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      fullWidth
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          color: "white",
                          backgroundColor: "rgba(255, 255, 255, 0.05)",
                          marginTop: "20px",
                          "& fieldset": {
                            borderColor: "rgba(255, 255, 255, 0.3)",
                          },
                          "&:hover fieldset": {
                            borderColor: "rgba(255, 255, 255, 0.5)",
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: "#2c3e50",
                          },
                        },
                        "& .MuiInputLabel-root": {
                          color: "rgba(255, 255, 255, 0.7) !important",
                          transform: "translate(14px, 0px) scale(0.75) !important",
                          top: "0px",
                          "&.Mui-focused": {
                            color: "#2c3e50 !important",
                          },
                        },
                        "& .MuiInputBase-input": {
                          color: "white",
                          padding: "10px 14px",
                        },
                      }}
                    />
                    <VuiBox mt={3}>
                      <Button
                        variant="contained"
                        fullWidth
                        sx={{
                          background: linearGradient(
                            gradients.info.main,
                            gradients.info.state,
                            gradients.info.deg
                          ),
                          color: "white",
                          "&:hover": {
                            background: linearGradient(
                              gradients.info.main,
                              gradients.info.state,
                              gradients.info.deg
                            ),
                            opacity: 0.9,
                          },
                        }}
                      >
                        Aplicar
                      </Button>
                    </VuiBox>
                  </VuiBox>
                </AccordionDetails>
              </Accordion>
            </Card>
          </Grid>

          {/* Produtos - Coluna Direita */}
          <Grid item xs={12} md={9}>
            <Grid container spacing={2}>
              {produtos.map((produto) => (
                <Grid item xs={12} sm={6} lg={4} key={produto.id}>
                  <Card
                    sx={{
                      borderRadius: "15px",
                      background: linearGradient(cardContent.main, cardContent.state, cardContent.deg),
                      p: 2,
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      transition: "transform 0.2s ease",
                      "&:hover": {
                        transform: "translateY(-4px)",
                        boxShadow: "0 8px 16px rgba(0, 0, 0, 0.3)",
                      },
                    }}
                  >
                    {/* Badge de Desconto */}
                    {produto.desconto > 0 && (
                      <Chip
                        label={`-${produto.desconto}%`}
                        size="small"
                        sx={{
                          position: "absolute",
                          top: 12,
                          right: 12,
                          background: "#FF3838",
                          color: "white",
                          fontWeight: "bold",
                          fontSize: "0.75rem",
                          zIndex: 1,
                        }}
                      />
                    )}

                    {/* Imagem do Produto */}
                    <VuiBox
                      component="img"
                      src={produto.imagem}
                      alt={produto.nome}
                      sx={{
                        width: "100%",
                        height: "200px",
                        objectFit: "contain",
                        mb: 2,
                        borderRadius: "12px",
                        background: "rgba(255, 255, 255, 0.05)",
                        p: 1,
                      }}
                    />

                    {/* Informações do Produto */}
                    <VuiBox flex={1} display="flex" flexDirection="column">
                      <VuiTypography variant="caption" color="info" fontWeight="medium" mb={0.5}>
                        {produto.marca}
                      </VuiTypography>
                      <VuiTypography
                        variant="body2"
                        color="white"
                        fontWeight="medium"
                        mb={1}
                        sx={{
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                          minHeight: "40px",
                        }}
                      >
                        {produto.nome}
                      </VuiTypography>
                      <VuiTypography variant="caption" color="text" fontWeight="regular" mb={2}>
                        {produto.quantidade}
                      </VuiTypography>

                      {/* Preços */}
                      <VuiBox mb={2}>
                        {produto.precoOriginal && (
                          <VuiTypography
                            variant="caption"
                            color="text"
                            fontWeight="regular"
                            sx={{ textDecoration: "line-through", display: "block", mb: 0.5 }}
                          >
                            {formatarPreco(produto.precoOriginal)}
                          </VuiTypography>
                        )}
                        <VuiTypography variant="h6" color="white" fontWeight="bold" mb={1}>
                          {formatarPreco(produto.preco)}
                        </VuiTypography>
                        <VuiTypography variant="caption" color="text" fontWeight="regular">
                          2 Un. {calcularPrecoDuasUnidades(produto.preco)} cada
                        </VuiTypography>
                      </VuiBox>

                      {/* Botão de Adicionar ao Carrinho */}
                      <Button
                        variant="contained"
                        fullWidth
                        startIcon={<IoCart size={18} />}
                        sx={{
                          background: linearGradient(
                            gradients.info.main,
                            gradients.info.state,
                            gradients.info.deg
                          ),
                          color: "white",
                          mt: "auto",
                          "&:hover": {
                            background: linearGradient(
                              gradients.info.main,
                              gradients.info.state,
                              gradients.info.deg
                            ),
                            opacity: 0.9,
                          },
                        }}
                      >
                        Adicionar ao Carrinho
                      </Button>
                    </VuiBox>
                  </Card>
                </Grid>
              ))}
            </Grid>

            {/* Paginação */}
            <VuiBox display="flex" justifyContent="center" alignItems="center" mt={4} gap={2}>
              <Pagination
                count={Math.ceil(produtos.length / itensPorPagina)}
                page={paginaAtual}
                onChange={(event, value) => setPaginaAtual(value)}
                color="primary"
                sx={{
                  "& .MuiPaginationItem-root": {
                    color: "white",
                    "&.Mui-selected": {
                      background: "#2c3e50",
                      color: "white",
                    },
                  },
                }}
              />
              <VuiTypography variant="body2" color="text" fontWeight="regular">
                próximo
              </VuiTypography>
            </VuiBox>
          </Grid>
        </Grid>
      </VuiBox>
      <Footer />
    </DashboardLayout>
  );
};

export default Marketplace;

