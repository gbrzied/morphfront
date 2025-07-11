"use client";
import React, { useState, useEffect } from "react";
import { StoreSelector } from "./store-section-selector";
import { ProductList } from "./product-list";
import { ProductForm } from "./product-form";
import { getTourData, TourData } from "@/app/_consts/tourdata";
import { useLanguage } from "@/hooks/useLanguage";
import type { ProductWithObjects } from "@/hooks/useProducts";

export function ProductManagement() {
    const [currentView, setCurrentView] = useState<"selector" | "list" | "form">("selector");
    const [selectedSection, setSelectedSection] = useState<{
        id: string;
        storeName: string;
        sectionTitle: string;
    } | null>(null);
    const [editingProduct, setEditingProduct] = useState<ProductWithObjects | undefined>(undefined);
    const [tourData, setTourData] = useState<TourData>({ scenes: [] });
    const [isLoadingTourData, setIsLoadingTourData] = useState(true);
    const { t } = useLanguage();

    // Fetch tour data on component mount
    useEffect(() => {
        const fetchTourData = async () => {
            try {
                setIsLoadingTourData(true);
                const data = await getTourData();
                setTourData(data);
            } catch (error) {
                console.error('Failed to fetch tour data:', error);
            } finally {
                setIsLoadingTourData(false);
            }
        };

        fetchTourData();
    }, []);

    const handleSectionSelect = (sectionId: string, storeName: string, sectionTitle: string) => {
        setSelectedSection({ id: sectionId, storeName, sectionTitle });
        setCurrentView("list");
    };

    const handleEditProduct = (product: ProductWithObjects) => {
        setEditingProduct(product);
        setCurrentView("form");
    };

    const handleCreateProduct = () => {
        setEditingProduct(undefined);
        setCurrentView("form");
    };

    const handleBackToSelector = () => {
        setSelectedSection(null);
        setEditingProduct(undefined);
        setCurrentView("selector");
    };

    const handleBackToList = () => {
        setEditingProduct(undefined);
        setCurrentView("list");
    };

    const handleProductSaved = () => {
        setEditingProduct(undefined);
        setCurrentView("list");
    };

    if (isLoadingTourData) {
        return (
            <div className="flex items-center justify-center p-8">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-morpheus-gold-dark mx-auto mb-4"></div>
                    <p className="text-gray-600">{t('admin.loadingTourData')}</p>
                </div>
            </div>
        );
    }

    if (currentView === "selector") {
        return (
            <StoreSelector
                selectedStore={selectedSection?.id || null}
                onStoreSelect={(storeId, storeName) => handleSectionSelect(storeId, storeName, storeName)}
                tourData={tourData}
            />
        );
    }

    if (currentView === "list" && selectedSection) {
        return (
            <ProductList
                storeId={selectedSection.id}
                storeName={selectedSection.storeName}
                onEditProduct={handleEditProduct}
                onCreateProduct={handleCreateProduct}
                onBack={handleBackToSelector}
            />
        );
    }

    if (currentView === "form" && selectedSection) {
        return (
            <ProductForm
                product={editingProduct}
                storeId={selectedSection.id}
                storeName={selectedSection.storeName}
                onBack={handleBackToList}
                onSave={handleProductSaved}
            />
        );
    }

    return null;
}
