import React from "react";
import GroupInfo from "../components/Groups/GroupInfo";
import { routesObj } from "../common/constants";

const Groups = React.lazy(() => import("../components/Groups"));
const Members = React.lazy(() => import("../components/Members"));
const User = React.lazy(() => import("../components/User"));
const Auth = React.lazy(() => import("../components/Auth"));
const GroupForm = React.lazy(() => import("../components/Groups/Form"));
const MemberForm = React.lazy(() => import("../components/Members/Form"));

const routes = [
  {
    path: routesObj.auth,
    component: Auth,
    requiresAuth: false,
    exact: false,
  },
  {
    path: routesObj.home,
    component: Groups,
    requiresAuth: true,
    exact: true,
  },
  {
    path: routesObj.groupId,
    component: GroupInfo,
    requiresAuth: true,
    exact: true,
  },
  {
    path: routesObj.groupAdd,
    component: GroupForm,
    requiresAuth: true,
    exact: true,
  },
  {
    path: routesObj.members,
    component: Members,
    requiresAuth: true,
    exact: true,
  },
  {
    path: routesObj.membersAdd,
    component: MemberForm,
    requiresAuth: true,
    exact: true,
  },
  {
    path: routesObj.me,
    component: User,
    requiresAuth: true,
    exact: true,
  },
];

export default routes;
