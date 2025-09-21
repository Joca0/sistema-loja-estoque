package com.joca0.estoque.service;

import com.joca0.estoque.model.Produto;
import com.joca0.estoque.repositories.ProdutoRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class ProdutoService {

    private final Produto produto = new Produto();
    private final ProdutoRepository produtoRepository;


    public ProdutoService(ProdutoRepository produtoRepository) {
        this.produtoRepository = produtoRepository;
    }

    public List<Produto> listarProdutos() {
        return produtoRepository.findAll();
    }

    public Produto adicionarProduto(Produto produto) {
        if (produto.getQuantidade() < 0) {
            throw new RuntimeException("Quantidade inválida");
        } else {
            return produtoRepository.save(produto);
        }
    }

    public Produto buscarPorId(Long id) {
        return produtoRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Produto não encontrado"));

    }

    public Produto atualizarProduto(Long id, Produto novoProduto) {
        return produtoRepository.findById(id)
            .map(produto -> {
                produto.setNome(novoProduto.getNome());
                produto.setCategoria(novoProduto.getCategoria());
                produto.setPreco(novoProduto.getPreco());
                produto.setQuantidade(novoProduto.getQuantidade());
                return produtoRepository.save(produto);
            })
            .orElseThrow(() -> new RuntimeException("Produto não encontrado"));
    }

    public void deletar(Long id) {
        produtoRepository.deleteById(id);
    }
}
