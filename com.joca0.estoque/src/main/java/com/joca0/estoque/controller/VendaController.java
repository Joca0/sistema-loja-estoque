package com.joca0.estoque.controller;

import com.joca0.estoque.model.Venda;
import com.joca0.estoque.service.ClienteService;
import com.joca0.estoque.service.ProdutoService;
import com.joca0.estoque.service.VendaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
public class VendaController {

    private final VendaService vendaService;
    private final ProdutoService produtoService;
    private final ClienteService clienteService;

    @Autowired
    public VendaController(VendaService vendaService, ProdutoService produtoService, ClienteService clienteService) {
        this.vendaService = vendaService;
        this.produtoService = produtoService;
        this.clienteService = clienteService;
    }

    // REST API endpoints
    @GetMapping("/vendas")
    @ResponseBody
    public List<Venda> listarVendas() {
        return vendaService.listarVendas();
    }

    @GetMapping("/vendas/{id}")
    @ResponseBody
    public Venda buscarPorId(@PathVariable Long id) {
        return vendaService.buscarPorId(id);
    }

    @PostMapping("/vendas")
    @ResponseBody
    public Venda registrarVenda(@RequestBody Venda venda) {
        return vendaService.registrarVenda(venda.getCliente(), venda.getItens());
    }

    @PutMapping("/vendas/{id}")
    @ResponseBody
    public Venda atualizarVenda(@PathVariable Long id, @RequestBody Venda vendaAtualizada) {
        return vendaService.atualizarVenda(id, vendaAtualizada);
    }

    @DeleteMapping("/vendas/{id}")
    @ResponseBody
    public void deletar(@PathVariable Long id) {
        vendaService.deletar(id);
    }

    // View endpoint
    @GetMapping("/vendas-page")
    public String paginaVendas(Model model) {
        // Adiciona a lista de vendas ao modelo
        List<Venda> vendas = vendaService.listarVendas();
        model.addAttribute("vendas", vendas);

        // Adiciona a lista de clientes ao modelo para o formulário de adição/edição
        model.addAttribute("clientes", clienteService.buscarTodos());

        // Adiciona a lista de produtos ao modelo para o formulário de adição/edição
        model.addAttribute("produtos", produtoService.listarProdutos());

        return "venda/vendas";
    }



}
