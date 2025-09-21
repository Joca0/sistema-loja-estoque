package com.joca0.estoque.service;

import com.joca0.estoque.model.Cliente;
import com.joca0.estoque.model.ItemVenda;
import com.joca0.estoque.model.Produto;
import com.joca0.estoque.model.Venda;
import com.joca0.estoque.repositories.ProdutoRepository;
import com.joca0.estoque.repositories.VendaRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class VendaService {

    private final VendaRepository vendaRepository;
    private final ProdutoRepository produtoRepository;

    public VendaService(VendaRepository vendarepository, ProdutoRepository produtoRepository) {
        this.vendaRepository = vendarepository;
        this.produtoRepository = produtoRepository;
    }

    @Transactional
    public Venda registrarVenda(Cliente cliente, List<ItemVenda> itens) {

        Venda venda = new Venda();
        venda.setCliente(cliente);
        venda.setData(LocalDateTime.now());

        double valorTotal = 0;

        for (ItemVenda item : itens) {
            Produto produto = produtoRepository.findById(item.getProduto().getId())
                    .orElseThrow(() -> new RuntimeException("Produto não encontrado"));

            //Validação de estoque
            if (produto.getQuantidade() < item.getQuantidade()) {
                throw new RuntimeException("Quantidade insuficiente");
            }
            //Atualiza o estoque
            produto.setQuantidade(produto.getQuantidade() - item.getQuantidade());
            produtoRepository.save(produto);

            //Cálculo do valor total da venda com base 100% no Banco de Dados
            double subtotal = produto.getPreco() * item.getQuantidade();
            item.setSubtotal(subtotal);
            valorTotal += subtotal;

            item.setVenda(venda);
            item.setProduto(produto);
            }

        venda.setValorTotal(valorTotal);
        venda.setItens(itens);
        return vendaRepository.save(venda);
    }

    public Venda buscarPorId(Long id) {
        return vendaRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Venda não encontrada"));
    }

    public Venda atualizarVenda(Long id, Venda vendaAtualizada) {
        return vendaRepository.findById(id)
                .map(venda -> {
                    venda.setCliente(vendaAtualizada.getCliente());
                    venda.setData(vendaAtualizada.getData());
                    venda.setValorTotal(vendaAtualizada.getValorTotal());
                    venda.setItens(vendaAtualizada.getItens());
                    return vendaRepository.save(vendaAtualizada);
                })
                .orElseThrow(() -> new RuntimeException("Venda não encontrada"));
    }

    public List<Venda> listarVendas() {
        return vendaRepository.findAll();
    }

    public void deletar(Long id) {
        if (vendaRepository.existsById(id)) {
            vendaRepository.deleteById(id);
            System.out.println("Cliente deletado com sucesso!");
        } else {
            throw new RuntimeException("Cliente não encontrado");
        }
    }
}
