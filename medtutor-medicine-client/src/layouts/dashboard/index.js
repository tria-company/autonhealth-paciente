/*!

=========================================================
* Vision UI Free React - v1.0.0
=========================================================

* Product Page: https://www.creative-tim.com/product/vision-ui-free-react
* Copyright 2021 Creative Tim (https://www.creative-tim.com/)
* Licensed under MIT (https://github.com/creativetimofficial/vision-ui-free-react/blob/master LICENSE.md)

* Design and Coded by Simmmple & Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/

// @mui material components
import Grid from "@mui/material/Grid";
import Icon from "@mui/material/Icon";
import { Card, LinearProgress, Stack } from "@mui/material";

// Vision UI Dashboard React components
import VuiBox from "components/VuiBox";
import VuiTypography from "components/VuiTypography";
import VuiProgress from "components/VuiProgress";

// Vision UI Dashboard React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import MiniStatisticsCard from "examples/Cards/StatisticsCards/MiniStatisticsCard";
import linearGradient from "assets/theme/functions/linearGradient";

// Vision UI Dashboard React base styles
import typography from "assets/theme/base/typography";
import colors from "assets/theme/base/colors";

// Dashboard layout components
import WelcomeMark from "layouts/dashboard/components/WelcomeMark";
import Projects from "layouts/dashboard/components/Projects";
import OrderOverview from "layouts/dashboard/components/OrderOverview";
import IdadeBiologica from "layouts/dashboard/components/IdadeBiologica";
import ReferralTracking from "layouts/dashboard/components/ReferralTracking";

// React icons
import { IoIosRocket } from "react-icons/io";
import { IoGlobe, IoBuild, IoWallet, IoWater, IoMoon, IoChatbubbleEllipses, IoHappy } from "react-icons/io5";
import { IoDocumentText } from "react-icons/io5";
import { FaShoppingCart } from "react-icons/fa";

// Data
import LineChart from "examples/Charts/LineCharts/LineChart";
import BarChart from "examples/Charts/BarCharts/BarChart";
import { lineChartDataDashboard } from "layouts/dashboard/data/lineChartData";
import { lineChartOptionsDashboard } from "layouts/dashboard/data/lineChartOptions";
import EquilibrioGeralWidget from "layouts/dashboard/components/EquilibrioGeralWidget";
import { barChartDataDashboard } from "layouts/dashboard/data/barChartData";
import { barChartOptionsDashboard } from "layouts/dashboard/data/barChartOptions";

function Dashboard() {
  const { gradients } = colors;
  const { cardContent } = gradients;

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <VuiBox pt={3} pb={6}>
        <VuiBox mb={3}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} xl={3}>
              <MiniStatisticsCard
                title={{ text: "Equilíbrio Geral", fontWeight: "regular" }}
                count="8.7/10"
                percentage={{ color: "success", text: "+15%" }}
                icon={{ color: "info", component: <IoChatbubbleEllipses size="22px" color="white" /> }}
              />
            </Grid>
            <Grid item xs={12} md={6} xl={3}>
              <MiniStatisticsCard
                title={{ text: "Qualidade do sono" }}
                count="7h:10min"
                percentage={{ color: "success", text: "+20min" }}
                icon={{ color: "info", component: <IoMoon size="22px" color="white" /> }}
              />
            </Grid>
            <Grid item xs={12} md={6} xl={3}>
              <MiniStatisticsCard
                title={{ text: "Hidratação" }}
                count="1.8 L / 2.4 L"
                percentage={{ color: "error", text: "" }}
                icon={{ color: "info", component: <IoWater size="22px" color="white" /> }}
              />
            </Grid>
            <Grid item xs={12} md={6} xl={3}>
              <MiniStatisticsCard
                title={{ text: "Mental & Energia" }}
                count="9.3 / 10"
                percentage={{ color: "success", text: "+8%" }}
                icon={{ color: "info", component: <IoHappy size="22px" color="white" /> }}
              />
            </Grid>
          </Grid>
        </VuiBox>
        <VuiBox mb={3}>
          <Grid container spacing="18px">
            <Grid item xs={12} lg={12} xl={5}>
              <WelcomeMark />
            </Grid>
            <Grid item xs={12} lg={6} xl={3}>
              <IdadeBiologica />
            </Grid>
            <Grid item xs={12} lg={6} xl={4}>
              <ReferralTracking />
            </Grid>
          </Grid>
        </VuiBox>
        <VuiBox mb={3}>
          <Card>
            <VuiBox p="24px">
              <VuiTypography variant="lg" color="white" fontWeight="bold" mb="4px" component="div" sx={{ display: 'block' }}>
                Equilíbrio Integrativo
              </VuiTypography>
              <VuiTypography variant="button" color="text" fontWeight="regular" mb="24px" component="div" sx={{ display: 'block' }}>
                Avaliação geral do paciente nos últimos 7 dias
              </VuiTypography>
              <Grid container spacing={3} alignItems="stretch">
                <Grid item xs={12} xl={5}>
                  <Grid container spacing={3}>
                    {[1,2,3,4,5,6].map((i) => (
                      <Grid key={i} item xs={12} sm={6}>
                        <Card sx={{
                          height: 90,
                          borderRadius: '20px',
                          background: linearGradient(
                            cardContent.main,
                            cardContent.state,
                            cardContent.deg
                          ),
                        }}>
                          <VuiBox p="14px" sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                            <VuiTypography color="text" variant="button" fontWeight="regular" mb="4px" sx={{ display: 'block' }}>
                              Físico
                            </VuiTypography>
                            <VuiTypography color="white" variant="lg" fontWeight="bold" sx={{ display: 'block' }}>
                              8.6
                            </VuiTypography>
                          </VuiBox>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </Grid>
                <Grid item xs={12} xl={3}>
                  <EquilibrioGeralWidget value={8.9} />
                </Grid>
                <Grid item xs={12} xl={4}>
                  <Card sx={{ height: 340 }}>
                    <VuiBox sx={{ height: '100%', display: 'flex', alignItems: 'center' }}>
                      <VuiBox sx={{ height: 300, width: '100%' }}>
                        <LineChart
                          lineChartData={lineChartDataDashboard}
                          lineChartOptions={lineChartOptionsDashboard}
                        />
                      </VuiBox>
                    </VuiBox>
                  </Card>
                </Grid>
              </Grid>
            </VuiBox>
          </Card>
        </VuiBox>
        {/* Removed Projects and Orders overview section as requested */}
      </VuiBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Dashboard;
