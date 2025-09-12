package com.joca0.estoque.repositories;

import com.joca0.estoque.model.Venda;
import org.springframework.data.jpa.repository.JpaRepository;

public interface VendaRepository extends JpaRepository<Venda, Long> {
}
