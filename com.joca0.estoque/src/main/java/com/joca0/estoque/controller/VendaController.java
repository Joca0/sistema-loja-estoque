package com.joca0.estoque.controller;

import com.joca0.estoque.model.Venda;
import com.joca0.estoque.service.ProdutoService;
import com.joca0.estoque.service.VendaService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/venda")
public class VendaController {

    private final VendaService vendaService;
    private final ProdutoService produtoService;

    public VendaController(VendaService vendaService, ProdutoService produtoService) {
        this.vendaService = vendaService;
        this.produtoService = produtoService;
    }

    @GetMapping
    public List<Venda> listarVendas() {
        return vendaService.listarVendas();
    }

    @GetMapping("/{id}")
    public Venda buscarPorId(@PathVariable Long id) {
        return vendaService.buscarPorId(id);

    }

    @PostMapping
    public Venda registrarVenda(@RequestBody Venda venda) {
        return vendaService.registrarVenda(venda.getCliente(), venda.getItens());
    }

    @PutMapping("/{id}")
    public Venda atualizarVenda(@PathVariable Long id, @RequestBody Venda vendaAtualizada) {
        return vendaService.atualizarVenda(id, vendaAtualizada);
    }

    @DeleteMapping("/{id}")
    public void deletar(@PathVariable Long id) {
        vendaService.deletar(id);
    }



}
