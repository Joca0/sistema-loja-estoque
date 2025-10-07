package com.joca0.estoque.controller;

import com.joca0.estoque.model.Produto;
import com.joca0.estoque.service.ProdutoService;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
@RequestMapping("/produtos")
public class ProdutoController {

    private final ProdutoService produtoService;

    public ProdutoController(ProdutoService produtoService) {
        this.produtoService = produtoService;
    }

    @GetMapping
    public String listarProdutos(Model model) {
        try {
            List<Produto> produtos = produtoService.listarProdutos();
            model.addAttribute("produtos", produtos);
            return "produtos/produtos";
        } catch (Exception e) {
            System.err.println("Erro em listarProdutos: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }

    @GetMapping("/{id}")
    @ResponseBody
    public Produto buscarPorId(@PathVariable Long id) {
        return produtoService.buscarPorId(id);
    }

    @PostMapping
    @ResponseBody
    public Produto adicionarProduto(@RequestBody Produto produto) {
        return produtoService.adicionarProduto(produto);
    }

    @PutMapping("/{id}")
    @ResponseBody
    public Produto atualizarProduto(@PathVariable Long id, @RequestBody Produto novoProduto) {
        return produtoService.atualizarProduto(id, novoProduto);
    }

    @DeleteMapping("/{id}")
    @ResponseBody
    public void deletar(@PathVariable Long id) {
        produtoService.deletar(id);
    }
}
