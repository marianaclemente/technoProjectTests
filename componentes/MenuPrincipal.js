
export default {
    name: 'MenuPrincipal',
    template: `
    <div>
        <header class="header">
            <img class="logo" src="./assets/techno.svg" alt="Techno">
            <div class="carrinho_menu" @click="carrinhoAtivo = true">{{carrinhoTotal | numeroPreco}} | {{carrinho.length}}</div>  
        </header>

        <section class="produtos">
            <div v-for="item in produtos" @click="abrirModal(item.id)" :key="item.id" class="produto">
                <img :src="item.img" :alt="item.nome" class="produto_img"/>
                <div class="produto_info">
                    <span class="produto_preco">{{item.preco | numeroPreco}}</span>
                    <h2 class="produto_titulo">{{item.nome}}</h2>
                </div>
            </div>
        </section>

        <section class="modal" v-if="produto" @click="fecharModal">
            <div class="modal_container">
                <div class="modal_img">
                    <img :src="produto.img" :alt="produto.nome">
                </div>
                <div class="modal_dados">
                    <button @click="produto = false"class="modal_fechar">X</button>
                    <span class="nodal_preco">{{produto.preco | numeroPreco}}</span>
                    <h2 class="modal_titulo">{{produto.nome}}</h2>
                    <p>{{produto.descricao}}</p>
                    <button v-if="produto.estoque > 0" class="modal_btn" 
                        @click="adicionarItem">Adicionar Item</button>
                    <button v-else class="modal_btn esgotado" disabled>Produto Esgotado</button>
                </div>
                <div class="avaliacoes">
                    <h2 class="avaliacoes_subtitulo">Avaliações</h2>
                    <ul>
                        <li v-for="avaliacao in produto.reviews" class="avaliacao">
                            <p class="avaliacao_descricao">{{avaliacao.descricao}}</p>
                            <p class="avaliacao_usuario">{{avaliacao.nome}} | {{avaliacao.estrelas}} estrelas</p>
                        </li>
                    </ul>
                </div>
            </div>
        </section>

        <section class="carrinho_modal" :class="{ativo: carrinhoAtivo}" @click="clickForaCarrinho">
            <div class="carrinho_container">
                <button class="carrinho_fechar" @click="carrinhoAtivo = false">X</button>
                <h2 class="carrinho_titulo">Carrinho</h2>
                <div>
                    <ul class="carrinho_lista">
                        <li v-for="(item, index) in carrinho" class="carrinho_item">
                            <p>{{item.nome}}</p>
                            <p class="carrinho_preco">{{item.preco | numeroPreco}}</p>
                            <button class="carrinho_remover" @click="removerItem(index)">X</button>
                        </li>
                    </ul>
                    <p class="carrinho_total">{{carrinhoTotal | numeroPreco}}</p>
                    <button class="carrinho_finalizar">Finalizar Compra</button>
                </div>
            </div>
        </section>

        <div class="alerta" :class="{ativo: alertaAtivo}">
            <p  class="alerta_mensagem">{{mensagemAlerta}}</p>
        </div>
    </div>`,
    data() {
        return {
            produtos: [],
            produto: false,
            carrinho: [],
            carrinhoAtivo: false,
            mensagemAlerta: "Item adicionado",
            alertaAtivo: false,
        };
    },
    filters: {
        numeroPreco(valor) {
            return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
        }
    },
    computed: {
        carrinhoTotal() {
            let total = 0;
            if (this.carrinho.length) {
                this.carrinho.forEach(item => {
                    total += item.preco;
                })
            }
            return total;
        }
    },
    methods: {
        fetchProdutos() {
            fetch("./api/produtos.json")
                .then(r => r.json())
                .then(r => {
                    this.produtos = r;
                })
        },
        fetchProduto(id) {
            fetch(`./api/produtos/${id}/dados.json`)
                .then(r => r.json())
                .then(r => {
                    this.produto = r;
                })
        },
        abrirModal(id) {
            this.fetchProduto(id);
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        },
        fecharModal({ target, currentTarget }) {
            if (target === currentTarget) this.produto = false
        },
        clickForaCarrinho({ target, currentTarget }) {
            if (target === currentTarget) this.carrinhoAtivo = false
        },
        adicionarItem() {
            this.produto.estoque--;
            const { id, nome, preco } = this.produto;
            this.carrinho.push({ id, nome, preco });
            this.alerta(`${nome} adicionado ao carrinho.`);
        },
        removerItem(index) {
            this.carrinho.splice(index, 1);
        },
        checarLocalStorage() {
            if (window.localStorage.carrinho)
                this.carrinho = JSON.parse(window.localStorage.carrinho);
        },
        compararEstoque() {
            const items = this.carrinho.filter(({ id }) => id === this.produto.id);
            this.produto.estoque -= items.length;
        },
        alerta(mensagem) {
            this.mensagemAlerta = mensagem;
            this.alertaAtivo = true;
            setTimeout(() => {
                this.alertaAtivo = false;
            }, 1500);
        },
        router() {
            const hash = document.location.hash;
            if (hash) {
                this.fetchProduto(hash.replace("#", ""));
            }
        }
    },

    watch: {
        produto() {
            document.title = this.produto.nome || "Techno";
            const hash = this.produto.id || "";
            history.pushState(null, null, `#${hash}`);
            if (this.produto) {
                this.compararEstoque();
            }
        },
        carrinho() {
            window.localStorage.carrinho = JSON.stringify(this.carrinho);
        }
    },
    created() {
        this.fetchProdutos();
        this.router();
        this.checarLocalStorage();
    }
}