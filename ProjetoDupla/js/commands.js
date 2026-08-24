import * as userData from "./persistence/users.js";
import * as productData from "./persistence/products.js";
import * as categoryData from "./persistence/category.js"
import * as clientData from "./persistence/client.js"

window.scp = {
    registerTestUser() {
        const newUser = {
            name: "Test User",
            username: "test_user",
            email: "testUser@test.com",
            password: "test123"
        }

        userData.create(newUser);
    },

    registerCat() {
        const categories = [
            {
                name: "Tecnologia",
                description: "Novidades, tendências e curiosidades sobre tecnologia."
            },
            {
                name: "Viagens",
                description: "Destinos, dicas e experiências para quem gosta de viajar."
            },
            {
                name: "Gastronomia",
                description: "Receitas, restaurantes e descobertas do mundo da culinária."
            },
            {
                name: "Esportes",
                description: "Notícias, curiosidades e conteúdos sobre diferentes esportes."
            },
            {
                name: "Música",
                description: "Artistas, álbuns, gêneros musicais e novidades do mundo da música."
            },
            {
                name: "Cinema",
                description: "Filmes, lançamentos, críticas e curiosidades cinematográficas."
            },
            {
                name: "Games",
                description: "Jogos, consoles, lançamentos e novidades do universo gamer."
            },
            {
                name: "Educação",
                description: "Conteúdos, dicas e recursos para aprender coisas novas."
            },
            {
                name: "Finanças",
                description: "Informações e dicas sobre dinheiro, investimentos e economia."
            },
            {
                name: "Saúde",
                description: "Conteúdos gerais sobre bem-estar, hábitos saudáveis e qualidade de vida."
            },
            {
                name: "Moda",
                description: "Tendências, estilos e inspirações para diferentes ocasiões."
            },
            {
                name: "Fotografia",
                description: "Técnicas, equipamentos e inspiração para quem gosta de fotografar."
            },
            {
                name: "Natureza",
                description: "Curiosidades e informações sobre animais, plantas e meio ambiente."
            },
            {
                name: "História",
                description: "Fatos, acontecimentos e personagens importantes do passado."
            },
            {
                name: "Ciência",
                description: "Descobertas, experimentos e curiosidades sobre o mundo científico."
            }
        ];

        categories.forEach((value) => {
            categoryData.create(value);
        });
    },

    registerClients() {
        const clients = [
            {
                name: "João Silva",
                email: "joao.silva@email.com",
                phone: "999991111",
                address: "Rua das Flores, 123"
            },
            {
                name: "Maria Santos",
                email: "maria.santos@email.com",
                phone: "988882222",
                address: "Av. Brasil, 456"
            },
            {
                name: "Carlos Oliveira",
                email: "carlos.oliveira@email.com",
                phone: "977773333",
                address: "Rua Goiás, 789"
            },
            {
                name: "Ana Costa",
                email: "ana.costa@email.com",
                phone: "966664444",
                address: "Av. Afonso Pena, 101"
            },
            {
                name: "Pedro Almeida",
                email: "pedro.almeida@email.com",
                phone: "955555555",
                address: "Rua São Paulo, 202"
            }
        ];

        clients.forEach((value) => {
            clientData.create(value);
        });
    },

    registerProducts() {
        const products = [
            {
                name: "Notebook Pro",
                description: "Notebook de alto desempenho para trabalho e estudos, com processador rápido e excelente autonomia de bateria.",
                shortDescription: "Notebook potente para trabalho e estudos.",
                categoryId: 1,
                price: 4599.90
            },
            {
                name: "Mouse Sem Fio",
                description: "Mouse ergonômico sem fio com conexão Bluetooth, sensor de alta precisão e bateria de longa duração.",
                shortDescription: "Mouse sem fio ergonômico e preciso.",
                categoryId: 2,
                price: 149.90
            },
            {
                name: "Teclado Mecânico",
                description: "Teclado mecânico compacto com iluminação RGB, switches de alta durabilidade e conexão USB.",
                shortDescription: "Teclado mecânico compacto com RGB.",
                categoryId: 2,
                price: 299.90
            },
            {
                name: "Monitor Ultra HD",
                description: "Monitor de 27 polegadas com resolução 4K, cores vibrantes e tecnologia para reduzir o cansaço visual.",
                shortDescription: "Monitor 4K de 27 polegadas.",
                categoryId: 3,
                price: 2199.90
            },
            {
                name: "Headset Gamer",
                description: "Headset com áudio surround, microfone integrado e almofadas confortáveis para longas sessões de uso.",
                shortDescription: "Headset gamer com áudio surround.",
                categoryId: 4,
                price: 399.90
            },
            {
                name: "Webcam Full HD",
                description: "Webcam Full HD com microfone integrado, correção automática de iluminação e compatibilidade com diversas plataformas.",
                shortDescription: "Webcam Full HD para reuniões e lives.",
                categoryId: 4,
                price: 249.90
            }
        ];

        products.forEach((product) => {
            productData.create(product);
        });
    },

    registerAll() {
        this.registerCat();
        this.registerClients();
        this.registerProducts();
        this.registerTestUser();
    },

    clear() {
        localStorage.clear();
        console.log("All SCP data cleared.");
    }
};
