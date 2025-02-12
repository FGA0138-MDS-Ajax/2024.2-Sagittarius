const handleSubmit = async (e) => {
    e.preventDefault();
    const nomeCliente = formData.nomeCliente || "Cliente sem nome";
    try {
      const response = await axios.post("http://localhost:8000/api/order/register/", {
        name: nomeCliente,
        tipe: formData.tipoVenda,
        payment: formData.metodoPagamento,
        products: formData.produtos.map((produto) => ({
          id: produto.id,
          name: produto.name,
          price: produto.price,
          quantidade: produto.quantidade,
        })),
      });
  
      if (response.status === 201) {
        for (const produto of formData.produtos) {
            const produtoEstoque = produtosEstoque.find(
                (p) => p.name === produto.name  // Buscar pelo nome
            );
    
            if (produtoEstoque) {
                const novaQtd = produtoEstoque.qtd - produto.quantidade;
    
                // Verifica se há estoque suficiente antes de atualizar
                if (novaQtd < 0) {
                    alert(`Estoque insuficiente para o produto: ${produto.name}`);
                    return; // Interrompe o loop e não permite a atualização
                }
    
                await axios.put(
                  `http://localhost:8000/api/product/update/`,
                  {
                      oldName: produtoEstoque.name, // Nome antigo
                      newName: produtoEstoque.name, // Nome novo (mesmo nome)
                      qtd: novaQtd, // Atualiza a quantidade no estoque
                      price: produtoEstoque.price // Mantém o preço original
                    }
                );
            }
        }
        fetchVendas();
        closeModal();
    }
    } catch (error) {
      console.error("Erro ao realizar venda/encomenda", error);
    }
  };