package com.joca0.estoque.repositories;

import com.joca0.estoque.model.Produto;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProdutoRepository extends JpaRepository<Produto, Long> {
    List<Produto> nome(String nome);
    List<Produto> id(Long id);
    List<Produto> findByQuantidadeLessThan(int limite);
}
