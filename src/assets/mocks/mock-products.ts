import { Product } from '../../app/models/product.model';

export const MOCK_PRODUCTS: Product[] = [
    {
        id: 'trj-crd',
        name: 'Tarjeta de Crédito Visa',
        description: 'Tarjeta de consumo bajo la modalidad de crédito',
        logo: 'https://www.visa.com.ec/dam/VCOM/regional/lac/SPA/Default/Pay%20With%20Visa/Tarjetas/visa-signature-400x225.jpg',
        date_release: '2023-02-01',
        date_revision: '2024-02-01'
    },
    {
        id: 'trj-db',
        name: 'Tarjeta de Débito Visa',
        description: 'Tarjeta para consumos con débito inmediato',
        logo: 'https://www.visa.com.ec/dam/VCOM/regional/lac/SPA/Default/Pay%20With%20Visa/Tarjetas/visa-signature-400x225.jpg',
        date_release: '2023-05-01',
        date_revision: '2024-05-01'
    },
    {
        id: 'ctp-ah',
        name: 'Cuenta de Ahorros',
        description: 'Cuenta bancaria para ahorrar con intereses',
        logo: 'https://www.visa.com.ec/dam/VCOM/regional/lac/SPA/Default/Pay%20With%20Visa/Tarjetas/visa-signature-400x225.jpg',
        date_release: '2023-01-01',
        date_revision: '2024-01-01'
    },
    {
        id: 'ctp-cd',
        name: 'Cuenta Corriente',
        description: 'Cuenta bancaria para manejar tu dinero',
        logo: 'https://www.visa.com.ec/dam/VCOM/regional/lac/SPA/Default/Pay%20With%20Visa/Tarjetas/visa-signature-400x225.jpg',
        date_release: '2023-03-01',
        date_revision: '2024-03-01'
    }
];
