// src/components/fragments/seller/ProductSearchBarcode.jsx
import { useState, useRef } from 'react';
import { Barcode } from 'lucide-react';
import Input from '@components/ui/Input';
import Button from '@components/ui/Button';
import ProductoService from '@services/ProductoService';
import { useSaleContext } from '@context/SaleContext';

const ProductSearchBarcode = () => {
    const { addToCart } = useSaleContext();
    const barcodeInputRef = useRef(null);
    const [barcodeInput, setBarcodeInput] = useState('');
    const [isSearching, setIsSearching] = useState(false);

    const searchProductByCode = async (code) => {
        if (!code.trim()) return;

        try {
            setIsSearching(true);
            const product = await ProductoService.getByCode(code);

            if (product) {
                addToCart(product);
                setBarcodeInput('');
                barcodeInputRef.current?.focus();
            }
        } catch (error) {
            console.error('Error buscando por código:', error);
            alert('Producto no encontrado con ese código');
        } finally {
            setIsSearching(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && barcodeInput) {
            searchProductByCode(barcodeInput);
        }
    };

    return (
        <div className="flex gap-2">
            <Input
                ref={barcodeInputRef}
                placeholder="Escanear código de barras..."
                value={barcodeInput}
                onChange={(e) => setBarcodeInput(e.target.value)}
                onKeyPress={handleKeyPress}
                leftIcon={<Barcode className="w-5 h-5" />}
                disabled={isSearching}
            />
            <Button
                onClick={() => searchProductByCode(barcodeInput)}
                disabled={!barcodeInput || isSearching}
                loading={isSearching}
            >
                Buscar
            </Button>
        </div>
    );
};

export default ProductSearchBarcode;