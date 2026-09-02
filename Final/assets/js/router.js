const routes = {
    quotes: { path: "", html: "./views/quotes.html" },
    categories: { path: "categories", html: "./views/categories.html", js: "./pages/categories.js" },
    products: { path: "products", html: "./views/products.html", js: "./pages/products.js" },
    users: { path: "users", html: "./views/users/users.html", js: "./pages/users/users.js" },
    useredit: { path: "users/edit", html: "./views/users/userEdit.html", js: "./pages/users/userEdit.js" },
    clients: { path: "clients", html: "./views/clients.html", js: "./pages/clients.js" }
};

const DEFAULT_ROUTE = "quotes";
let navigationId = 0;

function getAppBasePath() {
    const pathname = window.location.pathname.replace(/\/+$/, "") || "/";
    const menuPath = pathname.match(/^(.*\/menu)(?:\.html)?(?:\/.*)?$/);

    // Tambem funciona quando o sistema esta em uma subpasta, como /sistema/menu.
    if (menuPath) return menuPath[1] || "/menu";

    return pathname === "/" ? "" : pathname.replace(/\/[^/]*$/, "");
}

const appBasePath = getAppBasePath();
const applicationPath = appBasePath.replace(/\/menu$/, "");

function getRouteFromLocation() {
    const pathname = window.location.pathname.replace(/\/+$/, "") || "/";
    const menuPath = pathname.match(/^(.*\/menu)(?:\.html)?(?:\/(.*))?$/);
    const routePath = menuPath?.[2] || "";

    return Object.entries(routes).find(([, config]) => config.path === routePath)?.[0]
        ?? (routePath === "quotes" ? DEFAULT_ROUTE : null);
}

function getRouteUrl(route, query = {}) {
    const config = routes[route];
    const baseUrl = `${appBasePath}${config.path ? `/${config.path}` : ""}` || "/";
    const searchParams = new URLSearchParams(
        Object.entries(query).filter(([, value]) => value !== undefined && value !== null && value !== "")
    );
    const search = searchParams.toString();

    return `${baseUrl}${search ? `?${search}` : ""}`;
}

function getViewUrl(viewPath) {
    return `${applicationPath}/${viewPath.replace(/^\.\//, "")}`;
}

function syncNavigationLinks() {
    document.querySelectorAll("a[data-route]").forEach((link) => {
        const route = link.dataset.route;
        if (routes[route]) link.href = getRouteUrl(route);
    });
}

function showRouteError() {
    document.querySelector("#viewContent").innerHTML =
        '<div class="alert alert-danger" role="alert">Não foi possível carregar esta página.</div>';
}

export async function navigate(route, { query = {}, replace = false, updateHistory = true } = {}) {
    const routeName = routes[route] ? route : DEFAULT_ROUTE;
    const config = routes[routeName];
    const app = document.querySelector("#viewContent");
    const currentNavigation = ++navigationId;

    if (updateHistory) {
        history[replace ? "replaceState" : "pushState"](
            { route: routeName }, "", getRouteUrl(routeName, query)
        );
    }

    app.setAttribute("aria-busy", "true");

    try {
        const response = await fetch(getViewUrl(config.html));
        if (!response.ok) throw new Error(`Failed to load view: ${config.html}`);

        const html = await response.text();
        // Ignora uma resposta antiga quando o usuario navega rapidamente.
        if (currentNavigation !== navigationId) return;

        app.innerHTML = html;

        if (config.js) {
            const module = await import(config.js);
            if (currentNavigation !== navigationId) return;
            await module.init?.();
        }

        window.scrollTo(0, 0);
        document.dispatchEvent(new CustomEvent("routechange", { detail: { route: routeName } }));
    } catch (error) {
        console.error(error);
        if (currentNavigation === navigationId) showRouteError();
    } finally {
        if (currentNavigation === navigationId) app.removeAttribute("aria-busy");
    }
}

export function initRouter() {
    syncNavigationLinks();

    document.addEventListener("click", (event) => {
        const link = event.target.closest("a[data-route]");
        if (!link || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

        const route = link.dataset.route;
        if (!routes[route] || link.target === "_blank") return;

        event.preventDefault();
        navigate(route).catch(console.error);
    });

    window.addEventListener("popstate", () => {
        const route = getRouteFromLocation() || DEFAULT_ROUTE;
        navigate(route, {
            query: Object.fromEntries(new URLSearchParams(window.location.search)),
            updateHistory: false
        }).catch(console.error);
    });

    // Converte links antigos, como /menu#users, para a nova URL sem hash.
    const legacyRoute = window.location.hash.slice(1);
    const currentRoute = getRouteFromLocation();
    const route = routes[legacyRoute] ? legacyRoute : currentRoute || DEFAULT_ROUTE;

    navigate(route, {
        query: Object.fromEntries(new URLSearchParams(window.location.search)),
        replace: Boolean(legacyRoute) || !currentRoute,
        updateHistory: Boolean(legacyRoute) || !currentRoute
    }).catch(console.error);
}
