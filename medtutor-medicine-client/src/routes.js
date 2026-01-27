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

/** 
  All of the routes for the Vision UI Dashboard React are added here,
  You can add a new route, customize the routes and delete the routes here.

  Once you add a new route on this file it will be visible automatically on
  the Sidenav.

  For adding a new route you can follow the existing routes in the routes array.
  1. The `type` key with the `collapse` value is used for a route.
  2. The `type` key with the `title` value is used for a title inside the Sidenav. 
  3. The `type` key with the `divider` value is used for a divider between Sidenav items.
  4. The `name` key is used for the name of the route on the Sidenav.
  5. The `key` key is used for the key of the route (It will help you with the key prop inside a loop).
  6. The `icon` key is used for the icon of the route on the Sidenav, you have to add a node.
  7. The `collapse` key is used for making a collapsible item on the Sidenav that has other routes
  inside (nested routes), you need to pass the nested routes inside an array as a value for the `collapse` key.
  8. The `route` key is used to store the route location which is used for the react router.
  9. The `href` key is used to store the external links location.
  10. The `title` key is only for the item with the type of `title` and its used for the title text on the Sidenav.
  10. The `component` key is used to store the component of its route.
*/

// Vision UI Dashboard React layouts
import Dashboard from "layouts/dashboard";
import Alimentacao from "layouts/alimentacao";
import ExercicioFisico from "layouts/exercicio-fisico";
import SuplementosFitoterapicos from "layouts/suplementos-fitoterapicos";
import CheckinDiarios from "layouts/checkin-diarios";
import Educacional from "layouts/educacional";
import MentalidadeEspiritualidade from "layouts/mentalidade-espiritualidade";
import Marketplace from "layouts/marketplace";
import Perfil from "layouts/perfil";

// Vision UI Dashboard React icons
import { IoHome, IoBook, IoCart, IoHeart, IoRestaurant, IoFitness, IoLeaf, IoMoon, IoPerson } from "react-icons/io5";
import { GiSelfLove } from "react-icons/gi";

const routes = [
  {
    type: "collapse",
    name: "Inícioo",
    key: "dashboard",
    route: "/dashboard",
    icon: <IoHome size="15px" color="inherit" />,
    component: Dashboard,
    noCollapse: true,
  },
  {
    type: "collapse",
    name: "Estilo de Vida",
    key: "lifestyle",
    icon: <GiSelfLove size="15px" color="inherit" />,
    collapse: [
      {
        name: "Livro da Vida",
        key: "livro-da-vida",
        route: "/lifestyle/livro-da-vida",
        icon: <GiSelfLove size="15px" color="inherit" />,
        component: MentalidadeEspiritualidade,
        noCollapse: true,
      },
      {
        name: "Alimentação",
        key: "alimentacao",
        route: "/lifestyle/alimentacao",
        icon: <IoRestaurant size="15px" color="inherit" />,
        component: Alimentacao,
        noCollapse: true,
      },
      {
        name: "Exercício Físico",
        key: "exercicio-fisico",
        route: "/lifestyle/exercicio-fisico",
        icon: <IoFitness size="15px" color="inherit" />,
        component: ExercicioFisico,
        noCollapse: true,
      },
      {
        name: "Suplementos e Fitoterápicos",
        key: "suplementos-fitoterapicos",
        route: "/lifestyle/suplementos-fitoterapicos",
        icon: <IoLeaf size="15px" color="inherit" />,
        component: SuplementosFitoterapicos,
        noCollapse: true,
      },
    ],
  },
  {
    type: "collapse",
    name: "Check-in Diários",
    key: "checkin-diarios",
    route: "/checkin-diarios",
    icon: <IoBook size="15px" color="inherit" />,
    component: CheckinDiarios,
    noCollapse: true,
  },
  // Rota oculta - não aparece no menu, mas é acessível via URL
  {
    key: "perfil",
    route: "/perfil",
    component: Perfil,
    noCollapse: true,
  },
  // {
  //   type: "collapse",
  //   name: "Educacional",
  //   key: "educacional",
  //   route: "/educacional",
  //   icon: <IoBook size="15px" color="inherit" />,
  //   component: Educacional,
  //   noCollapse: true,
  // },
  // {
  //   type: "collapse",
  //   name: "Marketplace",
  //   key: "marketplace",
  //   route: "/marketplace",
  //   icon: <IoCart size="15px" color="inherit" />,
  //   component: Marketplace,
  //   noCollapse: true,
  // },
];

export default routes;
