// src/Pages/Agen/PermintaanOrder.jsx
import React from "react";
import Layout from "../../Components/ComponentsDashboard/Layout/Layout";
import PageTitle from "../../components/ComponentsDashboard/Common/PageHeader";
import OrderForm from "../../components/ComponentsDashboard/Agen/PermintaanOrder/OrderForm";
import SubmitButton from "../../components/ComponentsDashboard/Common/SubmitButton";
import { usePermintaanOrderPage } from "../../hooks/Agen/PermintaanOrder/usePermintaanOrder";

const PermintaanOrder = () => {
    const props = usePermintaanOrderPage();

    // Jika masih loading, tidak render apapun
    if (props.loading) return null;

    // Tampilkan error jika ada
    if (props.error) {
        return <div className="text-red-600 text-center py-10">{props.error}</div>;
    }

    return (
        <Layout {...props.layoutProps} role="agen">
            <PageTitle {...props.pageTitleProps} />
            <OrderForm {...props.orderFormProps}>
                <SubmitButton onClick={props.handleSubmit} />
            </OrderForm>
        </Layout>
    );
};

export default PermintaanOrder;
