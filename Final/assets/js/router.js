const routes = {
    quotes: {
        html: "./views/quotes.html"
    },
    categories: {
        html: "./views/categories.html",
        js: "./pages/categories.js"
    },

    products: {
        html: "./views/products.html",
        js: "./pages/products.js"
    },

    users: {
        html: "./views/users/users.html",
        js: "./pages/users.js"
    },

    userEdit: {
        html: "./views/users/userEdit.html",
        js: "./pages/users.js"
    },
    
    clients: {
        html: "./views/clients.html",
        js: "./pages/clients.js"
    }
};

export async function navigate(route) {
    const config = routes[route];

    if (!config) {
        return navigate("quotes");
    }

    const app = document.querySelector("#viewContent");

    const response = await fetch(config.html);

    if (!response.ok) {
        throw new Error(`Failed to load view: ${config.html}`);
    }

    app.innerHTML = await response.text();

    if (config.js) {
        const module = await import(`${config.js}`);
        module.init();
    }

    window.scrollTo(0, 0);
    document.dispatchEvent(new CustomEvent("routechange", { detail: { route } }));
}

export function initRouter() {
    window.addEventListener("hashchange", () => {
        const route = location.hash.slice(1) || "dashboard";

        navigate(route).catch(console.error);
    });

    const route = location.hash.slice(1) || "dashboard";

    navigate(route).catch(console.error);
}
