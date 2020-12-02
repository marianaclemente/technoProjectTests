//import { expect, it } from '@jest/globals'
import _interopRequireDefault from '@babel/runtime/helpers/interopRequireDefault'
import { mount, shallowMount } from '@vue/test-utils'
import AppJs from './app.js'
import "isomorphic-fetch"
import { expect, it } from '@jest/globals'
import { async } from 'regenerator-runtime'

/*function sum(a, b) {
    return a + b;
}
test('adds 1 + 2 to equal 3', () => {
    expect(sum(1, 2)).toBe(3);
});*/

describe('Adicionar Item', () => {
    //const qtd = wrapper.produto
    const wrapper = mount(AppJs)
    //wrapper.vm.fetchProdutos()
    wrapper.vm.produto = {
        "id": "notebook",
        "nome": "Notebook",
        "preco": 2999,
        "descricao": "Todas estas questões, devidamente ponderadas, levantam dúvidas sobre se a necessidade de renovação processual causa impacto indireto na reavaliação do orçamento setorial.",
        "estoque": 12,
        "img": "./api/produtos/notebook/notebook-foto.jpg",
        "reviews": [
            {
                "nome": "Fábio",
                "estrelas": 5,
                "descricao": "Gostei muito do produto, atendeu todas as minhas necessidades"
            },
            {
                "nome": "Fábio",
                "estrelas": 5,
                "descricao": "Gostei muito do produto, atendeu todas as minhas necessidades"
            }
        ]
    }

    it('Retorna nada, sem produto', async () => {
        const wrapper = mount(AppJs)
        const adicionar = wrapper.vm.adicionarItem()
        expect(adicionar).toBe(undefined)

    })

    it('Altera estoque, se tiver produto', async () => {

        wrapper.vm.adicionarItem()
        expect(wrapper.vm.produto.estoque).toBe(11)

    })

    it('Confere carrinho', async () => {
        const { id, nome, preco } = wrapper.vm.produto
        wrapper.vm.adicionarItem()
        const esperado = { "id": "notebook", "nome": "Notebook", "preco": 2999 }
        expect({ id, nome, preco }).toStrictEqual(esperado)

    })

    it('Verifica se alerta tá exibindo a mensagem correta', async () => {
        const { id, nome, preco } = wrapper.vm.produto
        const esperado = wrapper.vm.mensagemAlerta
        expect(`${nome} adicionado ao carrinho.`).toStrictEqual(esperado)
    })
    /*it('Monta componente', async () => {
        //const wrapper = mount(AppJs, { methods: { fetchProdutos } })
    })*/
})

describe('Remover Item', () => {
    it('Remove nada, sem produto', async () => {
        const wrapper = mount(AppJs)
        const remover = wrapper.vm.removerItem()
        expect(remover).toBe(undefined)

    })

    it('Remove item do carrinho', async () => {
        const wrapper = mount(AppJs)
        wrapper.vm.carrinho = [{ "id": "notebook", "nome": "Notebook", "preco": 2999 },
        { "id": "smartwatch", "nome": "Smartwatch", "preco": 5000 },
        { "id": "tablet", "nome": "Tablet", "preco": 1500 }]
        //remove elemento de index 0
        wrapper.vm.removerItem(0)
        expect(wrapper.vm.carrinho[0].id).toStrictEqual("smartwatch")
    })

})

describe('Comparar Estoque', () => {
    it('Atualiza estoque', async () => {
        const wrapper = mount(AppJs)
        wrapper.vm.produto = {
            "id": "smartwatch",
            "nome": "Smartwatch",
            "preco": 1199,
            "descricao": "Todas estas questões, devidamente ponderadas, levantam dúvidas sobre se a necessidade de renovação processual causa impacto indireto na reavaliação do orçamento setorial.",
            "estoque": 5,
            "img": "./api/produtos/smartwatch/smartwatch-foto.jpg",
            "reviews": [
                {
                    "nome": "Rogério",
                    "estrelas": 5,
                    "descricao": "Gostei muito do produto, atendeu todas as minhas necessidades."
                },
                {
                    "nome": "Nathália",
                    "estrelas": 4,
                    "descricao": "Gostei, mas o preço poderia ser melhor."
                }
            ]
        }
        wrapper.vm.carrinho = [{ "id": "notebook", "nome": "Notebook", "preco": 2999 },
        { "id": "smartwatch", "nome": "Smartwatch", "preco": 1199 },
        { "id": "tablet", "nome": "Tablet", "preco": 1500 },
        { "id": "tablet", "nome": "Tablet", "preco": 1500 },
        { "id": "notebook", "nome": "Notebook", "preco": 2999 },
        { "id": "smartwatch", "nome": "Smartwatch", "preco": 1199 },
        { "id": "smartwatch", "nome": "Smartwatch", "preco": 1199 }]
        //remove elemento de index 0
        wrapper.vm.compararEstoque()
        expect(wrapper.vm.produto.estoque).toBe(2)
    })

})
