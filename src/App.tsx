import { Suspense, lazy, type ReactElement } from "react";
import {
  BrowserRouter,
  Link,
  Outlet,
  Route,
  Routes,
  useParams,
} from "react-router-dom";

import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { MonitoringSelector } from "@/features/monitoring/components/MonitoringSelector";
import { OrderMonitoringDashboard } from "@/features/monitoring/OrderMonitoringDashboard";
const FALLBACK_TITLE = "Carregando modulo";
const FALLBACK_DESCRIPTION = "Preparando a tela solicitada.";

const PedidoListPage = lazy(
  () => import("@/features/management/pedidos/PedidoListPage"),
);
const PedidoCreatePage = lazy(
  () => import("@/features/management/pedidos/PedidoCreatePage"),
);
const DroneListPage = lazy(
  () => import("@/features/management/drones/DroneListPage"),
);

function getPedidoIdParamValue(pedidoIdParam: string | undefined): number {
  if (pedidoIdParam === undefined) {
    return 0;
  }

  const parsedPedidoId = Number(pedidoIdParam);

  if (!Number.isInteger(parsedPedidoId) || parsedPedidoId <= 0) {
    return 0;
  }

  return parsedPedidoId;
}

function RouteFallback(): ReactElement {
  return (
    <div className="flex min-h-[calc(100dvh-56px)] items-center justify-center p-6">
      <div className="flex max-w-md flex-col gap-3 rounded-xl border border-border bg-card p-6 text-center">
        <h2 className="text-lg font-semibold text-foreground">
          {FALLBACK_TITLE}
        </h2>
        <p className="text-sm text-muted-foreground">{FALLBACK_DESCRIPTION}</p>
      </div>
    </div>
  );
}

function LazyRouteOutlet(): ReactElement {
  return (
    <Suspense fallback={<RouteFallback />}>
      <Outlet />
    </Suspense>
  );
}

function MonitoringRoute(): ReactElement {
  const { pedidoId } = useParams<{ pedidoId?: string }>();
  const resolvedPedidoId = getPedidoIdParamValue(pedidoId);

  if (resolvedPedidoId === 0) {
    return <MonitoringSelector />;
  }

  return <OrderMonitoringDashboard pedidoId={resolvedPedidoId} />;
}

function NotFoundRoute(): ReactElement {
  return (
    <div className="flex min-h-[calc(100dvh-56px)] items-center justify-center p-6">
      <div className="flex max-w-md flex-col gap-4 rounded-xl border border-border bg-card p-6 text-center">
        <h2 className="text-lg font-semibold text-foreground">
          Rota nao encontrada
        </h2>
        <p className="text-sm text-muted-foreground">
          A URL informada nao corresponde a nenhuma tela do DronePharm.
        </p>
        <Button asChild>
          <Link to="/monitoramento">Ir para monitoramento</Link>
        </Button>
      </div>
    </div>
  );
}

export default function App(): ReactElement {
  return (
    <div className="dark min-h-dvh bg-background text-foreground">
      <BrowserRouter>
        <Routes>
          <Route element={<MainLayout />}>
            <Route index element={<MonitoringRoute />} />
            <Route path="monitoramento/:pedidoId?" element={<MonitoringRoute />} />

            <Route element={<LazyRouteOutlet />}>
              <Route path="pedidos" element={<PedidoListPage />} />
              <Route path="pedidos/novo" element={<PedidoCreatePage />} />
              <Route path="drones" element={<DroneListPage />} />
            </Route>

            <Route path="*" element={<NotFoundRoute />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}
