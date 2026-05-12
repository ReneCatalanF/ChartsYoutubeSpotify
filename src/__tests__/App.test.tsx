//import { describe, it, expect } from 'vitest';
//import { cleanup, fireEvent, render, screen } from '@testing-library/react';
//import { cleanup, render, screen } from '@testing-library/react';
//import App from '../App';
//import Foods from '../components/Foods'
//import FoodOrder from '../components/FoodOrder';


// Tests
describe('Renders main page correctly', async () => {



/*
  it('Should render the page correctly', async () => {
    // Inicialización
    render(<App />);
    const h3 = await screen.queryByText('Comida Rápida Online');
    // Comprobaciones
    expect(h3).not.toBeNull();
    cleanup();
  });

  it('cuatro productos en la carta inicial con alguno de los stocks, imagen y nombre', async () => {
    render(<App />);

    // Revisamos si existen 4 productos en la lista
    expect(screen.getAllByRole('listitem')).toHaveLength(4);

    // Revisamos que existan los nombres
    const expectedNames = ['Hamburguesa de Pollo', 'Hamburguesa de Vacuno', 'Hamburguesa de Cerdo', 'Hamburguesa de Hormiga'];
    expectedNames.forEach((name) => {
      expect(screen.getByText(name));
    });

    // Revisamos si existe la cantidad ,teniendo en cuenta que comienza con #
    const quantities = screen.getAllByText(/#\d+/);
    expect(quantities).toHaveLength(4);
    cleanup();
  });

  
  it('en la pantalla de Pedir Comida se muestran cuatro productos y alguno de los precios', async () => {
    render(<Foods foodItems={[
      {
        "id": 1,
        "name": "Hamburguesa de Pollo",
        "quantity": 40,
        "desc": "Hamburguesa de pollo frito - … y mayonesa",
        "price": 24,
        "image": "Hamburg.jpg"
      },
      {
        "id": 2,
        "name": "Hamburguesa de Vacuno",
        "quantity": 50,
        "desc": "Hamburguesa de Vacuno frito - … con tomate y mayonesa",
        "price": 26,
        "image": "Hamburg.jpg"
      },
      {
        "id": 3,
        "name": "Hamburguesa de Cerdo",
        "quantity": 60,
        "desc": "Hamburguesa de Cerdo frito - … con tomate y mayonesa",
        "price": 26,
        "image": "Hamburg.jpg"
      },
      {
        "id": 4,
        "name": "Hamburguesa de Hormiga",
        "quantity": 70,
        "desc": "Hamburguesa de Hormiga frita - … con tomate y mayonesa",
        "price": 26,
        "image": "Hamburg.jpg"
      },
    ]} />);

    // Revisamos si existen 4 productos en la pantalla
    expect(screen.getAllByRole('listitem')).toHaveLength(4);


    //const quantities = screen.getAllByText(/^\$\s*\d+(\.\d+)?$/m)
    const quantities = screen.getAllByTestId('foodPrice');
    expect(quantities).toHaveLength(4);

    cleanup();
  });*/

  /*
  it('en la compra se actualiza correctamente el precio para una cantidad introducida', async () => {
    const mockOnReturnToMenu = undefined;
    const mockMenuItems = [
      { id: 1, name: 'Hamburguesa de Pollo', price: 20, quantity: 5 , image: '', desc: ''},
      { id: 2, name: 'Hamburguesa de Vacuno', price: 25, quantity: 3 },
    ];
    render(<FoodOrder food={mockMenuItems[0]} onReturnToMenu={mockOnReturnToMenu} />);


    const quantityInput = screen.getByRole('spinbutton');

    fireEvent.change(quantityInput, { target: { value: '3' } });

    // Calcula el precio esperado
    const expectedPrice = mockMenuItems[0].price * 3;

    // Obtiene el texto del precio y lo convierte a número
    const displayedPriceText = screen.getByText(expectedPrice.toString()).textContent;
    const displayedPrice = parseInt(displayedPriceText || '0', 10);

    expect(displayedPrice).toBe(expectedPrice);

    cleanup();
  });*/

});


